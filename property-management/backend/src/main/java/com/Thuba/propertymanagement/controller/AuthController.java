package com.Thuba.propertymanagement.controller;

import com.Thuba.propertymanagement.dto.SignupRequestDto;
import com.Thuba.propertymanagement.model.Role;
import com.Thuba.propertymanagement.model.User;
import com.Thuba.propertymanagement.repository.UserRepository;
import com.Thuba.propertymanagement.security.JwtUtil;
import com.Thuba.propertymanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepo;
    private final UserService userService;
    // Removed passwordEncoder since it was unused

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> body) throws Exception {
        String username = body.get("username");
        String password = body.get("password");

        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (BadCredentialsException e) {
            throw new Exception("Incorrect username or password", e);
        }

        // fetch the user once to avoid multiple DB hits and Optional.get() warnings
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new Exception("User not found after authentication"));

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(String.format("ROLE_%s", user.getRole().name())))
        );

        String token = jwtUtil.generateToken(userDetails);

        // Fix: Removed String concatenation warning by using Map.of naturally
        return Map.of(
                "token", token,
                "role", user.getRole().name()
        );
    }

    @PostMapping("/signup")
    public User signup(@RequestBody SignupRequestDto request) {
        return userService.registerUser(request.getUsername(), request.getPassword(), Role.USER);
    }
}