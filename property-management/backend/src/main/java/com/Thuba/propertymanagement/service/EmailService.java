package com.Thuba.propertymanagement.service;

import com.Thuba.propertymanagement.dto.ContactRequest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendContactNotification(ContactRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("admin@pelicanproperties.co.za");


        );

        message.setText(emailBody);

    }
}