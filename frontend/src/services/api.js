import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important: send cookies with requests
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 403 Forbidden - likely authentication issue
        if (error.response?.status === 403) {
            console.error('Access forbidden - Authentication may have expired');
            // Optionally redirect to login or refresh token
            localStorage.removeItem('token');
        }
        // 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401) {
            console.error('Unauthorized - Please login again');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const stockAPI = {
    getOverview: (symbol) => api.get(`/stocks/${symbol}/overview`),
};

export const newsAPI = {
    getNews: (symbol) => api.get(`/news/${symbol}`),
    summarize: (symbol, newsTexts) => api.post(`/news/${symbol}/summarize`, newsTexts),
};

export const historyAPI = {
    getHistory: () => api.get('/history'),
    addHistory: (symbol, body) => api.post(`/history/${symbol}`, body || {}),
    deleteHistory: (id) => api.delete(`/history/${id}`),
};

export default api;
