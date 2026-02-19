package com.MarketBriefApp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StockOverviewResponseDto {
    // Basic Info
    private String symbol;
    private String name;
    private String price;
    private String changePercent;
    private String description;
    private String sector;
    private String industry;
    private String currency;
    private String exchange;
    private String country;

    // Performance Metrics
    private String dayHigh;
    private String dayLow;
    private String week52High;
    private String week52Low;
    private String open;
    private String previousClose;
    private String volume;
    private String tradedValue;
    private String upperCircuit;
    private String lowerCircuit;
    private String week50DayAverage;
    private String week200DayAverage;

    // Fundamental Data
    private String marketCap;
    private String peRatio;
    private String pbRatio;
    private String industryPE;
    private String debtToEquity;
    private String roe;
    private String eps;
    private String dividendYield;
    private String bookValue;
    private String faceValue;
    private String analystTargetPrice;
}
