package com.Thuba.propertymanagement.repository;

import com.Thuba.propertymanagement.model.Property;
import com.Thuba.propertymanagement.model.PropertyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    @Query("SELECT DISTINCT p FROM Property p LEFT JOIN FETCH p.images")
    Page<Property> findAllWithImages(Pageable pageable);

    Page<Property> findByStatus(PropertyStatus status, Pageable pageable);

    Page<Property> findByStatusIn(List<PropertyStatus> statuses, Pageable pageable);

    @Query("""
                SELECT p FROM Property p
                WHERE p.status = :status
                           AND (:suburb IS NULL OR p.suburb = :suburb)
            AND (:bedrooms IS NULL OR p.bedrooms >= :bedrooms)
                  AND (:bathrooms IS NULL OR p.bathrooms >= :bathrooms)
                  AND (:minPrice IS NULL OR p.price >= :minPrice)
                  AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            """)
    Page<Property> search(
            @Param("suburb") String suburb,
            @Param("bedrooms") Integer bedrooms,
            @Param("bathrooms") Integer bathrooms,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("status") PropertyStatus status,
            Pageable pageable
    );

    @Query("""
            SELECT p FROM Property p
            WHERE p.status = :status
            
            AND (:suburb IS NULL OR p.suburb = :suburb)
            AND (:bedrooms IS NULL OR p.bedrooms = :bedrooms)
            AND (:bathrooms IS NULL OR p.bathrooms = :bathrooms)
            AND (:minPrice IS NULL OR p.price >= :minPrice)
            AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            """)
    Page<Property> searchActive(
            @Param("status") PropertyStatus status,
            @Param("suburb") String suburb,
            @Param("bedrooms") Integer bedrooms,
            @Param("bathrooms") Integer bathrooms,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Pageable pageable
    );

    @Query("""
                SELECT p FROM Property p
                WHERE p.status = :status
                AND (:suburb IS NULL OR p.suburb = :suburb)
                AND (:bedrooms IS NULL OR p.bedrooms = :bedrooms)
                AND (:bathrooms IS NULL OR p.bathrooms = :bathrooms)
                AND (:minPrice IS NULL OR p.price >= :minPrice)
                AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            """)
    Page<Property> findActiveFiltered(
            PropertyStatus status,
            String suburb,
            Integer bedrooms,
            Integer bathrooms,
            Double minPrice,
            Double maxPrice,
            Pageable pageable
    );
}