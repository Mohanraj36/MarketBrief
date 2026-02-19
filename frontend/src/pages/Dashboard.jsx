import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import HistorySidebar from '../components/HistorySidebar';
import StockDetailView from '../components/StockDetailView';
import AISummarySidebar from '../components/AISummarySidebar';
import { historyAPI, newsAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [currentSymbol, setCurrentSymbol] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [currentSummary, setCurrentSummary] = useState('');
    const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

    // News State
    const [news, setNews] = useState([]);
    const [newsLoading, setNewsLoading] = useState(false);

    // Fetch News when symbol changes
    useEffect(() => {
        if (!currentSymbol) {
            setNews([]);
            return;
        }

        const loadNews = async () => {
            setNewsLoading(true);
            try {
                const response = await newsAPI.getNews(currentSymbol);
                if (response.data.success) {
                    setNews(response.data.data);
                } else {
                    setNews([]);
                }
            } catch (error) {
                console.error('Failed to load news:', error);
                setNews([]);
            } finally {
                setNewsLoading(false);
            }
        };

        loadNews();
    }, [currentSymbol]);

    // Validate and sanitize input - only allow letters and numbers
    const handleSearchInputChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9.]/g, '').toUpperCase();
        setSearchInput(value);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmedSymbol = searchInput.trim();

        // Validate symbol: must be 1-5 letters, no numbers or special chars
        if (!trimmedSymbol || trimmedSymbol.length < 1) {
            alert('Please enter a valid stock symbol');
            return;
        }

        // Only allow alphabetic characters and dots
        if (!/^[A-Z.]+$/.test(trimmedSymbol)) {
            alert('Stock symbol should only contain letters and dots (e.g., TCS.NSE)');
            return;
        }

        setCurrentSymbol(trimmedSymbol);
        setCurrentSummary(''); // Reset summary for new search
        setSearchInput(''); // Clear input after search

        // Add to history without summary initially
        try {
            await historyAPI.addHistory(trimmedSymbol);
            // Trigger history reload in HistorySidebar
            setHistoryRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Failed to add to history:', error);
        }
    };

    const handleSelectStock = (historyItem) => {
        setCurrentSymbol(historyItem.symbol);
        setCurrentSummary(historyItem.aiSummary || '');
    };

    const handleSummaryGenerated = async (summary) => {
        setCurrentSummary(summary);
        // Save summary to history
        try {
            await historyAPI.addHistory(currentSymbol, { aiSummary: summary });
        } catch (error) {
            console.error('Failed to save summary:', error);
        }
    };

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-left">
                    <h1 className="app-title">
                        <span className="logo-icon">📊</span>
                        MarketBrief
                    </h1>
                </div>

                <div className="header-right">
                    <span className="user-email">{user?.email}</span>
                    <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    <button className="logout-btn" onClick={logout}>
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Layout */}
            <div className="dashboard-layout">
                <HistorySidebar
                    refreshKey={historyRefreshKey}
                    onSelectStock={handleSelectStock}
                    currentSymbol={currentSymbol}
                />

                <main className="main-content">
                    {/* Search Section */}
                    <div className="search-section">
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Enter symbol (e.g., IBM, TCS.NSE, RELIANCE.NSE)"
                                value={searchInput}
                                onChange={handleSearchInputChange}
                                maxLength="15"
                            />
                            <button type="submit" className="search-btn">
                                Search Stock
                            </button>
                        </form>
                    </div>

                    {/* Stock Detail & News */}
                    <StockDetailView
                        symbol={currentSymbol}
                        news={news}
                        newsLoading={newsLoading}
                    />
                </main>

                <AISummarySidebar
                    symbol={currentSymbol}
                    news={news}
                    existingSummary={currentSummary}
                    onSummaryGenerated={handleSummaryGenerated}
                />
            </div>

            {/* Footer */}
            <footer className="dashboard-footer">
                <div className="footer-content">
                    <p>
                        <strong>⚠️ Disclaimer:</strong> This platform is not registered with SEBI (Securities and Exchange Board of India).
                        All information provided is for educational and informational purposes only.
                        Please consult with a certified financial advisor before making any investment decisions.
                    </p>
                    <p className="footer-copyright">
                        © 2026 MarketBrief. Not for commercial use.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
