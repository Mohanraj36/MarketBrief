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

export const yahooFinanceService = {
    fetchQuote: async (symbol) => {
        const nseSymbol = ensureNSE(symbol);
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${nseSymbol}`;
        const json = await fetchWithCorsFallback(url);

        if (json && json.quoteResponse && json.quoteResponse.result && json.quoteResponse.result.length > 0) {
            return json.quoteResponse.result[0];
        }
        throw new Error('Stock not found or API error');
    },

    fetchFundamentals: async (symbol) => {
        const nseSymbol = ensureNSE(symbol);
        const modules = 'price,summaryDetail,defaultKeyStatistics,financialData,summaryProfile';
        const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${nseSymbol}?modules=${modules}`;
        const json = await fetchWithCorsFallback(url);

        if (json.quoteSummary && json.quoteSummary.result && json.quoteSummary.result.length > 0) {
            return json.quoteSummary.result[0];
        }
        throw new Error('Fundamental data not available');
    }
};
