package com.jobtrail.controller;

import com.jobtrail.dto.ApplicationRequest;
import com.jobtrail.dto.ApplicationResponse;
import com.jobtrail.entity.Application;
import com.jobtrail.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.jobtrail.dto.ParseRequest;
import com.jobtrail.dto.ParseResponse;
import com.jobtrail.service.OpenAIService;

/**
 * @author Srivathsa Mantrala
 * Controller class to handle web requests associated with application data
 */
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {
    /** Field to handle the requests using service class*/
    private final ApplicationService applicationService;
    /** Field to handle the openAI calls*/
    private final OpenAIService openAIService;

    /**
     * Endpoint to post data to create a new application
     * @param request object with details
     * @param userDetails user details
     * @return the application created
     */
    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(@RequestBody ApplicationRequest request, @AuthenticationPrincipal UserDetails userDetails)
    {
        return ResponseEntity.ok(
                applicationService.createApplication(request, userDetails.getUsername()));
    }

    /**
     * Endpoint to update an existing application
     * @param id application id
     * @param request updated details
     * @param userDetails authenticated user
     * @return updated application
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponse> updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                applicationService.updateApplication(id, request, userDetails.getUsername()));
    }

    /**
     * Endpoint to delete an existing application
     * @param id application id
     * @param userDetails authenticated user
     * @return successful message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        applicationService.deleteApplication(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint to parse a job posting using OpenAI and return extracted application fields
     * @param request raw job posting text
     * @param userDetails authenticated user
     * @return parsed application fields
     */
    @PostMapping("/parse")
    public ResponseEntity<ParseResponse> parseJobPosting(
            @RequestBody ParseRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(openAIService.parseJobPosting(request));
    }
}
