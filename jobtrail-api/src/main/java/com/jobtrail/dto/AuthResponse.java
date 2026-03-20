package com.jobtrail.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author Srivathsa Mantrala
 * Response class to return the successful token generated after login
 */
@Getter
@AllArgsConstructor
public class AuthResponse {
    /** Field to store the generated token*/
    private String token;
}
