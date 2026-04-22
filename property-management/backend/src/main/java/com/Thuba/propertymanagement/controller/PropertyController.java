package com.Thuba.propertymanagement.controller;

import com.Thuba.propertymanagement.dto.PropertyDto;
import com.Thuba.propertymanagement.model.PropertyStatus;
import com.Thuba.propertymanagement.service.PropertyService;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:5173")
public class PropertyController {

    private final PropertyService service;

    @Autowired
    private javax.sql.DataSource dataSource;

    @PostConstruct
    public void logDb() throws Exception {
        System.out.println("DB URL = " + dataSource.getConnection().getMetaData().getURL());
    }

    @GetMapping("/{id}")
    public PropertyDto getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PropertyDto> create(
            @Valid @RequestBody PropertyDto dto
    ) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping
    public Page<PropertyDto> getAll(
            @RequestParam(required = false) String suburb,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "price,asc") String sort
    ) {
        String[] s = sort.split(",");
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.fromString(s[1]), s[0])
        );

        return service.searchActive(
                suburb,
                bedrooms,
                minPrice,
                maxPrice,
                pageable
        );
    }

   @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   public PropertyDto uploadImages(
           @PathVariable Long id,
           @RequestPart("files") List<MultipartFile> files
   ) throws IOException {

       System.out.println("UPLOAD HIT");
       System.out.println("Files count: " + files.size());

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
            @RequestParam(required = false) String suburb,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            Pageable pageable
    ) {
        return service
                .getPropertiesByStatus(
                        statuses, suburb == null ? null : suburb.trim().toLowerCase(), bedrooms, minPrice, maxPrice, pageable
                )
                .map(service::toDto);
    }
}
