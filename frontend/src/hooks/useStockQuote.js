import { useState, useEffect } from 'react';
import { ensureNSE } from '../utils/formatters';

// Try direct fetch first, fallback to AllOrigins proxy on failure
const fetchWithCorsFallback = async (url) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Network response was not ok (${res.status})`);
        return await res.json();
    } catch (err) {
        // Fallback to public CORS proxy
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error(`Proxy response was not ok (${res.status})`);
        return await res.json();
    }
};

export const useStockQuote = (symbol) => {
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchQuote = async () => {
        if (!symbol) return;
        const nseSymbol = ensureNSE(symbol);

        try {
            const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${nseSymbol}`;
            const json = await fetchWithCorsFallback(url);

            if (json && json.quoteResponse && json.quoteResponse.result && json.quoteResponse.result.length > 0) {
                setQuote(json.quoteResponse.result[0]);
                setError(null);
            } else {
                setError('Stock not found or API error');
            }
        } catch (err) {
            console.error('Quote fetch failed:', err);
            setError('Failed to stream live price');
        }
    };

    useEffect(() => {
        if (!symbol) {
            setQuote(null);
            return;
        }

        setLoading(true);
        fetchQuote().finally(() => setLoading(false));

        // Poll every 10 seconds for real-time price
        const interval = setInterval(fetchQuote, 10000);
        return () => clearInterval(interval);
    }, [symbol]);

    return { quote, loading, error };
};
