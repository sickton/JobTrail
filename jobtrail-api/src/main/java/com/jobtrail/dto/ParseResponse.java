package com.jobtrail.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * @author Srivathsa Mantrala
 * Class to return the prompt response in the form of an application
 */
@Getter
@Setter
public class ParseResponse {
    /** Field to store the company*/
    private String company;
    /** Field to store the role*/
    private String role;
    /** Field to store the position type*/
    private String roleType;
    /** Link for the applied job - quicklink*/
    private String link;
    /** Field to store the description in general*/
    private String description;
}
