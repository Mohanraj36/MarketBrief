import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
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

export const useRealtimeChart = (symbol, containerRef) => {
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!symbol || !containerRef.current) return;

        setLoading(true);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        // 1. Initialize Chart
        const chart = createChart(containerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: isDark ? '#d1d5db' : '#374151',
            },
            grid: {
                vertLines: { color: isDark ? 'rgba(75, 85, 99, 0.1)' : 'rgba(209, 213, 219, 0.2)' },
                horzLines: { color: isDark ? 'rgba(75, 85, 99, 0.1)' : 'rgba(209, 213, 219, 0.2)' },
            },
            width: containerRef.current.clientWidth,
            height: 450,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

        // Auto-resize
        const handleResize = () => {
            if (containerRef.current) {
                chart.applyOptions({ width: containerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        // 2. Fetch Initial Batch (1 Day, 1 Min intervals)
        const fetchInitialData = async () => {
            const nseSymbol = ensureNSE(symbol);
            try {
                const url = `https://query1.finance.yahoo.com/v8/finance/chart/${nseSymbol}?interval=1m&range=1d`;
                const json = await fetchWithCorsFallback(url);

                const result = json.chart.result[0];
                const quote = result.indicators.quote[0];
                const timestamps = result.timestamp;

                const formattedData = timestamps.map((ts, i) => ({
                    time: ts,
                    open: quote.open[i],
                    high: quote.high[i],
                    low: quote.low[i],
                    close: quote.close[i]
                })).filter(d => d.open !== null);

                candlestickSeries.setData(formattedData);
                chart.timeScale().fitContent();
            } catch (err) {
                console.error('Initial chart data error:', err);
            } finally {
                setLoading(false);
            }
        };

        // 3. Polling for Real-Time Updates
        const updateRealtime = async () => {
            const nseSymbol = ensureNSE(symbol);
            try {
                // Fetch latest data point
                const url = `https://query1.finance.yahoo.com/v8/finance/chart/${nseSymbol}?interval=1m&range=1d`;
                const json = await fetchWithCorsFallback(url);

                const result = json.chart.result[0];
                const quote = result.indicators.quote[0];
                const ts = result.timestamp[result.timestamp.length - 1];
                const i = result.timestamp.length - 1;

                const newCandle = {
                    time: ts,
                    open: quote.open[i],
                    high: quote.high[i],
                    low: quote.low[i],
                    close: quote.close[i]
                };

                if (newCandle.open !== null) {
                    candlestickSeries.update(newCandle);
                }
            } catch (err) {
                console.warn('Real-time chart update failed:', err);
            }
        };

        fetchInitialData();
        const interval = setInterval(updateRealtime, 5000); // 5 sec interval

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(interval);
            chart.remove();
        };
    }, [symbol]);

    return { loading };
};
