package com.jobtrail.dto;

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
    private String firstName;

    /** Field to store the last name*/
    private String lastName;

    /** Field to store the username*/
    private String username;

    /** Field to store the raw password of the user*/
    private String password;
}
