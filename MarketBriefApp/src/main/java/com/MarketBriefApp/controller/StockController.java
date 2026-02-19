package com.MarketBriefApp.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MarketBriefApp.dto.BaseResponseDto;
import com.MarketBriefApp.dto.StockOverviewResponseDto;
import com.MarketBriefApp.service.external.StockExternalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockExternalService stockService;

    @SuppressWarnings("unchecked")
	@GetMapping("/{symbol}/overview")
    public ResponseEntity<BaseResponseDto<StockOverviewResponseDto>> getStockOverview(@PathVariable String symbol) {
        System.out.println("Fetching Alpha Vantage overview for symbol: " + symbol);
        
        Map<String, Object> overview = stockService.getStockOverview(symbol);
        Map<String, Object> quote = stockService.getStockQuote(symbol);
        
        // check api limit
        if ((overview != null && overview.containsKey("Note")) || (quote != null && quote.containsKey("Note"))) {
            return ResponseEntity.ok(BaseResponseDto.error("API rate limit reached. Please try again in a minute."));
        }

        // handle Api error for invalid ticker anem 
        if ((overview == null || overview.isEmpty() || overview.containsKey("Error Message")) && 
            (quote == null || quote.isEmpty() || !quote.containsKey("Global Quote"))) {
            return ResponseEntity.ok(BaseResponseDto.error("Stock not found or invalid symbol: " + symbol));
        }

        Map<String, Object> quoteData = quote != null && quote.containsKey("Global Quote")
                ? (Map<String, Object>) quote.get("Global Quote")
                : Map.of();

        // get 
        String price = (String) quoteData.getOrDefault("05. price", "0.00");
        String change = (String) quoteData.getOrDefault("10. change percent", "0%");
        String volume = (String) quoteData.getOrDefault("06. volume", "0");
        String high = (String) quoteData.getOrDefault("03. high", "0.00");
        String low = (String) quoteData.getOrDefault("04. low", "0.00");
        String open = (String) quoteData.getOrDefault("02. open", "0.00");
        String prevClose = (String) quoteData.getOrDefault("08. previous close", "0.00");

        double priceVal = parseDouble(price);
        String upperCircuit = priceVal > 0 ? String.format("%.2f", priceVal * 1.20) : "N/A";
        String lowerCircuit = priceVal > 0 ? String.format("%.2f", priceVal * 0.80) : "N/A";

        // if API doesn't return it
        String name = (String) overview.getOrDefault("Name", "N/A");
        if ("N/A".equals(name) || name == null || name.isEmpty()) {
            name = symbol.toUpperCase();
        }

        StockOverviewResponseDto response = StockOverviewResponseDto.builder()
                .symbol(symbol.toUpperCase())
                .name(name)
                .price(price)
                .changePercent(change.replace("%", ""))
                .description((String) overview.getOrDefault("Description", "No description available."))
                .sector((String) overview.getOrDefault("Sector", "N/A"))
                .industry((String) overview.getOrDefault("Industry", "N/A"))
                .currency((String) overview.getOrDefault("Currency", "INR"))
                .exchange((String) overview.getOrDefault("Exchange", "N/A"))
                .country((String) overview.getOrDefault("Country", "N/A"))
                .dayHigh(high)
                .dayLow(low)
                .week52High((String) overview.getOrDefault("52WeekHigh", "N/A"))
                .week52Low((String) overview.getOrDefault("52WeekLow", "N/A"))
                .week50DayAverage((String) overview.getOrDefault("50DayMovingAverage", "N/A"))
                .week200DayAverage((String) overview.getOrDefault("200DayMovingAverage", "N/A"))
                .open(open)
                .previousClose(prevClose)
                .volume(volume)
                .tradedValue(calculateTradedValue(volume, price))
                .upperCircuit(upperCircuit)
                .lowerCircuit(lowerCircuit)
                .marketCap(formatLargeValue((String) overview.getOrDefault("MarketCapitalization", "N/A")))
                .peRatio((String) overview.getOrDefault("PERatio", "N/A"))
                .pbRatio((String) overview.getOrDefault("PriceToBookRatio", "N/A"))
                .industryPE("N/A") 
                .debtToEquity("N/A") 
                .roe(formatPercentValue((String) overview.getOrDefault("ReturnOnEquityTTM", "N/A")))
                .eps((String) overview.getOrDefault("EPS", "N/A"))
                .dividendYield(formatPercentValue((String) overview.getOrDefault("DividendYield", "N/A")))
                .bookValue((String) overview.getOrDefault("BookValue", "N/A"))
                .faceValue("N/A")
                .analystTargetPrice((String) overview.getOrDefault("AnalystTargetPrice", "N/A"))
                .build();

        return ResponseEntity.ok(BaseResponseDto.ok(response, "Stock overview fetched successfully"));
    }

    private String formatLargeValue(String val) {
        if (val == null || "N/A".equals(val)) return "N/A";
        try {
            double total = Double.parseDouble(val);
            if (total >= 1e12) return String.format("%.2fT", total / 1e12);
            if (total >= 1e9) return String.format("%.2fB", total / 1e9);
            if (total >= 1e7) return String.format("%.2fCr", total / 1e7);
            if (total >= 1e5) return String.format("%.2fL", total / 1e5);
            return String.format("%.2f", total);
        } catch (Exception e) { return val; }
    }

    private String formatPercentValue(String val) {
        if (val == null || "N/A".equals(val)) return "N/A";
        try {
            double p = Double.parseDouble(val);
            return String.format("%.2f%%", p * (p < 1 ? 100 : 1)); // Handle both 0.15 and 15
        } catch (Exception e) { return val; }
    }



    private double parseDouble(String value) {
        try {
            return Double.parseDouble(value);
        } catch (Exception e) {
            return 0.0;
        }
    }

    private String calculateTradedValue(String volume, String price) {
        try {
            double vol = Double.parseDouble(volume);
            double prc = Double.parseDouble(price);
            double tradedValue = vol * prc;

            if (tradedValue >= 1e9)
                return String.format("%.2fB", tradedValue / 1e9);
            if (tradedValue >= 1e6)
                return String.format("%.2fM", tradedValue / 1e6);
            if (tradedValue >= 1e3)
                return String.format("%.2fK", tradedValue / 1e3);
            return String.format("%.2f", tradedValue);
        } catch (Exception e) {
            return "N/A";
        }
    }
}
