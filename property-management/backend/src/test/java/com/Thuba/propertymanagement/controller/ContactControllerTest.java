package com.Thuba.propertymanagement.controller;

import com.Thuba.propertymanagement.dto.ContactRequest;
import com.Thuba.propertymanagement.security.JwtUtil;
import com.Thuba.propertymanagement.service.ContactService;
import com.Thuba.propertymanagement.service.UserDetailsServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
        value = ContactController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class}
)
@AutoConfigureMockMvc(addFilters = false)
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ContactService contactService;

    // Provide mock beans for the security components that are picked up by component scanning
    @MockBean
    private JwtUtil jwtUtil;
    
    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @Test
    void submitContactFormShouldReturnOk() throws Exception {
        //Arrange: Create a request object
        ContactRequest request = new ContactRequest("John Doe", "john.doe@example.com", "inquiry", "Test message");

        // Act & Assert: Perform the request and check the response
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Message sent successfully"));

        //Verify: Check that the service method was called
        verify(contactService, times(1)).sendContactNotification(request);
    }
}
