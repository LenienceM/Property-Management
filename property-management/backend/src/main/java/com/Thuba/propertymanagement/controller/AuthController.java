package com.Thuba.propertymanagement.controller;

import com.Thuba.propertymanagement.dto.SignupRequestDto;
import com.Thuba.propertymanagement.model.Role;
import com.Thuba.propertymanagement.model.User;
import com.Thuba.propertymanagement.repository.UserRepository;
import com.Thuba.propertymanagement.security.JwtUtil;
import com.Thuba.propertymanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> body) throws Exception {
        String username = body.get("username");
        String password = body.get("password");

        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (BadCredentialsException e) {
            throw new Exception("Incorrect username or password", e);
        }

        UserDetails userDetails = userRepo.findByUsername(username).map(u -> new org.springframework.security.core.userdetails.User(u.getUsername(), u.getPassword(), List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole().name()))

        )).orElseThrow();

        String token = jwtUtil.generateToken(userDetails);

        return Map.of("token", token, "role", userRepo.findByUsername(username).get().getRole().name());
    }

    @PostMapping("/signup")
    public User signup(@RequestBody SignupRequestDto request) {
        return userService.registerUser(request.getUsername(), request.getPassword(), Role.USER);
    }
}
