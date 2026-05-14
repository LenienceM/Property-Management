package com.Thuba.propertymanagement.service;

import com.Thuba.propertymanagement.dto.ContactRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j //  robust Spring Boot logging
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendContactNotification(ContactRequest request) {
        try {
            log.info("▶️ ATTEMPTING TO SEND EMAIL TO admin@pelicanproperties.co.za...");

            SimpleMailMessage message = buildMessage(request);

            mailSender.send(message);
            log.info("✅ EMAIL SENT SUCCESSFULLY!");

        } catch (Exception e) {
            // This logs the exact error safely to Render's logging system
            log.error("❌ CRITICAL ERROR: EMAIL FAILED TO SEND!", e);
            throw new RuntimeException(String.format("Email failed: %s", e.getMessage()));
        }
    }

    private SimpleMailMessage buildMessage(ContactRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("admin@pelicanproperties.co.za");


        message.setSubject(String.format("New Website Lead: %s", request.inquiryType()));

        String emailBody = """
                You have received a new inquiry from the Pelican Properties website.
                
                Name: %s
                Email: %s
                Inquiry Type: %s
                
                Message:
                %s
                """.formatted(
                request.name(),
                request.email(),
                request.inquiryType(),
                request.message()
        );

        message.setText(emailBody);
        message.setReplyTo(request.email());

        return message;
    }
}