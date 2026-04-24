package com.Thuba.propertymanagement.dto;

import com.Thuba.propertymanagement.model.PropertyStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class PropertyDto {
    private Long id;
    private String title;
    @NotNull
    @Min(value = 1000, message = "Price must be greater than zero")
    private Double price;
    private Integer bedrooms;
    private Integer bathrooms;
    private String suburb;
    private String description;
    private List<String> imageUrls;
    private PropertyStatus status;
    private List<String> amenities;
}
