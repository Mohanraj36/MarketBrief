package com.MarketBriefApp.controller;

import com.MarketBriefApp.dto.BaseResponseDto;
import com.MarketBriefApp.dto.SearchHistoryResponseDto;
import com.MarketBriefApp.entity.SearchHistory;
import com.MarketBriefApp.entity.User;
import com.MarketBriefApp.repository.SearchHistoryRepository;
import com.MarketBriefApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final SearchHistoryRepository historyRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<BaseResponseDto<List<SearchHistoryResponseDto>>> getHistory() {
        User user = getCurrentUser();
        List<SearchHistoryResponseDto> history = historyRepository.findByUserOrderByTimestampDesc(user)
                .stream()
                .map(h -> SearchHistoryResponseDto.builder()
                        .id(h.getId())
                        .symbol(h.getSymbol())
                        .name(h.getName())
                        .aiSummary(h.getAiSummary())
                        .timestamp(h.getTimestamp())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(BaseResponseDto.ok(history, "History fetched"));
    }

    @PostMapping("/{symbol}")
    public ResponseEntity<BaseResponseDto<String>> addHistory(@PathVariable String symbol,
            @RequestBody(required = false) Map<String, String> body) {
        User user = getCurrentUser();
        String aiSummary = body != null ? body.get("aiSummary") : null;

        SearchHistory history = SearchHistory.builder()
                .user(user)
                .symbol(symbol.toUpperCase())
                .name(symbol.toUpperCase())
                .aiSummary(aiSummary)
                .build();

        historyRepository.save(history);
        return ResponseEntity.ok(BaseResponseDto.ok(symbol, "History updated"));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<BaseResponseDto<String>> deleteHistory(@PathVariable Long id) {
        User user = getCurrentUser();
        SearchHistory history = historyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("History not found"));

        if (!history.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        historyRepository.delete(history);
        return ResponseEntity.ok(BaseResponseDto.ok("Deleted", "History item deleted"));
    }

    private User getCurrentUser() {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        return userRepository.findByEmail(email).orElseThrow();
    }
}
