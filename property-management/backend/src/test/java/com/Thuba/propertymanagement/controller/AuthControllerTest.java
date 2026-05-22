package com.Thuba.propertymanagement.controller;

import com.Thuba.propertymanagement.config.SecurityConfig;
import com.Thuba.propertymanagement.dto.SignupRequestDto;
import com.Thuba.propertymanagement.model.Role;
import com.Thuba.propertymanagement.model.User;
import com.Thuba.propertymanagement.repository.UserRepository;
import com.Thuba.propertymanagement.security.JwtUtil;
import com.Thuba.propertymanagement.service.UserDetailsServiceImpl;
import com.Thuba.propertymanagement.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // Mock ALL the dependencies injected into AuthController
    @MockBean
    private AuthenticationManager authManager;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserRepository userRepo;

    @MockBean
    private UserService userService;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("admin_user")
                .password("hashed_password")
                .role(Role.ADMIN)
                .build();
    }

    @Test
    void login_WhenCredentialsAreValid_ShouldReturnTokenAndRole() throws Exception {
        // Arrange
        Map<String, String> credentials = Map.of("username", "admin_user", "password", "correct_password");

        // 1. Mock the AuthManager to succeed (do nothing / don't throw exception)
        when(authManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);

        // 2. Mock the Database fetch
        when(userRepo.findByUsername("admin_user")).thenReturn(Optional.of(testUser));

        // 3. Mock the JWT generation
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("fake-jwt-token-123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf()) // Supply a valid CSRF token
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token-123"))
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    void login_WhenCredentialsAreInvalid_ShouldReturn403Forbidden() throws Exception {
        // Arrange
        Map<String, String> credentials = Map.of("username", "admin_user", "password", "wrong_password");

        // Tell the AuthManager to throw a BadCredentialsException
        when(authManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        // Spring Security intercepts the BadCredentialsException and translates it into a 403 Forbidden.
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf()) // Supply a valid CSRF token
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isForbidden());
    }

    @Test
    void signup_ShouldReturnSavedUser() throws Exception {
        // Arrange
        SignupRequestDto request = new SignupRequestDto();
        request.setUsername("new_user");
        request.setPassword("secure_pass");

        User savedUser = User.builder()
                .username("new_user")
                .role(Role.USER)
                .build();

        when(userService.registerUser("new_user", "secure_pass", Role.USER))
                .thenReturn(savedUser);

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                        .with(csrf()) // Supply a valid CSRF token
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("new_user"))
                .andExpect(jsonPath("$.role").value("USER"));
    }
}
