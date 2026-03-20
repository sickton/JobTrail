package com.jobtrail.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * @author Srivathsa Mantrala
 * Response class to return the response after validating the web request
 */
@Getter
@AllArgsConstructor
@Builder
public class ApplicationResponse {
    private Long applicationId;
    private String company;
    private String role;
    private String roleType;
    private String applicationStatus;
    private String link;
    private String description;
    private Long resumeId;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
