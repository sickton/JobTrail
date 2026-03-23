package com.jobtrail.service;

import com.jobtrail.dto.ParseRequest;
import com.jobtrail.dto.ParseResponse;

/**
 * @author Srivathsa Mantrala
 * Interface for the open ai service call
 */
public interface OpenAIService {
    /** Abstract method to extract job details from a given description*/
    ParseResponse parseJobPosting(ParseRequest request);
}
