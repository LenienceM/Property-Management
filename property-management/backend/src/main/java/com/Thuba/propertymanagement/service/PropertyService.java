package com.Thuba.propertymanagement.service;

import com.Thuba.propertymanagement.dto.PropertyDto;
import com.Thuba.propertymanagement.model.Property;
import com.Thuba.propertymanagement.model.PropertyImage;
import com.Thuba.propertymanagement.model.PropertyStatus;
import com.Thuba.propertymanagement.repository.PropertyRepository;
import com.Thuba.propertymanagement.specification.PropertySpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private static final Path UPLOAD_DIR =
            Paths.get(System.getProperty("user.dir"), "uploads");

    private final PropertyRepository repo;

    public Page<PropertyDto> findActive(
            // String suburb,
            Integer bedrooms,
            Double minPrice,
            Double maxPrice,
            Pageable pageable
    ) {
        return repo.findActiveFiltered(
                PropertyStatus.ACTIVE,
                //suburb,
                bedrooms,
                minPrice,
                maxPrice,
                pageable
        ).map(this::toDto);
    }

    public Page<PropertyDto> searchActive(
            String suburb,
            Integer bedrooms,
            Double minPrice,
            Double maxPrice,
            Pageable pageable
    ) {
        return repo.searchActive(
                PropertyStatus.ACTIVE,
                suburb,
                bedrooms,
                minPrice,
                maxPrice,
                pageable
        ).map(this::toDto);
    }

    public Page<PropertyDto> findAll(
            String suburb,

            Integer bedrooms,
            Double minPrice,
            Double maxPrice,
            Pageable pageable
    ) {
        return repo.searchActive(
                PropertyStatus.ACTIVE,
                suburb,
                bedrooms,
                minPrice,
                maxPrice,
                pageable
        ).map(this::toDto);
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
            property.setSuburb(
                    property.getSuburb().trim().toLowerCase()
            );
        }

        Property saved = repo.save(property);
        return toDto(saved);
    }

    public void restore(Long id) {
        Property property = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        property.setStatus(PropertyStatus.ACTIVE);
        repo.save(property);
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
                        .map(img ->
                                "/api/properties/" +
                                        property.getId() +
                                        "/images/" +
                                        img.getId()
                        )
                        .toList()
        );

        return dto;
    }

    public void archive(Long id) {
        Property property = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        property.setStatus(PropertyStatus.ARCHIVED);
        repo.save(property);
    }

    public Page<PropertyDto> getActiveProperties(Pageable pageable) {
        return repo.findByStatus(PropertyStatus.ACTIVE, pageable)
                .map(this::toDto);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public PropertyDto uploadImages(Long id, List<MultipartFile> files) {
        Property property = findEntity(id);

        try {
            Files.createDirectories(UPLOAD_DIR);

            for (MultipartFile file : files) {
                String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
                Files.copy(
                        file.getInputStream(),
                        UPLOAD_DIR.resolve(filename),
                        StandardCopyOption.REPLACE_EXISTING
                );
                System.out.println("Saving image: " + filename);

                property.getImages().add(
                        PropertyImage.builder()
                                .filename(filename)
                                .property(property)
                                .build()
                );
            }
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed", e);
        }
        return toDto(repo.save(property));
    }

    public Resource loadImage(Long propertyId, Long imageId) throws IOException {
        Property property = findEntity(propertyId);

        PropertyImage image = property.getImages()
                .stream()
                .filter(i -> i.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Image not found"));

        Path file = UPLOAD_DIR.resolve(image.getFilename());

        if (!Files.exists(file)) {
            throw new RuntimeException("Image file not found on disk: " + file);
        }

        return new UrlResource(file.toUri());
    }

    public Page<Property> getPropertiesByStatus(
            List<PropertyStatus> statuses,
            String suburb,
            Integer bedrooms,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        Specification<Property> spec = Specification
                .where(PropertySpecifications.hasStatusIn(statuses))
                .and(PropertySpecifications.hasSuburb(suburb))
                .and(PropertySpecifications.hasBedrooms(bedrooms))
                .and(PropertySpecifications.minPrice(minPrice))
                .and(PropertySpecifications.maxPrice(maxPrice));

        return repo.findByStatusIn(statuses, pageable);
    }

    public Property updateStatus(Long id, PropertyStatus status) {
        Property property = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        property.setStatus(status);
        return repo.save(property);
    }
}
