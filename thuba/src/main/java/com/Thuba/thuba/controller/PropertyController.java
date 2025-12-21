package com.Thuba.thuba.controller;

import com.Thuba.thuba.dto.PropertyDto;
import com.Thuba.thuba.service.PropertyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "http://localhost:5173")
public class PropertyController {


        private final PropertyService service;
        public PropertyController(PropertyService service) {
            this.service = service;
        }

        @GetMapping
        public List<PropertyDto> getAll() {
            return service.findAll();
        }

        @GetMapping("/{id}")
        public PropertyDto getById(@PathVariable Long id) {
            return service.findById(id);
        }

        @PostMapping
        public PropertyDto create(@RequestBody PropertyDto dto) {
            return service.create(dto);
        }


}
