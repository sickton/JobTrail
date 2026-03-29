package com.jobtrail.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Srivathsa Mantrala
 * Response class to process a register account request
 */
@Getter
@Setter
public class RegisterRequest {
    /** Field to store the first name*/
    @NotBlank(message = "First name is required")
    private String firstName;

    /** Field to store the last name*/
    @NotBlank(message = "Last name is required")
    private String lastName;

    /** Field to store the username*/
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    private String username;

    /** Field to store the raw password of the user*/
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
