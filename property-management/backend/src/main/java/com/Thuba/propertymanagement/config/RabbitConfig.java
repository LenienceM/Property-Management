package com.Thuba.propertymanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.amqp.core.Queue;

@Configuration
public class RabbitConfig {
    public static final String AI_QUEUE = "ai_amenities_queue";

    @Bean
    public Queue queue() {
        return new Queue(AI_QUEUE, true);
    }
}