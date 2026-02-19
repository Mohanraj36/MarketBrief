package com.MarketBriefApp.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MarketBriefApp.dto.BaseResponseDto;
import com.MarketBriefApp.dto.NewsArticleResponseDto;
import com.MarketBriefApp.service.external.AISummaryService;
import com.MarketBriefApp.service.external.NewsExternalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsExternalService newsService;
    private final AISummaryService aiService;

    @SuppressWarnings("unchecked")
	@GetMapping("/{symbol}")
    public ResponseEntity<BaseResponseDto<List<NewsArticleResponseDto>>> getNews(@PathVariable String symbol) {
        Map<String, Object> newsData = newsService.getStockNews(symbol);

        List<NewsArticleResponseDto> articles = List.of();
        if (newsData != null && newsData.containsKey("articles")) {
            List<Map<String, Object>> rawArticles = (List<Map<String, Object>>) newsData.get("articles");
            articles = rawArticles.stream()
                    .map(article -> NewsArticleResponseDto.builder()
                            .title((String) article.get("title"))
                            .description((String) article.get("description"))
                            .url((String) article.get("url"))
                            .source(article.containsKey("source")
                                    ? (String) ((Map<String, Object>) article.get("source")).get("name")
                                    : "Unknown")
                            .publishedAt((String) article.get("publishedAt"))
                            .build())
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(BaseResponseDto.ok(articles, "News fetched successfully"));
    }

    @PostMapping("/{symbol}/summarize")
    public ResponseEntity<BaseResponseDto<String>> summarizeNews(@PathVariable String symbol,
            @RequestBody List<String> newsTexts) {
        String summary = aiService.summarizeNews(symbol,newsTexts);
        return ResponseEntity.ok(BaseResponseDto.ok(summary, "Summary generated successfully"));
    }
}
