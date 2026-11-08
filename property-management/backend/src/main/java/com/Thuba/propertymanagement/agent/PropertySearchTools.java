package com.Thuba.propertymanagement.agent;

import com.Thuba.propertymanagement.dto.PropertyDto;
import com.Thuba.propertymanagement.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PropertySearchTools {

    private final PropertyService propertyService;

    @Tool(description = "Search for available rental properties by suburb, maximum price, and minimum bedroom count.")
    public List<PropertyDto> searchProperties(
            @ToolParam(description = "Suburb name. Leave null or empty if the user did not specify a location.") String suburb,
            @ToolParam(description = "Maximum rental budget. Leave null if no maximum price was specified.") Double maxPrice,
            @ToolParam(description = "Minimum number of bedrooms. Leave null if not specified.") Integer minBedrooms) {

        Double searchPrice = (maxPrice != null) ? maxPrice : Double.MAX_VALUE;
        Integer searchBedrooms = (minBedrooms != null) ? minBedrooms : 0;

        return propertyService.executeAgenticSearch(suburb, searchPrice, searchBedrooms);
    }

    @Tool(description = "Get a list of adjacent suburbs near a given target suburb to expand the search when no results are found.")
    public List<String> getAdjacentSuburbs(
            @ToolParam(description = "The target suburb to find neighbors for.") String targetSuburb) {
        if (targetSuburb == null) return List.of();

        return switch (targetSuburb.trim().toLowerCase()) {
            case "sandton" -> List.of("Morningside", "Woodmead", "Paulshof");
            case "woodmead" -> List.of("Sunninghill", "Paulshof", "Sandton");
            case "morningside" -> List.of("Sandton", "River Club", "Bryanston");
            default -> List.of();
        };
    }

    @Tool(description = "Get the average rental price for active properties in a specific suburb and bedroom count.")
    public Double getMarketAverage(
            @ToolParam(description = "The suburb name.") String suburb,
            @ToolParam(description = "The number of bedrooms.") Integer bedrooms) {
        if (suburb == null || suburb.isBlank()) return null;
        Integer searchBedrooms = (bedrooms != null) ? bedrooms : 0;
        return propertyService.getMarketAverage(suburb, searchBedrooms);
    }
}
