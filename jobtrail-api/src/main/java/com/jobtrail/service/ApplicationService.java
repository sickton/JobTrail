package com.jobtrail.service;

import com.jobtrail.dto.ApplicationRequest;
import com.jobtrail.dto.ApplicationResponse;

/**
 * @author Srivathsa Mantrala
 * Interface to provide functionality of creating applications manually
 */
public interface ApplicationService {
    /** Abstract method to create an application manually*/
    public ApplicationResponse createApplication(ApplicationRequest request, String username);
}
