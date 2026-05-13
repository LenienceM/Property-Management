package com.Thuba.propertymanagement.service;

import com.Thuba.propertymanagement.dto.ContactRequest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactNotification(ContactRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();

        // This is where the email is sent TO (e.g., your client's email)
        message.setTo("admin@pelicanproperties.co.za");

        // Use the inquiry type as the subject
        message.setSubject("New Website Lead: " + request.inquiryType());

        // Construct the body of the email
        String emailBody = String.format(
                "You have received a new inquiry from the Pelican Properties website.\n\n" +
                        "Name: %s\n" +
                        "Email: %s\n" +
                        "Inquiry Type: %s\n\n" +
                        "Message:\n%s",
                request.name(), request.email(), request.inquiryType(), request.message()
        );

        message.setText(emailBody);
        message.setReplyTo(request.email()); // Allows replying directly to the user

        mailSender.send(message);
    }
}