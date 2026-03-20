package com.jobtrail.dto;

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
    private String username;

    /** Field to store the raw password of the user*/
    private String password;
}
