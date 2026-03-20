package com.jobtrail.service;

import com.jobtrail.dto.ApplicationRequest;
import com.jobtrail.dto.ApplicationResponse;

/**
 * @author Srivathsa Mantrala
 * Interface to provide functionality of creating applications manually
 */
public interface ApplicationService {
    /** Abstract method to create an application manually*/
    ApplicationResponse createApplication(ApplicationRequest request, String username);

    /** Abstract method to update an existing application*/
    ApplicationResponse updateApplication(Long applicationId, ApplicationRequest request, String username);

    /** Abstract method to delete an existing application*/
    void deleteApplication(Long applicationId, String username);
}
