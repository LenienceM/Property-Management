package com.Thuba.propertymanagement.service;

import com.Thuba.propertymanagement.model.Role;
import com.Thuba.propertymanagement.model.User;
import com.Thuba.propertymanagement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String username, String password, Role role) {

        if (userRepo.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        User user = User.builder().username(username).password(passwordEncoder.encode(password)).role(role).build();

        return userRepo.save(user);
    }
}
