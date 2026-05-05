package com.Thuba.propertymanagement.controller;

import com.Thuba.propertymanagement.dto.PropertyDto;
import com.Thuba.propertymanagement.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor // This allows the injection of PropertyService
public class RootController {

    private final PropertyService service;


    @GetMapping("/")
    public String health() {
        return "OK";
    }


    @GetMapping("/properties")
    public Page<PropertyDto> getPropertiesForCv(
            @RequestParam(required = false) String suburb,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) Integer bathrooms,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            Pageable pageable) {

        return service.searchActive(suburb, bedrooms, bathrooms, minPrice, maxPrice, pageable);
    }
}