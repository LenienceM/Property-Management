    package com.Thuba.propertymanagement.model;

    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    @Entity
    @Table(name = "property_images")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class PropertyImage {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private String filename;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "property_id")
        private Property property;
    }

