package com.jobtrail.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Srivathsa Mantrala
 * Response class to process a login request
 */
@Getter
@Setter
public class LoginRequest {
    /** Field to store the username of the user*/
    @NotBlank(message = "Username is required")
    private String username;

    /** Field to store the raw password of the user*/
    @NotBlank(message = "Password is required")
    private String password;
}
