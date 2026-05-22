package com.Thuba.propertymanagement.service;

import com.Thuba.propertymanagement.dto.ContactRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private ContactService emailService;

    @Test
    void sendContactNotificationShouldSucceed() {
        // Arrange: Create a request object
        ContactRequest request = new ContactRequest("Jane Doe", "jane.doe@example.com", "Test inquiry", "inquiry");

        // Act: Call the method under test
        emailService.sendContactNotification(request);

        // Verify: Check that the mailSender.send() method was called
        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender, times(1)).send(messageCaptor.capture());

        // Assert
        SimpleMailMessage sentMessage = messageCaptor.getValue();
        assertEquals("admin@pelicanproperties.co.za", sentMessage.getTo()[0]);
        assertEquals("New Website Lead: Test inquiry", sentMessage.getSubject());

    }
}
