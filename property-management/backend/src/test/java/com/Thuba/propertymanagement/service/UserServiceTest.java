package com.Thuba.propertymanagement.service;

import com.Thuba.propertymanagement.model.Role;
import com.Thuba.propertymanagement.model.User;
import com.Thuba.propertymanagement.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void registerUser_WhenUsernameIsAvailable_ShouldEncodePasswordAndSave() {
        // Arrange
        String rawPassword = "mySecretPassword";
        String encodedPassword = "hashed_mySecretPassword";

        when(userRepo.existsByUsername("new_user")).thenReturn(false);
        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);

        // create a fake user to represent what the database WOULD return
        User savedUser = User.builder()
                .username("new_user")
                .password(encodedPassword)
                .role(Role.USER)
                .build();
        when(userRepo.save(any(User.class))).thenReturn(savedUser);

        // Act
        User result = userService.registerUser("new_user", rawPassword, Role.USER);

        // Assert
        assertNotNull(result);
        assertEquals("new_user", result.getUsername());

        // CRITICAL CHECK: Verify the password encoder was actually used!
        verify(passwordEncoder, times(1)).encode(rawPassword);

        // Capture the exact object that was passed to repo.save()
        // to prove it contains the ENCODED password, not the raw one.
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepo).save(userCaptor.capture());
        assertEquals(encodedPassword, userCaptor.getValue().getPassword());
    }

    @Test
    void registerUser_WhenUsernameAlreadyExists_ShouldThrowException() {
        // Arrange
        when(userRepo.existsByUsername("taken_user")).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.registerUser("taken_user", "anyPassword", Role.USER);
        });

        assertEquals("Username already exists", exception.getMessage());

        // Verify that if the user exists, we NEVER attempt to save them
        verify(userRepo, never()).save(any(User.class));
    }
}