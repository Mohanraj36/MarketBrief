package com.MarketBriefApp.repository;

import com.MarketBriefApp.entity.SearchHistory;
import com.MarketBriefApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    List<SearchHistory> findByUserOrderByTimestampDesc(User user);

    boolean existsByUserAndSymbol(User user, String symbol);

    void deleteByUserAndSymbol(User user, String symbol);
}
