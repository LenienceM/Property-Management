package com.Thuba.propertymanagement.controller;

import com.Thuba.propertymanagement.dto.SignupRequestDto;
import com.Thuba.propertymanagement.model.Role;
import com.Thuba.propertymanagement.model.User;
import com.Thuba.propertymanagement.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    @PreAuthorize("hasRole('ADMIN')")
    public User createAdmin(@RequestBody SignupRequestDto request) {
        return userService.registerUser(request.getUsername(), request.getPassword(), Role.ADMIN);
    }
}
