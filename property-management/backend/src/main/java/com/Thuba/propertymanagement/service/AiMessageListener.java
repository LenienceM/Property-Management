package com.Thuba.propertymanagement.service;

import com.Thuba.propertymanagement.config.RabbitConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiMessageListener {

    private final AIService aiService;
    private final AiTaskTracker taskTracker;

    @SuppressWarnings("unused")
    @RabbitListener(queues = RabbitConfig.AI_QUEUE)
    public void processAiTask(String message) {
        // Message format will be "jobId|description"
        String[] parts = message.split("\\|", 2);
        String jobId = parts[0];
        String description = parts[1];

        try {
            log.info("Starting AI Task: {}", jobId);
            List<String> amenities = aiService.extractAmenities(description);
            taskTracker.completeTask(jobId, amenities);
            log.info("Finished AI Task: {}", jobId);
        } catch (Exception e) {
            log.error("AI Task Failed for job {}: {}", jobId, e.getMessage());
            taskTracker.failTask(jobId);
        }
    }
}
