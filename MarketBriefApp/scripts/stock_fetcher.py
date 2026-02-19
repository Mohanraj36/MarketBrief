import yfinance as yf
import json
import sys
import pandas as pd
from datetime import datetime

def get_stock_data(symbol, period='1d', interval='5m'):
    # For Indian stocks, default to NSE if no exchange suffix is provided
    # Common Indian symbols are alphabetic and usually up to 10 chars
    original_symbol = symbol.upper()
    if not (original_symbol.endswith('.NS') or original_symbol.endswith('.BO')) and original_symbol.isalpha():
        search_symbol = f"{original_symbol}.NS"
    else:
        search_symbol = original_symbol

    try:
        ticker = yf.Ticker(search_symbol)
        
        # Get Info - prioritize fast access
        info = ticker.info
        
        # Fallback for symbol if NSE didn't work (try US or just return error)
        if not info or ('regularMarketPrice' not in info and 'currentPrice' not in info):
            if search_symbol.endswith('.NS'):
                search_symbol = original_symbol # Try original (maybe it belongs to US)
                ticker = yf.Ticker(search_symbol)
                info = ticker.info

        # Get History
        history = ticker.history(period=period, interval=interval)
        
        chart_data = []
        if not history.empty:
            for index, row in history.iterrows():
                chart_data.append({
                    "time": int(index.timestamp()),
                    "open": round(float(row['Open']), 2),
                    "high": round(float(row['High']), 2),
                    "low": round(float(row['Low']), 2),
                    "close": round(float(row['Close']), 2),
                    "volume": int(row['Volume'])
                })
            
        result = {
            "success": True,
            "symbol": original_symbol,
            "search_symbol": search_symbol,
            "info": {
                "name": info.get('longName', info.get('shortName', original_symbol)),
                "price": info.get('currentPrice', info.get('regularMarketPrice', 0)),
                "changePercent": info.get('regularMarketChangePercent', 0),
                "dayHigh": info.get('dayHigh', 'N/A'),
                "dayLow": info.get('dayLow', 'N/A'),
                "week52High": info.get('fiftyTwoWeekHigh', 'N/A'),
                "week52Low": info.get('fiftyTwoWeekLow', 'N/A'),
                "open": info.get('regularMarketOpen', 'N/A'),
                "previousClose": info.get('regularMarketPreviousClose', 'N/A'),
                "volume": info.get('regularMarketVolume', 'N/A'),
                "marketCap": info.get('marketCap', 'N/A'),
                "peRatio": info.get('trailingPE', info.get('forwardPE', 'N/A')),
                "pbRatio": info.get('priceToBook', 'N/A'),
                "roe": info.get('returnOnEquity', 'N/A'),
                "eps": info.get('trailingEps', 'N/A'),
                "dividendYield": info.get('dividendYield', 'N/A'),
                "bookValue": info.get('bookValue', 'N/A'),
                "faceValue": info.get('faceValue', '10')
            },
            "chart": chart_data
        }
        return result
    except Exception as e:
        return {"success": False, "error": str(e), "symbol": original_symbol}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No symbol provided"}))
        sys.exit(1)
        
    symbol = sys.argv[1]
    period = sys.argv[2] if len(sys.argv) > 2 else '1d'
    interval = sys.argv[3] if len(sys.argv) > 3 else '5m'
    
    data = get_stock_data(symbol, period, interval)
    print(json.dumps(data))
