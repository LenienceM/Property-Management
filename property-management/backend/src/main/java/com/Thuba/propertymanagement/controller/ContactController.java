package com.Thuba.propertymanagement.controller;

import com.Thuba.propertymanagement.dto.ContactRequest;
import com.Thuba.propertymanagement.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService emailService;

    public ContactController(ContactService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<String> submitContactForm(@RequestBody ContactRequest request) {
        emailService.sendContactNotification(request);
        return ResponseEntity.ok("Message sent successfully");
    }
}
