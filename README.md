# MarketBrief Grok-AI Powered Market News Summarization
A full-stack web application for real-time stock market analysis, news aggregation, and AI-powered insights. Built with Spring Boot backend and React frontend, featuring JWT authentication, live price tracking, and intelligent news summarization.

## 🎯 Usage Guide
### Getting Started
- Register an account on the login page
- Search for a stock symbol:
- US Stocks: AAPL, MSFT, GOOGL
- Indian Stocks: TCS.NS, RELIANCE.NS, INFY.NS- 
- View real-time price charts and fundamental data
- Wait 2-3 minutes before searching another stock
- Summarize news articles using AI insights
- Track history of searched stocks

## 📦 Project Structure
``` bash
MarketBrief/
├── MarketBriefApp/              # Backend (Spring Boot)
│   ├── src/main/java/
│   │   └── com/MarketBriefApp/
│   │       ├── config/          # Configuration & Environment Setup
│   │       ├── controller/      # REST API Endpoints
│   │       ├── service/         # Business Logic & External APIs
│   │       ├── security/        # JWT Authentication
│   │       ├── dto/             # Data Transfer Objects
│   │       └── entity/          # Database Models
│   ├── pom.xml                  # Maven Dependencies
│   └── application.properties   # Spring Configuration
│
└── frontend/                    # Frontend (React + Vite)
    ├── src/
    │   ├── components/          # Reusable React Components
    │   ├── pages/               # Page Components (Login, Dashboard)
    │   ├── services/            # API Service Layer
    │   ├── hooks/               # Custom React Hooks
    │   ├── context/             # Context API (Auth, Theme)
    │   ├── utils/               # Utility Functions
    │   └── App.jsx              # Main App Component
    ├── package.json             # NPM Dependencies
    └── vite.config.js           # Vite Configuration
```

## 🌟 Features
### Core Functionality

- **Real-Time Stock Data:** Live price quotes, performance metrics, and technical indicators
- **AI-Powered News Summaries:** Intelligent analysis of market news using Groq AI
- **Search History:** Persistent user history with saved AI summaries
- **Responsive Design:** Dark/Light theme support with mobile-friendly UI
- **Secure Authentication:** JWT-based user authentication and authorization

### Technical Highlights
- **Multi-Exchange Support:** NSE (Indian stocks) and US stock symbols
- **User Dashboard:** Personalized stock tracking and analysis interface

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 4.0.2
- **Language:** Java
- **Database:** MySQL
- **Security:** JWT (JSON Web Tokens)
- **Build Tool:** Maven

### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite
- **Styling:** CSS3 with CSS Variables
- **HTTP Client:** Axios

### External APIs
- **Stock Data:** Alpha Vantage API (Global Quote, Company Overview)
- **News Data:** NewsAPI.org (Latest market news)
- **AI Summarization:** Groq API (Llama 3.3-70B model)
- **Real-Time Prices:** Yahoo Finance API (via CORS proxy fallback)

## ⚠️ Important API Limitations
-Free Tier Considerations
-API	Limit	Stock Support	Notes
-Alpha Vantage	5 req/min	US Stocks	Indian stocks may fail; use for fundamentals
-NewsAPI.org	100 req/day	Global	Free tier has limited articles
-Groq API	30 req/min	-	Free tier available; excellent for summaries

## ⏳ IMPORTANT: Wait 2-3 Minutes Between Stock Searches
### Due to API rate limits, please wait 2-3 minutes between analyzing different stocks. This prevents hitting rate limits and ensures consistent data retrieval.

In Indian Stock Support
- Works: NSE stocks with .NS suffix (e.g., TCS.NS, RELIANCE.NS)
- Limitation: Alpha Vantage free tier primarily supports US stocks
- Workaround: Append .NS suffix for Indian stock symbols
- Native Support: Full API support for US stocks
- No Suffix Needed: Enter symbols like AAPL, MSFT, GOOGL
- Faster Response: Optimized API integration for US market data

# 📋 Prerequisites
- Requirements
- Java 17+ (JDK)
- Node.js 18+ & npm
- MySQL 8.0+
- Git

# API Keys Required
- Alpha Vantage - Stock fundamental data
- Get key: https://www.alphavantage.co/api/

- NewsAPI.org - Market news articles
- Get Key: https://newsapi.org/

- Groq API - AI-powered news summaries
- Get key: https://console.groq.com/

### 📄 License
- **This project is provided as-is for educational purposes. Not registered with SEBI (Securities and Exchange Board of India).**

## ⚠️ Disclaimer
- **This platform is NOT a financial advisor. All information is for educational purposes only. Do not make investment decisions based solely on this platform's analysis. Consult with a certified financial advisor before investing.***
