package com.Thuba.propertymanagement.service;

import com.Thuba.propertymanagement.dto.PropertyDto;
import com.Thuba.propertymanagement.model.Property;
import com.Thuba.propertymanagement.model.PropertyImage;
import com.Thuba.propertymanagement.model.PropertyStatus;
import com.Thuba.propertymanagement.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import org.springframework.beans.factory.annotation.Value;
import java.io.IOException;
import java.net.URL;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository repo;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;


    /**
     * Generate a pre-signed URL valid for 24 hours.
     */
    public String generatePresignedUrl(String key) {
        try (S3Presigner presigner = S3Presigner.builder()
                .credentialsProvider(s3Client.serviceClientConfiguration().credentialsProvider())
                .region(s3Client.serviceClientConfiguration().region())
                .build()) {

            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofHours(24))
                    .getObjectRequest(getObjectRequest)
                    .build();

            URL url = presigner.presignGetObject(presignRequest).url();
            return url.toString();
        }
    }

    public Page<PropertyDto> findActive(Integer bedrooms, Double minPrice, Double maxPrice, Pageable pageable) {
        return repo.findActiveFiltered(PropertyStatus.ACTIVE, bedrooms, minPrice, maxPrice, pageable)
                .map(this::toDto);
    }

    public Page<PropertyDto> searchActive(String suburb, Integer bedrooms, Double minPrice, Double maxPrice, Pageable pageable) {
        return repo.searchActive(PropertyStatus.ACTIVE, suburb, bedrooms, minPrice, maxPrice, pageable)
                .map(this::toDto);
    }

    public Page<PropertyDto> findAll(String suburb, Integer bedrooms, Double minPrice, Double maxPrice, Pageable pageable) {
        return repo.searchActive(PropertyStatus.ACTIVE, suburb, bedrooms, minPrice, maxPrice, pageable)
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
                .price(dto.getPrice() == null ? 0 : dto.getPrice())
                .suburb(dto.getSuburb())
                .bedrooms(dto.getBedrooms() == null ? 0 : dto.getBedrooms())
                .description(dto.getDescription())
                .status(PropertyStatus.ACTIVE)
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

    public Page<PropertyDto> getActiveProperties(Pageable pageable) {
        return repo.findByStatus(PropertyStatus.ACTIVE, pageable)
                .map(this::toDto);
    }

    public Page<Property> getPropertiesByStatus(List<PropertyStatus> statuses, String suburb, Integer bedrooms,
                                                BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return repo.findByStatusIn(statuses, pageable);
    }

    public Property updateStatus(Long id, PropertyStatus status) {
        Property property = findEntity(id);
        property.setStatus(status);
        return repo.save(property);
    }

    // ---------------- Image Handling ----------------

    public PropertyDto uploadPropertyImage(List<MultipartFile> files, Long propertyId) throws IOException {

        Property property =repo.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        for (MultipartFile file : files) {

            String key = "properties/" + propertyId + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(
                    putRequest,
                    software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes())
            );

            String imageUrl = s3Client.utilities()
                    .getUrl(builder -> builder.bucket(bucketName).key(key))
                    .toExternalForm();

            PropertyImage image = new PropertyImage();
            image.setProperty(property);
            //image.setFilename(imageUrl);
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

        dto.setImageUrls(
                property.getImages().stream()
                        .map(img -> "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + img.getFilename())
                        .toList()
        );
        return dto;
    }
}