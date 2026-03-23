package com.jobtrail.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

/**
 * @author Srivathsa Mantrala
 * Response DTO for resume data
 */
@Getter
@AllArgsConstructor
public class ResumeResponse {
    private Long resumeId;
    private String versionName;
    private String resumeText;
    private String fileUrl;
    private LocalDateTime createdAt;
}
