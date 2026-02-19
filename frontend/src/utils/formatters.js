/**
 * Currency and Number Formatting Utilities
 */

export const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(value);
};

export const formatIndianNumber = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0.00';
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2
    }).format(value);
};

export const formatLargeNumber = (value) => {
    if (value === undefined || value === null || isNaN(value)) return 'N/A';

    // Convert to absolute value for checking range
    const absValue = Math.abs(value);

    if (absValue >= 1e12) {
        return `₹${(value / 1e12).toFixed(2)}T`; // Trillion
    } else if (absValue >= 1e9) {
        return `₹${(value / 1e9).toFixed(2)}B`; // Billion
    } else if (absValue >= 1e7) {
        return `₹${(value / 1e7).toFixed(2)}Cr`; // Crore
    } else if (absValue >= 1e5) {
        return `₹${(value / 1e5).toFixed(2)}L`; // Lakh
    }

    return formatCurrency(value);
};

export const formatPercentage = (value) => {
    if (value === undefined || value === null || isNaN(value)) return 'N/A';
    // If value is a fraction (e.g. 0.15 for 15%), convert to percentage
    const p = Math.abs(value) < 1 && value !== 0 ? value * 100 : value;
    return `${p.toFixed(2)}%`;
};

/**
 * Symbol Helper
 */
export const isNSE = (symbol) => {
    if (!symbol) return false;
    const upper = symbol.toUpperCase().trim();
    const usStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'NFLX'];
    return /^[A-Z]+$/.test(upper) && !usStocks.includes(upper);
};

export const ensureNSE = (symbol) => {
    if (!symbol) return '';
    const upper = symbol.toUpperCase().trim();
    if (isNSE(upper) && !upper.endsWith('.NS')) {
        return `${upper}.NS`;
    }
    return upper;
};

