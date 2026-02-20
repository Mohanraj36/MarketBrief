### 📚 API Endpoints

## Authentication
- ** POST   /api/auth/login**          - User login
- ** POST   /api/auth/register**       - User registration

## Stocks
- ** GET    /api/stocks/{symbol}/overview**  - Get stock fundamentals & market data
## News
- ** GET    /api/news/{symbol}**       - Get latest news for stock
- **POST   /api/news/{symbol}/summarize**   - Generate AI summary of news
##History
- ** GET    /api/history**       - Get user's search history
- ** POST   /api/history/{symbol}**    - Add stock to history
- ** DELETE /api/history/{id}**        - Delete history entry
