package com.MarketBriefApp.service.external;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NewsExternalService {

    @Value("${app.api.news-key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    @SuppressWarnings("unchecked")
	public Map<String, Object> getStockNews(String symbol) {
        String query = symbol + " stock";
        String url = "https://newsapi.org/v2/everything?q=" + query +
                "&sortBy=publishedAt&language=en&pageSize=10&apiKey=" + apiKey;
        return restClient.get()
                .uri(url)
                .retrieve()
                .body(Map.class);
    }
}
