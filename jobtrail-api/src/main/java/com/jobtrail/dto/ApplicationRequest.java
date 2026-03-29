package com.jobtrail.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Srivathsa Mantrala
 * Request DTO to pass in the required information regarding an application
 */
@Getter
@Setter
public class ApplicationRequest {
    @NotBlank(message = "Company is required")
    private String company;
    @NotBlank(message = "Role is required")
    private String role;
    private String roleType;
    private String applicationStatus;
    private String link;
    private String description;
    private Long resumeId;
}
