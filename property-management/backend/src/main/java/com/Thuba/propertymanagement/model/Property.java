    package com.Thuba.propertymanagement.model;

    import jakarta.persistence.*;
    import lombok.*;
    import java.util.ArrayList;
    import java.util.List;

    @Entity
    @Table(name = "properties")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class Property {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String title;
        private double price;

        @Column(length = 255)
        private String suburb;

        @Column(nullable = true)
        private int bedrooms;

        private int bathrooms;

        @Column(length = 2000)
        private String description;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private PropertyStatus status = PropertyStatus.ACTIVE;

        @OneToMany(
                mappedBy = "property",
                cascade = CascadeType.ALL,
                orphanRemoval = true
        )
        @Builder.Default
        private List<PropertyImage> images = new ArrayList<>();

    }
