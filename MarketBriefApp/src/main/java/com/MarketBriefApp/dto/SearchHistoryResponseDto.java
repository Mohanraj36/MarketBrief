package com.MarketBriefApp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchHistoryResponseDto {
    private Long id;
    private String symbol;
    private String name;
    private String aiSummary;
    private LocalDateTime timestamp;
}
