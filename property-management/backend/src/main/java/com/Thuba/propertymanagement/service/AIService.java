package com.Thuba.propertymanagement.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final WebClient webClient = WebClient.builder().build();

    public List<String> extractAmenities(String description) {

        String prompt = """
                Extract amenities from this property description.
                
                Rules:
                - Only return amenities (e.g. Pool, Garage, School, Mall, Security, Garden)
                - No explanations
                - Return as a simple comma-separated list
                
                Description:
                %s
                """.formatted(description);
        System.out.println("DEBUG: Request URL: " + apiUrl + "?key=" + apiKey);
        System.out.println("DEBUG: Request Body: " + buildRequest(prompt));

        try {
            String response = webClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(buildRequest(prompt))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("RAW AI RESPONSE: " + response);
            return parseAmenities(response);

        } catch (Exception e) {
            System.err.println("CRITICAL ERROR: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to call AI: " + e.getMessage());
        }
    }

    private String buildRequest(String prompt) {
        return """
                {
                  "contents": [
                    {
                      "parts": [
                        {"text": "%s"}
                      ]
                    }
                  ]
                }
                """.formatted(prompt.replace("\"", "\\\""));
    }

    private List<String> parseAmenities(String response) {
        try {
            //Extract text from Gemini JSON response

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
            throw new RuntimeException("Failed to parse AI response: " + response);
        }
    }

}