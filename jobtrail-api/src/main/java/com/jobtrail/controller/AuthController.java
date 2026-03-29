package com.jobtrail.controller;

import com.jobtrail.dto.AuthResponse;
import com.jobtrail.dto.LoginRequest;
import com.jobtrail.dto.RegisterRequest;
import com.jobtrail.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Srivathsa Mantrala
 * REST Controller that provides endpoints for all kind of login and register requests
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    /** Field with the methods required to process requests for authentication*/
    private final AuthService authService;

    /**
     * Endpoint to allow user to register to the system
     * @param request registration details
     * @return JWT token on success
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request)
    {
        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * Endpoint to allow users to log in to the system
     * @param request request with credentials
     * @return JWT token on success
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request)
    {
        return ResponseEntity.ok(authService.login(request));
    }
}
