package com.jobtrail.service;

import com.jobtrail.dto.AuthResponse;
import com.jobtrail.dto.LoginRequest;
import com.jobtrail.dto.RegisterRequest;

/**
 * @author Srivathsa Mantrala
 * Interface to facilitate authorization by registering users and logging users in
 */
public interface AuthService {
    /** Abstract Method to register a user request*/
    public AuthResponse register(RegisterRequest request);

    /** Abstract Method to process a login request*/
    public AuthResponse login(LoginRequest request);
}
