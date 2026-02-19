import { useState, useEffect } from 'react';
import { ensureNSE } from '../utils/formatters';

// Try direct fetch first, fallback to AllOrigins proxy on failure
const fetchWithCorsFallback = async (url) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Network response was not ok (${res.status})`);
        return await res.json();
    } catch (err) {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error(`Proxy response was not ok (${res.status})`);
        return await res.json();
    }
};

export const useFundamentals = (symbol) => {
    const [fundamentals, setFundamentals] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFundamentals = async () => {
            if (!symbol) {
                setFundamentals(null);
                return;
            }

            const nseSymbol = ensureNSE(symbol);
            setLoading(true);

            try {
                const modules = 'price,summaryDetail,defaultKeyStatistics,financialData,summaryProfile';
                const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${nseSymbol}?modules=${modules}`;
                const json = await fetchWithCorsFallback(url);

                if (json.quoteSummary && json.quoteSummary.result && json.quoteSummary.result.length > 0) {
                    setFundamentals(json.quoteSummary.result[0]);
                    setError(null);
                } else {
                    setError('Fundamental data not available');
                }
            } catch (err) {
                console.error('Fundamentals fetch error:', err);
                setError('Failed to load company fundamentals');
            } finally {
                setLoading(false);
            }
        };

        fetchFundamentals();
    }, [symbol]);

    return { fundamentals, loading, error };
};
