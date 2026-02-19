import './HistorySidebar.css';
import { useState, useEffect } from 'react';
import { historyAPI } from '../services/api';

const HistorySidebar = ({ onSelectStock, currentSymbol, refreshKey }) => {
    const [history, setHistory] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        loadHistory();
    }, [refreshKey]);

    const loadHistory = async () => {
        setLoadError(null);
        try {
            const response = await historyAPI.getHistory();
            if (response.data.success && response.data.data) {
                setHistory(response.data.data);
            } else {
                setHistory([]);
                setLoadError(response.data.message || 'Failed to load history');
            }
        } catch (error) {
            console.error('Failed to load history:', error);
            // Only show error if it's not a 403 (which is expected if not authenticated)
            if (error.response?.status !== 403 && error.response?.status !== 401) {
                setLoadError('Failed to load search history');
            }
            setHistory([]);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await historyAPI.deleteHistory(id);
            loadHistory(); // Reload history
        } catch (error) {
            console.error('Failed to delete history:', error);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`history-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {!isCollapsed && <h3>📜 Search History</h3>}
                <button
                    className="collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Show History" : "Hide History"}
                >
                    {isCollapsed ? '❯' : '❮'}
                </button>
            </div>

            {!isCollapsed && (
                <div className="history-list">
                    {history.length === 0 ? (
                        <div className="empty-state">
                            <p>No search history yet</p>
                            <small>Search for stocks to see them here</small>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div
                                key={item.id}
                                className={`history-item ${item.symbol === currentSymbol ? 'active' : ''}`}
                                onClick={() => onSelectStock(item)}
                            >
                                <div className="symbol-icon">{item.symbol.charAt(0)}</div>
                                <div className="symbol-info">
                                    <span className="symbol-name">{item.symbol}</span>
                                    <small>{formatDate(item.timestamp)} • {formatTime(item.timestamp)}</small>
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => handleDelete(e, item.id)}
                                    title="Delete"

                                >
                                    ...
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default HistorySidebar;
