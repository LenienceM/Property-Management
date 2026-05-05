package com.Thuba.propertymanagement.service;

import com.Thuba.propertymanagement.dto.PropertyDto;
import com.Thuba.propertymanagement.model.Property;
import com.Thuba.propertymanagement.model.PropertyImage;
import com.Thuba.propertymanagement.model.PropertyStatus;
import com.Thuba.propertymanagement.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository repo;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    public Page<PropertyDto> searchActive(String suburb, Integer bedrooms, Integer bathrooms, Double minPrice, Double maxPrice, Pageable pageable) {
        return repo.searchActive(PropertyStatus.ACTIVE, suburb, bedrooms, bathrooms, minPrice, maxPrice, pageable)
                .map(this::toDto);
    }

    public Property findEntity(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
    }

    public PropertyDto findById(Long id) {
        return toDto(findEntity(id));
    }

    @Transactional
    public PropertyDto create(PropertyDto dto) {
        Property property = Property.builder()
                .title(dto.getTitle())
                .price(dto.getPrice() == null ? 0.0 : dto.getPrice())
                .suburb(dto.getSuburb())
                .bedrooms(dto.getBedrooms() == null ? 0 : dto.getBedrooms())
                .bathrooms(dto.getBathrooms() == null ? 0 : dto.getBathrooms())
                .description(dto.getDescription())
                .status(PropertyStatus.ACTIVE)
                .amenities(dto.getAmenities())
                .build();

        if (property.getSuburb() != null) {
            property.setSuburb(property.getSuburb().trim().toLowerCase());
        }

        return toDto(repo.save(property));
    }

    public void archive(Long id) {
        Property property = findEntity(id);
        property.setStatus(PropertyStatus.ARCHIVED);
        repo.save(property);
    }

    public void restore(Long id) {
        Property property = findEntity(id);
        property.setStatus(PropertyStatus.ACTIVE);
        repo.save(property);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public Page<Property> getPropertiesByStatus(List<PropertyStatus> statuses, Pageable pageable) {
        return repo.findByStatusIn(statuses, pageable);
    }

    @Transactional
    public PropertyDto uploadPropertyImage(List<MultipartFile> files, Long propertyId) throws IOException {
        Property property = findEntity(propertyId);

        for (MultipartFile file : files) {

            String key = String.format("properties/%d/%s-%s",
                    propertyId, UUID.randomUUID(), file.getOriginalFilename());

            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putRequest,
                    software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes()));

            PropertyImage image = new PropertyImage();
            image.setProperty(property);
            image.setFilename(key);

            property.getImages().add(image);
        }

        repo.save(property);
        return toDto(property);
    }

    public PropertyDto toDto(Property property) {
        PropertyDto dto = new PropertyDto();
        dto.setId(property.getId());
        dto.setTitle(property.getTitle());
        dto.setSuburb(property.getSuburb());
        dto.setPrice(property.getPrice());
        dto.setBedrooms(property.getBedrooms());
        dto.setBathrooms(property.getBathrooms());
        dto.setDescription(property.getDescription());
        dto.setStatus(property.getStatus());
        dto.setAmenities(property.getAmenities());

        dto.setImageUrls(
                property.getImages().stream()
                        .map(img -> String.format("https://%s.s3.%s.amazonaws.com/%s",
                                bucketName, region, img.getFilename()))
                        .toList()
        );
        return dto;
    }
}