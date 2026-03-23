package com.jobtrail.service.implementations;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobtrail.dto.ParseRequest;
import com.jobtrail.dto.ParseResponse;
import com.jobtrail.service.OpenAIService;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletion;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * @author Srivathsa Mantrala
 * Class to send a request to the OpenAI API to extract application details from a job description
 */
@Service
public class OpenAIServiceImplementation implements OpenAIService {

    /** Field to store the OpenAI API KEY from env variable*/
    @Value("${openai.api.key}")
    private String apiKey;

    /** Static variable to build the prompt*/
    private static final String SYSTEM_PROMPT =
            "You are a job posting parser. Given raw job posting text, extract the following fields: " +
                    "company name, job title/role, role type (must be exactly one of: INTERNSHIP, FULLTIME, COOP, CONTRACT, TEMPORARY), " +
                    "application link (URL if present, otherwise empty string), and a brief description (2-3 sentences max). " +
                    "Return ONLY a valid JSON object with exactly these keys: company, role, roleType, link, description. " +
                    "Do not include any explanation or markdown formatting.";

    /**
     * Method to prompt OPENAI to extract job details from a given description
     * @param request prompt to work with
     * @return extracted details
     */
    @Override
    public ParseResponse parseJobPosting(ParseRequest request) {
        OpenAIClient client = OpenAIOkHttpClient.builder()
                .apiKey(apiKey)
                .build();

        ChatCompletionCreateParams params = ChatCompletionCreateParams.builder()
                .model(ChatModel.GPT_4O_MINI)
                .addSystemMessage(SYSTEM_PROMPT)
                .addUserMessage(request.getText())
                .build();

        ChatCompletion completion = client.chat().completions().create(params);

        String jsonResponse = completion.choices().get(0).message().content().orElse("{}");

        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(jsonResponse, ParseResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse OpenAI response: " + e.getMessage());
        }
    }
}
