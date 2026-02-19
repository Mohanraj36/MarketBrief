import './AISummarySidebar.css';
import { useState, useEffect } from 'react';
import { newsAPI } from '../services/api';

const AISummarySidebar = ({ symbol, news, onSummaryGenerated, existingSummary }) => {
    const [summary, setSummary] = useState('');
    const [summarizing, setSummarizing] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (existingSummary) {
            setSummary(existingSummary);
        } else {
            setSummary('');
        }
    }, [existingSummary]);

    // Clear summary when symbol changes
    useEffect(() => {
        if (!existingSummary) {
            setSummary('');
        }
    }, [symbol]);

    const handleSummarize = async () => {
        if (!news || news.length === 0) return;

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

    // Improved AI summary parsing - keeps complete points together
    const parseAISummary = (text) => {
        if (!text) return [];

        // Split by common bullet point patterns and numbered lists
        // This regex captures complete points including multi-line content
        const patterns = [
            /\d+\.\s+/,  // Numbered lists: "1. ", "2. "
            /•\s+/,       // Bullet points: "• "
            /-\s+/,       // Dashes: "- "
            /\n\n/        // Double line breaks
        ];

        let points = [text];

        // Try each pattern to split the text
        for (const pattern of patterns) {
            const newPoints = [];
            for (const point of points) {
                const split = point.split(pattern);
                newPoints.push(...split.filter(p => p.trim().length > 0));
            }
            if (newPoints.length > 1) {
                points = newPoints;
                break;
            }
        }

        // Clean up points - remove extra whitespace and line breaks
        return points
            .map(point => point.trim().replace(/\s+/g, ' '))
            .filter(point => point.length > 10); // Filter out too short fragments
    };

    const summaryPoints = parseAISummary(summary);

    return (
        <div className={`ai-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="ai-sidebar-header">
                <button
                    className="ai-collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? 'Show AI Insights' : 'Hide AI Insights'}
                >
                    {isCollapsed ? '❮' : '❯'}
                </button>
                {!isCollapsed && <h3>✨ AI Insights</h3>}
            </div>

            {!isCollapsed && (
                <div className="ai-sidebar-content">
                    {!symbol ? (
                        <div className="ai-empty-state">
                            <div className="ai-empty-icon">🤖</div>
                            <p>No stock selected</p>
                            <small>Search for a stock to get AI-powered insights</small>
                        </div>
                    ) : (
                        <div className="ai-summary-section">
                            {!summary ? (
                                <div className="ai-button-container">
                                    <button
                                        className="ai-summarize-btn"
                                        onClick={handleSummarize}
                                        disabled={summarizing || !news || news.length === 0}
                                    >
                                        {summarizing ? (
                                            <>
                                                <div className="ai-btn-spinner"></div>
                                                Analyzing News...
                                            </>
                                        ) : (
                                            <>
                                                <span className="ai-btn-icon">✨</span>
                                                Summarize with AI
                                            </>
                                        )}
                                    </button>
                                    {(!news || news.length === 0) && (
                                        <p className="ai-no-news">No news available to summarize</p>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="ai-points-container">
                                        <h4 className="ai-points-title">Key Insights</h4>
                                        {summaryPoints.map((point, index) => (
                                            <div key={index} className="ai-point-card">
                                                <div className="ai-point-icon">
                                                    {index + 1}
                                                </div>
                                                <div className="ai-point-text">
                                                    {point}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        className="ai-regenerate-btn"
                                        onClick={handleSummarize}
                                        disabled={summarizing}
                                    >
                                        {summarizing ? '🔄 Regenerating...' : '🔄 Regenerate'}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AISummarySidebar;
