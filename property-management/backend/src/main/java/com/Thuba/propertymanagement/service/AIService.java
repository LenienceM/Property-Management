package com.Thuba.propertymanagement.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j // Replaces printStackTrace with robust logging
@Service
@RequiredArgsConstructor
public class AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final WebClient webClient = WebClient.builder().build();

    public List<String> extractAmenities(String description) {

        String prompt = String.format("""
                Extract amenities from this property description.
                
                Rules:
                - Only return amenities (e.g. Pool, Garage, School, Mall, Security, Garden)
                - No explanations
                - Return as a simple comma-separated list
                
                Description:
                %s
                """, description);

        // Fix: Use UriComponentsBuilder to build the URL cleanly
        String fullUrl = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .queryParam("key", apiKey)
                .toUriString();

        String requestBody = buildRequest(prompt);

        log.debug("Request URL: {}", fullUrl);
        log.debug("Request Body: {}", requestBody);

        try {
            String response = webClient.post()
                    .uri(fullUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info("RAW AI RESPONSE: {}", response);
            return parseAmenities(response);

        } catch (Exception e) {
            // Fix: Log the error properly instead of printStackTrace
            log.error("CRITICAL AI SERVICE ERROR: {}", e.getMessage(), e);
            throw new RuntimeException(String.format("Failed to call AI: %s", e.getMessage()));
        }
    }

    private String buildRequest(String prompt) {
        return String.format("""
                {
                  "contents": [
                    {
                      "parts": [
                        {"text": "%s"}
                      ]
                    }
                  ]
                }
                """, prompt.replace("\"", "\\\""));
    }

    private List<String> parseAmenities(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            String text = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            return Arrays.stream(text.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .distinct()
                    .collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException(String.format("Failed to parse AI response: %s", response));
        }
    }
}