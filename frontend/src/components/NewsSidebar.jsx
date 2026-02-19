import './NewsSidebar.css';
import { useState, useEffect } from 'react';
import { newsAPI } from '../services/api';

const NewsSidebar = ({ symbol, existingSummary, onSummaryGenerated }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const [summarizing, setSummarizing] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (symbol) {
            loadNews();
        } else {
            setNews([]);
            setSummary('');
        }
    }, [symbol]);

    useEffect(() => {
        if (existingSummary) {
            setSummary(existingSummary);
        } else {
            setSummary('');
        }
    }, [existingSummary]);

    const loadNews = async () => {
        setLoading(true);
        try {
            const response = await newsAPI.getNews(symbol);
            if (response.data.success) {
                setNews(response.data.data);
            }
        } catch (error) {
            console.error('Failed to load news:', error);
            setNews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSummarize = async () => {
        if (news.length === 0) return;

        setSummarizing(true);
        try {
            const newsTexts = news.map(article =>
                `${article.title}. ${article.description || ''}`
            ).slice(0, 5);

            const response = await newsAPI.summarize(symbol, newsTexts);
            if (response.data.success) {
                const generatedSummary = response.data.data;
                setSummary(generatedSummary);
                if (onSummaryGenerated) {
                    onSummaryGenerated(generatedSummary);
                }
            }
        } catch (error) {
            console.error('Failed to summarize:', error);
            setSummary('Failed to generate summary. Please try again.');
        } finally {
            setSummarizing(false);
        }
    };

    return (
        <div className={`news-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {!isCollapsed && <h3>Latest News</h3>}
                {!isCollapsed && symbol && (
                    <span className="news-count">{news.length} articles</span>
                )}
                <button
                    className="collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? 'Show News' : 'Hide News'}
                >
                    {isCollapsed ? '←' : '→'}
                </button>
            </div>

            {!isCollapsed && (
                <>
                    {!symbol ? (
                        <div className="empty-state">
                            <p>No stock selected</p>
                            <small>Search for a stock to see news</small>
                        </div>
                    ) : (
                        <>
                            <div className="news-list">
                                {loading ? (
                                    <div className="loading-state">
                                        <div className="spinner"></div>
                                        <p>Loading news...</p>
                                    </div>
                                ) : news.length === 0 ? (
                                    <div className="empty-state">
                                        <p>No news available</p>
                                        <small>No recent news found for {symbol}</small>
                                    </div>
                                ) : (
                                    news.map((article, index) => (
                                        <div key={index} className="news-item">
                                            <h4 className="news-title">{article.title}</h4>
                                            <p className="news-description">{article.description}</p>
                                            <div className="news-meta">
                                                <span className="news-source">{article.source}</span>
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
                                    ))
                                )}
                            </div>

                            {/* AI Summary Section */}
                            {news.length > 0 && (
                                <div className="summary-section">
                                    {!summary ? (
                                        <button
                                            className="summarize-btn"
                                            onClick={handleSummarize}
                                            disabled={summarizing}
                                        >
                                            {summarizing ? (
                                                <>
                                                    <div className="btn-spinner"></div>
                                                    Generating Summary...
                                                </>
                                            ) : (
                                                <>
                                                    <span>✨</span>
                                                    Summarize with AI
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <>
                                            <div className="summary-box">
                                                <h4>Key Points to Note</h4>
                                                <div className="summary-content">
                                                    {summary}
                                                </div>
                                            </div>
                                            <button
                                                className="regenerate-btn"
                                                onClick={handleSummarize}
                                                disabled={summarizing}
                                            >
                                                {summarizing ? 'Regenerating...' : 'Regenerate Summary'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default NewsSidebar;
