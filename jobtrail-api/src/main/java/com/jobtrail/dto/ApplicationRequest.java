package com.jobtrail.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * @author Srivathsa Mantrala
 * Request DTO to pass in the required information regarding an application
 */
@Getter
@Setter
public class ApplicationRequest {
    private String company;
    private String role;
    private String roleType;
    private String applicationStatus;
    private String link;
    private String description;
    private Long resumeId;
}
