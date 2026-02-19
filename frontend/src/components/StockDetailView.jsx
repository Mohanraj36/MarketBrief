import './StockDetailView.css';
import { useState, useEffect } from 'react';
import { stockAPI } from '../services/api';

const StockDetailView = ({ symbol, news, newsLoading }) => {
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Collapsible states
    const [showStats, setShowStats] = useState(true);
    const [showNews, setShowNews] = useState(true);

    useEffect(() => {
        if (symbol) {
            loadStockData();
        } else {
            setStockData(null);
        }
    }, [symbol]);

     useEffect(() => {
        // If news loading is complete and no news available, clear stock data
        if (!newsLoading && (!news || news.length === 0)) {
            setStockData(null);
        }
    }, [news, newsLoading]);


    const loadStockData = async () => {
        setLoading(true);
        try {
            const response = await stockAPI.getOverview(symbol);
            if (response.data.success) {
                if (news && news.length > 0) {
                    setStockData(response.data.data);
                } else if (!newsLoading) {
                    // If news is empty and not loading, clear stock data
                    setStockData(null);
                }
            }
        } catch (error) {
            console.error('Failed to load stock data:', error);
            setStockData(null);
        } finally {
            setLoading(false);
        }
    };

    // Format timestamp to IST
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return null;

        try {
            const date = new Date(timestamp);
            return date.toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            return null;
        }
    };

    if (!symbol) {
        return (
            <div className="stock-detail-empty">
                <div className="empty-icon">📈</div>
                <h2>Search for a Stock</h2>
                <p>Enter a stock symbol to view detailed information</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="stock-detail-loading">
                <div className="spinner-large"></div>
                <p>Loading stock data...</p>
            </div>
        );
    }

    if (!stockData) {
        return (
            <div className="stock-detail-error">
                <div className="error-icon">⚠️</div>
                <h2>Unable to load stock data</h2>
                <p>Please try again or search for a different symbol</p>
            </div>
        );
    }

    const currencySymbol = stockData.currency === 'USD' ? '$' : '₹';

    return (
        <div className="stock-detail-view">
            {/* Stock Header - Reduced Height */}
            <div className="stock-header-compact">
                <div className="stock-title-compact">
                    <h1>
                        {stockData.name || symbol}
                        <span className="stock-symbol-compact">{symbol}</span>
                    </h1>
                    <div className="stock-meta-tags">
                        <span className="meta-tag">{stockData.exchange}</span>
                        <span className="meta-tag">{stockData.sector}</span>
                    </div>
                </div>
                <div className="stock-price-compact">
                    <span className="current-price-compact">{currencySymbol}{stockData.price || '0.00'}</span>
                    <span className={`price-change-compact ${stockData.changePercent >= 0 ? 'positive' : 'negative'}`}>
                        {stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent || '0.00'}%
                    </span>
                </div>
            </div>

            {/* Company Description - Pro Feature */}
            {showStats && stockData.description && (
                <div className="description-card">
                    <p className="company-description">{stockData.description}</p>
                </div>
            )}

            {/* Performance & Fundamentals - Consolidated Section */}
            <div className="stats-card">
                <div className="section-header">
                    <h2 className="section-title">Market Analysis & Fundamentals</h2>
                    <button
                        className="section-toggle"
                        onClick={() => setShowStats(!showStats)}
                        title={showStats ? 'Hide' : 'Show'}
                    >
                        {showStats ? '⌄' : '›'}
                    </button>
                </div>

                {showStats && (
                    <div className="stats-grid-container">
                        {/* Performance Details */}
                        <div className="stats-category">
                            <h3 className="category-title">Performance</h3>
                            <div className="parameter-grid">
                                <div className="parameter-cell">
                                    <span className="parameter-label">Today's High</span>
                                    <span className="parameter-value">{currencySymbol}{stockData.dayHigh || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">Today's Low</span>
                                    <span className="parameter-value">{currencySymbol}{stockData.dayLow || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">52W High</span>
                                    <span className="parameter-value">{currencySymbol}{stockData.week52High || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">52W Low</span>
                                    <span className="parameter-value">{currencySymbol}{stockData.week52Low || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">50D Avg</span>
                                    <span className="parameter-value">{currencySymbol}{stockData.week50DayAverage || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">200D Avg</span>
                                    <span className="parameter-value">{currencySymbol}{stockData.week200DayAverage || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">Open</span>
                                    <span className="parameter-value">{currencySymbol}{stockData.open || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">Prev Close</span>
                                    <span className="parameter-value">{currencySymbol}{stockData.previousClose || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">Volume</span>
                                    <span className="parameter-value">{stockData.volume || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">Target Price</span>
                                    <span className="parameter-value positive">{currencySymbol}{stockData.analystTargetPrice || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Fundamentals Details */}
                        <div className="stats-category">
                            <h3 className="category-title">Fundamentals</h3>
                            <div className="parameter-grid">
                                <div className="parameter-cell">
                                    <span className="parameter-label">Market Cap</span>
                                    <span className="parameter-value">{stockData.marketCap || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">ROE</span>
                                    <span className="parameter-value">{stockData.roe || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">P/E Ratio</span>
                                    <span className="parameter-value">{stockData.peRatio || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">EPS (TTM)</span>
                                    <span className="parameter-value">{stockData.eps || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">P/B Ratio</span>
                                    <span className="parameter-value">{stockData.pbRatio || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">Div Yield</span>
                                    <span className="parameter-value">{stockData.dividendYield || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">Industry</span>
                                    <span className="parameter-value">{stockData.industry || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">Book Value</span>
                                    <span className="parameter-value">{stockData.bookValue || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">Country</span>
                                    <span className="parameter-value">{stockData.country || 'N/A'}</span>
                                </div>
                                <div className="parameter-cell">
                                    <span className="parameter-label">Currency</span>
                                    <span className="parameter-value">{stockData.currency || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* News Section - Collapsible */}
            <div className="news-section">
                <div className="section-header">
                    <h2 className="section-title">Latest News</h2>
                    <button
                        className="section-toggle"
                        onClick={() => setShowNews(!showNews)}
                        title={showNews ? 'Hide' : 'Show'}
                    >
                        {showNews ? '⌄' : '›'}
                    </button>
                </div>
                {showNews && (
                    <>
                        {newsLoading ? (
                            <div className="news-loading">
                                <div className="spinner"></div>
                                <p>Loading news...</p>
                            </div>
                        ) : news && news.length > 0 ? (
                            <div className="news-grid">
                                {news.map((article, index) => (
                                    <div key={index} className="news-card">
                                        <h4 className="news-title">{article.title}</h4>
                                        <p className="news-description">{article.description}</p>
                                        <div className="news-meta">
                                            <div className="news-source-info">
                                                <span className="news-source">{article.source}</span>
                                                {article.publishedAt && (
                                                    <span className="news-timestamp">
                                                        &nbsp;&nbsp;<i>{formatTimestamp(article.publishedAt)}</i>
                                                    </span>
                                                )}
                                            </div>
                                            <a
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="news-link"
                                            >
                                                Read more →
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="news-empty">
                                <p>No news available for this stock</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default StockDetailView;
