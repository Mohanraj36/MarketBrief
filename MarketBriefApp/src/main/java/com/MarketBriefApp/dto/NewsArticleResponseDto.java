package com.MarketBriefApp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NewsArticleResponseDto {
    private String title;
    private String description;
    private String url;
    private String source;
    private String publishedAt;
}
