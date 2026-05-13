package com.Thuba.propertymanagement.controller;


import com.Thuba.propertymanagement.dto.ContactRequest;
import com.Thuba.propertymanagement.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
// Ensure your React app's URL is allowed here for local development
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    private final EmailService emailService;

    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<String> submitContactForm(@RequestBody ContactRequest request) {
        emailService.sendContactNotification(request);
        return ResponseEntity.ok("Message sent successfully");
    }
}