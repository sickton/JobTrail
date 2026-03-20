package com.jobtrail.controller;

import com.jobtrail.dto.ApplicationRequest;
import com.jobtrail.dto.ApplicationResponse;
import com.jobtrail.entity.Application;
import com.jobtrail.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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
}
