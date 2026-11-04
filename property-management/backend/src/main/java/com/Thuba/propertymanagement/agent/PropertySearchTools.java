package com.Thuba.propertymanagement.agent;

import com.Thuba.propertymanagement.dto.PropertyDto;
import com.Thuba.propertymanagement.repository.PropertyRepository;
import com.Thuba.propertymanagement.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PropertySearchTools {

    private final PropertyRepository repository;
    private final PropertyService propertyService;

    @Tool(description = "Search the PostgreSQL database for properties matching exact criteria.")
    public List<PropertyDto> searchProperties(String suburb, Double maxPrice, Integer minBedrooms) {
        return repository.searchByAgenticCriteria(suburb, maxPrice, minBedrooms)
                .stream()
                .map(propertyService::toDto)
                .toList(); // .toList() is available in Java 16+
    }

    @Tool(description = "Get a list of adjacent suburbs near a given target suburb. Use this to expand searches if the initial search returns zero results.")
    public List<String> getAdjacentSuburbs(String targetSuburb) {
        if ("Sandton".equalsIgnoreCase(targetSuburb)) return List.of("Morningside", "Woodmead", "Paulshof");
        if ("Woodmead".equalsIgnoreCase(targetSuburb)) return List.of("Sunninghill", "Paulshof", "Sandton");
        return List.of();
    }

    @Tool(description = "Get the average rental price for a specific suburb and bedroom count to explain unrealistic budgets to the user.")
    public Double getMarketAverage(String suburb, Integer bedrooms) {
        return repository.getAveragePrice(suburb, bedrooms);
    }
}