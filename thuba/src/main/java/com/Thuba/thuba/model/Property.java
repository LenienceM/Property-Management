package com.Thuba.thuba.model;
import jakarta.persistence.*;
import lombok.*;

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

        @Column(nullable = false)
        private String title;

        @Column(nullable = false)
        private double price;

        private String location;

        private int bedrooms;

        private int bathrooms;

        @Column(length = 2000)
        private String description;
    }
