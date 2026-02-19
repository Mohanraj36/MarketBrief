package com.MarketBriefApp.mapper;

import com.MarketBriefApp.dto.AuthResponseDto;
import com.MarketBriefApp.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public AuthResponseDto toAuthResponse(User user, String token) {
        return AuthResponseDto.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }
}
