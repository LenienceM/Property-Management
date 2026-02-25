package com.Thuba.propertymanagement.specification;

import com.Thuba.propertymanagement.model.Property;
import com.Thuba.propertymanagement.model.PropertyStatus;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;

public class PropertySpecifications {

    public static Specification<Property> hasStatusIn(List<PropertyStatus> statuses) {
        return (root, query, cb) -> root.get("status").in(statuses);
    }

    public static Specification<Property> hasSuburb(String suburb) {
        return (root, query, cb) -> suburb == null ? null : cb.like(cb.lower(root.get("suburb")), "%" + suburb.toLowerCase() + "%");
    }

    public static Specification<Property> hasBedrooms(Integer bedrooms) {
        return (root, query, cb) -> bedrooms == null ? null : cb.greaterThanOrEqualTo(root.get("bedrooms"), bedrooms);
    }

    public static Specification<Property> minPrice(BigDecimal minPrice) {
        return (root, query, cb) -> minPrice == null ? null : cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    public static Specification<Property> maxPrice(BigDecimal maxPrice) {
        return (root, query, cb) -> maxPrice == null ? null : cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }
}
