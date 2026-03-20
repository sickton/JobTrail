package com.jobtrail.service.implementations;

import com.jobtrail.dto.ApplicationRequest;
import com.jobtrail.dto.ApplicationResponse;
import com.jobtrail.entity.Application;
import com.jobtrail.entity.Resume;
import com.jobtrail.entity.User;
import com.jobtrail.entity.enums.ApplicationStatus;
import com.jobtrail.entity.enums.RoleType;
import com.jobtrail.repository.ApplicationRepository;
import com.jobtrail.repository.ResumeRepository;
import com.jobtrail.repository.UserRepository;
import com.jobtrail.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * @author Srivathsa Mantrala
 * Implementation class to process and update the applications data passed through web request
 */
@Service
@RequiredArgsConstructor
public class ApplicationServiceImplementation implements ApplicationService {

    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final ApplicationRepository applicationRepository;

    /**
     * Method to manually create an application in the system
     * @param request application with required details
     * @param username username of the user
     * @return response for the created application
     */
    @Override
    public ApplicationResponse createApplication(ApplicationRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Resume resume = null;
        if (request.getResumeId() != null) {
            resume = resumeRepository.findByResumeIdAndUserUserId(
                            request.getResumeId(), user.getUserId())
                    .orElseThrow(() -> new RuntimeException("Resume not found"));
        }

        Application application = Application.builder()
                .user(user)
                .resume(resume)
                .company(request.getCompany())
                .role(request.getRole())
                .roleType(RoleType.valueOf(request.getRoleType()))
                .applicationStatus(ApplicationStatus.valueOf(request.getApplicationStatus()))
                .link(request.getLink())
                .description(request.getDescription())
                .build();

        Application saved = applicationRepository.save(application);

        return ApplicationResponse.builder()
                .applicationId(saved.getApplicationId())
                .company(saved.getCompany())
                .role(saved.getRole())
                .roleType(saved.getRoleType().name())
                .applicationStatus(saved.getApplicationStatus().name())
                .link(saved.getLink())
                .description(saved.getDescription())
                .resumeId(saved.getResume() != null ? saved.getResume().getResumeId() : null)
                .appliedAt(saved.getAppliedAt())
                .updatedAt(saved.getUpdatedAt())
                .build();
    }
}
