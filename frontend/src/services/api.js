import axios from 'axios';

// VITE_API_URL akan diambil dari file .env.production atau .env.development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
console.log('API_URL used by frontend:', API_URL); // Untuk debugging // Sesuaikan jika port backend berbeda

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