package com.Thuba.thuba.service;
import com.Thuba.thuba.dto.PropertyDto;
import com.Thuba.thuba.model.Property;
import com.Thuba.thuba.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import lombok.RequiredArgsConstructor;





        @Service
        @RequiredArgsConstructor
        public class PropertyService {

            private final PropertyRepository repo;

            public List<PropertyDto> findAll() {
                return repo.findAll()
                        .stream()
                        .map(this::toDto)
                        .toList();
            }

            public PropertyDto findById(Long id) {
                Property property = repo.findById(id)
                        .orElseThrow(() -> new RuntimeException("Property not found"));
                return toDto(property);
            }

            public PropertyDto create(PropertyDto dto) {
                Property property = Property.builder()
                        .title(dto.getTitle())
                        .price(dto.getPrice())
                        .location(dto.getLocation())
                        .bedrooms(dto.getBedrooms())
                        .bathrooms(dto.getBathrooms())
                        .description(dto.getDescription())
                        .build();

                return toDto(repo.save(property));
            }

            private PropertyDto toDto(Property property) {
                PropertyDto dto = new PropertyDto();
                dto.setId(property.getId());
                dto.setTitle(property.getTitle());
                dto.setPrice(property.getPrice());
                dto.setLocation(property.getLocation());
                dto.setBedrooms(property.getBedrooms());
                dto.setBathrooms(property.getBathrooms());
                dto.setDescription(property.getDescription());
                return dto;

            }
        }