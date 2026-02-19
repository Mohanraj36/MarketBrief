package com.MarketBriefApp.service.external;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StockExternalService {

    @Value("${app.api.stock-key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    @SuppressWarnings("unchecked")
	public Map<String, Object> getStockOverview(String symbol) {
        String formattedSymbol = formatSymbol(symbol);
        String url = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + formattedSymbol + "&apikey=" + apiKey;

        return restClient.get()
                .uri(url)
                .retrieve()
                .body(Map.class);
    }

    @SuppressWarnings("unchecked")
	public Map<String, Object> getStockQuote(String symbol) {
        String formattedSymbol = formatSymbol(symbol);
        String url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + formattedSymbol + "&apikey=" + apiKey;

        return restClient.get()
                .uri(url)
                .retrieve()
                .body(Map.class);
    }


    private String formatSymbol(String symbol) {
        if (symbol == null) return "";
        return symbol.toUpperCase().trim();
    }
}
