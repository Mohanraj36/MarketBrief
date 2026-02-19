package com.MarketBriefApp.controller;

import com.MarketBriefApp.dto.AuthResponseDto;
import com.MarketBriefApp.dto.BaseResponseDto;
import com.MarketBriefApp.dto.LoginRequestDto;
import com.MarketBriefApp.dto.RegisterRequestDto;
import com.MarketBriefApp.entity.User;
import com.MarketBriefApp.security.JwtUtil;
import com.MarketBriefApp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MarketBriefApp.mapper.UserMapper;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<BaseResponseDto<AuthResponseDto>> register(@Valid @RequestBody RegisterRequestDto request) {
        User user = userService.createUser(request);
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        AuthResponseDto response = userMapper.toAuthResponse(user, token);

        return ResponseEntity.ok(BaseResponseDto.ok(response, "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<BaseResponseDto<AuthResponseDto>> login(@Valid @RequestBody LoginRequestDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        User user = userService.findByEmail(request.getEmail()).orElseThrow();

        AuthResponseDto response = userMapper.toAuthResponse(user, token);

        return ResponseEntity.ok(BaseResponseDto.ok(response, "Login successful"));
    }
}
