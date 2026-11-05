package com.Thuba.propertymanagement.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> agenticSearch(@RequestBody Map<String, String> payload) {
        System.out.println("========== AGENTIC SEARCH STARTED ==========");
        try {
            String userPrompt = payload.get("query");
            System.out.println("User Prompt: " + userPrompt);

            String systemInstruction = "You are a helpful real estate agent. If a search yields no results, autonomously check adjacent suburbs or market averages before replying.";

            // The framework executes the ReAct loop automatically
            String response = chatClient.prompt()
                    .system(systemInstruction)
                    .user(userPrompt)
                    .tools(propertyTools)
                    .call()
                    .content();

            System.out.println("========== AGENTIC SEARCH SUCCESS ==========");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("========== AGENTIC SEARCH CRASHED ==========");
            e.printStackTrace(); // Forces the exact stack trace to the Render console
            // Returns the actual error message to your frontend instead of a generic 500
            return ResponseEntity.status(500).body("AI Error: " + e.getMessage());
        }
    }
}