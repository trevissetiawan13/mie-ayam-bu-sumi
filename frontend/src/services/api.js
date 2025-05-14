import axios from 'axios';

// Ambil URL dari environment variable
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
console.log('API_URL used by frontend:', API_URL); // Debugging

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor untuk menambahkan token ke setiap request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('mieAyamToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);

export const getTransactions = () => apiClient.get('/transactions');
export const addTransaction = (transactionData) => apiClient.post('/transactions', transactionData);
export const deleteTransaction = (id) => apiClient.delete(`/transactions/${id}`);

export const getSummaryData = (period) => apiClient.get(`/transactions/summary?period=${period}`);

export default apiClient;