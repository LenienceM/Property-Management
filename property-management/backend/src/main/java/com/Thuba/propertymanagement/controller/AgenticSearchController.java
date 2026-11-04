package com.Thuba.propertymanagement.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;
import com.Thuba.propertymanagement.agent.PropertySearchTools;

import java.util.Map;

@RestController
@RequestMapping("/api/properties")
public class AgenticSearchController {

    private final ChatClient chatClient;
    private final PropertySearchTools propertyTools;

    public AgenticSearchController(ChatClient.Builder builder, PropertySearchTools propertyTools) {
        this.chatClient = builder.build();
        this.propertyTools = propertyTools;
    }

    @PostMapping("/search/agentic")
    public String agenticSearch(@RequestBody Map<String, String> payload) {
        String userPrompt = payload.get("query");
        String systemInstruction = "You are a helpful real estate agent. If a search yields no results, autonomously check adjacent suburbs or market averages before replying.";

        // The framework executes the ReAct loop automatically and returns the final synthesized response
        return chatClient.prompt()
                .system(systemInstruction)
                .user(userPrompt)
                .tools(propertyTools) // Attaches all @Tool methods in the component
                .tools("propertySearchTools")
                .call()
                .content();
    }
}
