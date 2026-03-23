package com.jobtrail.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * @author Srivathsa Mantrala
 * Class to represent a text description (prompt) for open ai parsing.
 */
@Getter
@Setter
public class ParseRequest {
    /** Field to store the prompt text*/
    private String text;
}
