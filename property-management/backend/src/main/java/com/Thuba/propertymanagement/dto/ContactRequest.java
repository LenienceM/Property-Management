package com.Thuba.propertymanagement.dto;

public record ContactRequest(
        String name,
        String email,
        String inquiryType,
        String message
) {}