package com.Thuba.propertymanagement.controller;

import com.Thuba.propertymanagement.config.RabbitConfig;
import com.Thuba.propertymanagement.dto.PropertyDto;
import com.Thuba.propertymanagement.security.JwtUtil;
import com.Thuba.propertymanagement.service.AiTaskTracker;
import com.Thuba.propertymanagement.service.PropertyService;
import com.Thuba.propertymanagement.service.UserDetailsServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PropertyController.class)
@AutoConfigureMockMvc(addFilters = false)
class PropertyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    @SuppressWarnings("unused")
    private PropertyService service;

    @MockBean
    @SuppressWarnings("unused")
    private DataSource dataSource;

    @MockBean
    @SuppressWarnings("unused")
    private RabbitTemplate rabbitTemplate;

    @MockBean
    @SuppressWarnings("unused")
    private AiTaskTracker taskTracker;

    @MockBean
    @SuppressWarnings("unused")
    private JwtUtil jwtUtil;

    @MockBean
    @SuppressWarnings("unused")
    private UserDetailsServiceImpl userDetailsService;

    private PropertyDto testDto;

    @BeforeEach
    void setUp() throws SQLException {
        // Mock the database connection to prevent PostConstruct failure
        Connection mockConnection = mock(Connection.class);
        DatabaseMetaData mockMetaData = mock(DatabaseMetaData.class);
        when(mockMetaData.getURL()).thenReturn("jdbc:mock_url");
        when(mockConnection.getMetaData()).thenReturn(mockMetaData);
        when(dataSource.getConnection()).thenReturn(mockConnection);

        // Fully populate the DTO to pass the @Valid checks in the controller
        testDto = PropertyDto.builder()
                .id(1L)
                .title("Modern Apartment")
                .price(1500000.0)
                .suburb("Sandton")
                .bedrooms(2)
                .bathrooms(1)
                .build();
    }

    @Test
    void getById_ShouldReturn200AndPropertyJson() throws Exception {
        when(service.findById(1L)).thenReturn(testDto);

        mockMvc.perform(get("/api/properties/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Modern Apartment"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void create_ShouldReturn200AndSavedProperty() throws Exception {
        when(service.create(any(PropertyDto.class))).thenReturn(testDto);

        mockMvc.perform(post("/api/properties")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Modern Apartment"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void archive_ShouldReturn204NoContent() throws Exception {
        mockMvc.perform(put("/api/properties/1/archive"))
                .andExpect(status().isNoContent());

        verify(service, times(1)).archive(1L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void submitAiTask_ShouldSendToRabbitMQ_AndReturn202() throws Exception {
        PropertyController.DescriptionRequest request = new PropertyController.DescriptionRequest("A lovely home");
        String jsonPayload = objectMapper.writeValueAsString(request);

        mockMvc.perform(post("/api/properties/suggest-amenities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isAccepted())
                .andExpect(content().string(org.hamcrest.Matchers.notNullValue()));

        verify(taskTracker, times(1)).startTask(anyString());
        verify(rabbitTemplate, times(1)).convertAndSend(eq(RabbitConfig.AI_QUEUE), anyString());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getTaskStatus_WhenPending_ShouldReturnProcessingJson() throws Exception {
        String jobId = "1234-abcd";
        when(taskTracker.getTaskResult(jobId)).thenReturn("PENDING");

        mockMvc.perform(get(String.format("/api/properties/suggest-amenities/status/%s", jobId)))
                .andExpect(status().isProcessing())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.message").value("Task is still running"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getTaskStatus_WhenCompleted_ShouldReturnOkJson() throws Exception {
        String jobId = "1234-abcd";
        List<String> fakeAmenities = List.of("Pool", "WiFi", "Gym");
        when(taskTracker.getTaskResult(jobId)).thenReturn(fakeAmenities);

        mockMvc.perform(get(String.format("/api/properties/suggest-amenities/status/%s", jobId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andExpect(jsonPath("$.data[0]").value("Pool"))
                .andExpect(jsonPath("$.data[1]").value("WiFi"));
    }
}
