package com.Thuba.thuba.dto;

import lombok.Data;

@Data
public class PropertyDto {
    private Long id;
    private String title;
    private double price;
    private String location;
    private int bedrooms;
    private int bathrooms;
    private String description;
}

