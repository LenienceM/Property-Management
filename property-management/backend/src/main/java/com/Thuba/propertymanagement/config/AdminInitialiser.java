package com.Thuba.propertymanagement.config;

import com.Thuba.propertymanagement.model.Role;
import com.Thuba.propertymanagement.model.User;
import com.Thuba.propertymanagement.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitialiser {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitialiser(UserRepository userRepository,
                            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void createAdmin() {

        if(userRepository.findByUsername("admin").isEmpty()) {

            User admin = new User();
            admin.setUsername("admin");
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println("Admin user created");
        }
    }
}
