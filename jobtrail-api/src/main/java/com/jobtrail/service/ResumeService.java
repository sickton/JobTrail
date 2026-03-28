package com.jobtrail.service;

import com.jobtrail.dto.ResumeResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

/**
 * @author Srivathsa Mantrala
 * Service interface for resume management
 */
public interface ResumeService {
    List<ResumeResponse> getResumes(String username);
    ResumeResponse addResume(String versionName, MultipartFile file, String username);
    void deleteResume(Long resumeId, String username);
    String getResumeFileUrl(Long resumeId, String username);
}
