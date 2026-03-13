package com.Thuba.propertymanagement.config;

import com.Thuba.propertymanagement.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                        .authorizeHttpRequests(auth -> auth
                                // 1. Auth is always first
                                .requestMatchers("/api/auth/**").permitAll()

                                // 2. SPECIFIC image path first with double asterisk
                                .requestMatchers(HttpMethod.GET, "/api/properties/*/images/**").permitAll()

                                // 3. Admin restrictions BEFORE general public GET
                                .requestMatchers("/api/properties/admin/**").hasRole("ADMIN")

                                // 4. General public GET
                                .requestMatchers(HttpMethod.GET, "/api/properties/**").permitAll()

                                // 5. Other Admin methods
                                .requestMatchers(HttpMethod.POST, "/api/properties/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/api/properties/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/api/properties/**").hasRole("ADMIN")

                                .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "https://property-management-frontend-7gpl.onrender.com",
                "https://property-management.onrender.com",
                "https://pelicanproperties.co.za",
                "https://www.pelicanproperties.co.za"
        ));


        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

