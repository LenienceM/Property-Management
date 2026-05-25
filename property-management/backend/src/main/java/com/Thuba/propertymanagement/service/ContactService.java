package com.Thuba.propertymanagement.service;

import com.Thuba.propertymanagement.dto.ContactRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class ContactService {

    @Value("${resend.api.key}")
    private String resendApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendContactNotification(ContactRequest request) {
        try {
            log.info("ATTEMPTING TO SEND EMAIL VIA RESEND API...");

            String url = "https://api.resend.com/emails";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(resendApiKey); // Automatically adds "Bearer re_..."

            Map<String, Object> body = new HashMap<>();
            // Resend requires you to use their onboarding email until you buy a custom domain
            body.put("from", "Pelican Properties <onboarding@resend.dev>");

            // This MUST be the email address you used to sign up for Resend
            body.put("to", List.of("lenience.moyo@gmail.com"));

            body.put("subject", "New Website Lead: " + request.inquiryType());

            String emailContent = String.format(
                    "You have received a new inquiry from the Pelican Properties website.\n\nName: %s\nEmail: %s\nInquiry Type: %s\n\nMessage:\n%s",
                    request.name(),
                    request.email(),
                    request.inquiryType(),
                    request.message()
            );

            body.put("text", emailContent);
            body.put("reply_to", request.email()); // So you can hit "reply" directly to the customer

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            restTemplate.postForObject(url, entity, String.class);
            log.info("EMAIL SENT SUCCESSFULLY VIA API!");

        } catch (Exception e) {
            log.error("ERROR: API EMAIL FAILED TO SEND!", e);
            throw new RuntimeException(String.format("Email API failed: %s", e.getMessage()));
        }
    }
}