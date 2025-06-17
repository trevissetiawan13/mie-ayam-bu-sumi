import axios from 'axios';

const API_URL = 'https://empty-glade-e536.mieayambusumi.workers.dev';
console.log('API_URL used by frontend:', API_URL);
console.log('API_URL used by frontend:', import.meta.env.VITE_API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyisipkan token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mieAyamToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);

// Transaksi
export const getTransactions = () => apiClient.get('/transactions');
export const addTransaction = (data) => apiClient.post('/transactions', data);
export const deleteTransaction = (id) => apiClient.delete(`/transactions/${id}`);

export default apiClient;
