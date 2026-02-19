package com.MarketBriefApp.service.external;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AISummaryService {

    @Value("${app.api.groq-key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    public String summarizeNews(String symbol,List<String> newsArticles) {
        String prompt = "Act as an experienced equity research analyst for the stock market.\n"
        		+ "\n"
        		+ "\n"
        		+ "Instructions:\n"
        		+ "\n"
        		+ "* Do NOT summarize each article.\n"
        		+ "* Combine information from all sources and filter the news only for "+symbol+".\n"
        		+ "* Output only key points an investor must know.\n"
        		+ "and Identify hidden implications that retail investors may miss.\n"
        		+ "\n"
        		+ "* Limit output to 8–12 concise bullet points.\n"
        		+ "* Focus on business impact, financial implications, risks, and growth signals.\n"
        		+ "* Ignore promotional or repetitive information.\n"
        		+ "* Prioritize recent developments and importantly .\n"
        		+ "do the sentiment analyze and classify positive,neutral,negative impact of the point"
        		+ "then in each point starting add 🟢 icon if positive, 🔴 icon if negative ,🟡 icon if neutral"
        		+ "Each point should clearly explain WHY it matters for investors. \n"
        		+ "Output format:\n"
        		+ "• Insight → Investor implication\n"
        		+ "\n"
        		+ "Now analyze the following inputs:\n\n"
                + String.join("\n\n", newsArticles);

        Map<String, Object> requestBody = Map.of(
                "model", "llama-3.3-70b-versatile",
                "messages", List.of(
                        Map.of("role", "system", "content", "You are a financial analyst assistant."),
                        Map.of("role", "user", "content", prompt)),
                "max_tokens", 300,
                "temperature", 0.7);
        
        System.out.println("1: request Body: \n"+requestBody);
        try {
        	@SuppressWarnings("unchecked")
            Map<String, Object> response = restClient.post()
                    .uri("https://api.groq.com/openai/v1/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);
        	
        	System.out.println("2: response Body: \n"+response);
        	
            if (response != null && response.containsKey("choices")) {
                @SuppressWarnings("unchecked")
				List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                
                System.out.println("3: choices: \n"+choices);
                if (!choices.isEmpty()) {
                    @SuppressWarnings("unchecked")
					Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    
//                    System.out.println("4: message: \n"+message);
                    
//                    System.out.println("5: "+(String) message.get("content"));
                    
                    return (String) message.get("content");
                }
            }

            return "Unable to generate summary";
        } catch (Exception e) {
            // Handle API quota, rate limit, or other errors
            String errorLog = "AI Summary API Error: " + e.getMessage();
            System.err.println(errorLog);
            e.printStackTrace();
            return "Unable to generate summary at the moment. Please try again later.";
        }
    }
}
