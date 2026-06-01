package com.Thuba.propertymanagement.controller;

import com.Thuba.propertymanagement.config.RabbitConfig;
import com.Thuba.propertymanagement.dto.PropertyDto;
import com.Thuba.propertymanagement.model.PropertyStatus;
import com.Thuba.propertymanagement.service.PropertyService;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService service;
    private final javax.sql.DataSource dataSource;
    private final org.springframework.amqp.rabbit.core.RabbitTemplate rabbitTemplate;
    private final com.Thuba.propertymanagement.service.AiTaskTracker taskTracker;

    public record DescriptionRequest(String description) {
    }

    @PostConstruct
    public void logDb() {
        try (var connection = dataSource.getConnection()) {
            String url = connection.getMetaData().getURL();
            System.out.printf("DB URL = %s%n", url);
        } catch (Exception e) {
            System.err.printf("Database metadata access failed: %s%n", e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public PropertyDto getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PropertyDto> create(@Valid @RequestBody PropertyDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping
    public Page<PropertyDto> getAll(@RequestParam(required = false) String suburb, @RequestParam(required = false) Integer bedrooms, @RequestParam(required = false) Integer bathrooms, @RequestParam(required = false) Double minPrice, @RequestParam(required = false) Double maxPrice, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "9") int size, @RequestParam(defaultValue = "price,asc") String sort) {
        String[] s = sort.split(",");
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(s[1]), s[0]));

        return service.searchActive(suburb, bedrooms, bathrooms, minPrice, maxPrice, pageable);
    }

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PropertyDto uploadImages(@PathVariable Long id, @RequestPart("files") List<MultipartFile> files) throws IOException {

        System.out.println("UPLOAD HIT");
        System.out.printf("Files count: %d%n", files.size());

        return service.uploadPropertyImage(files, id);
    }

    @PutMapping("/{id}/archive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> archive(@PathVariable Long id) {
        service.archive(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> restore(@PathVariable Long id) {
        service.restore(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<PropertyDto> getByStatus(
            @RequestParam List<PropertyStatus> statuses,
            Pageable pageable) {

        return service.getPropertiesByStatus(statuses, pageable).map(service::toDto);
    }

    // Submit the description and get a Ticket (Job ID)
    @PostMapping("/suggest-amenities")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> submitAiTask(@Valid @RequestBody DescriptionRequest request) {
        String jobId = java.util.UUID.randomUUID().toString();

        taskTracker.startTask(jobId);

        // Send to RabbitMQ: "jobId|description"
        String payload = String.format("%s|%s", jobId, request.description());
        rabbitTemplate.convertAndSend(RabbitConfig.AI_QUEUE, payload);

        // Return HTTP 202 Accepted with the Job ID
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(jobId);
    }


    @GetMapping("/suggest-amenities/status/{jobId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTaskStatus(@PathVariable String jobId) {
        Object result = taskTracker.getTaskResult(jobId);

        if (result == null) {
            return ResponseEntity.notFound().build();
        }

        // Wrapped in a Map, this becomes: {"status": "PENDING", "message": "Task is still running"}
        if ("PENDING".equals(result)) {
            return ResponseEntity.status(HttpStatus.PROCESSING)
                    .body(Map.of(
                            "status", "PENDING",
                            "message", "Task is still running"
                    ));
        }

        if ("ERROR".equals(result)) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "ERROR",
                            "message", "AI Processing failed"
                    ));
        }

        // Wrap the final success result too, so the frontend always expects an object
        // This becomes: {"status": "COMPLETED", "data": [your, list, of, amenities]}
        return ResponseEntity.ok(Map.of(
                "status", "COMPLETED",
                "data", result
        ));
    }

    @GetMapping("/suburbs")
    @Cacheable("suburbs")
    public ResponseEntity<List<String>> getActiveSuburbs() {
        return ResponseEntity.ok(service.getDistinctActiveSuburbs());
    }
}
