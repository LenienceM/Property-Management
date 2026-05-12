package com.Thuba.propertymanagement.service;

import com.Thuba.propertymanagement.config.RabbitConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiMessageListener {

    private final AIService aiService;
    private final AiTaskTracker taskTracker;

    @RabbitListener(queues = RabbitConfig.AI_QUEUE)
    public void processAiTask(String message) {
        // Message format will be "jobId|description"
        String[] parts = message.split("\\|", 2);
        String jobId = parts[0];
        String description = parts[1];

        try {
            System.out.println("Starting AI Task: " + jobId);
            List<String> amenities = aiService.extractAmenities(description);
            taskTracker.completeTask(jobId, amenities);
            System.out.println("Finished AI Task: " + jobId);
        } catch (Exception e) {
            System.err.println("AI Task Failed: " + e.getMessage());
            taskTracker.failTask(jobId);
        }
    }
}