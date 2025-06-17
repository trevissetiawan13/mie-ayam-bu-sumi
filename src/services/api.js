import axios from "axios";

// HARDCODE sementara — untuk testing di Vercel
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  console.warn("VITE_API_URL is not defined in environment variables.");
}


console.log("API_URL used by frontend:", API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menyisipkan token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mieAyamToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const loginUser = (credentials) =>
  apiClient.post("/auth/login", credentials);

// Transaksi
export const getTransactions = () => apiClient.get("/transactions");
export const addTransaction = (data) => apiClient.post("/transactions", data);
export const deleteTransaction = (id) =>
  apiClient.delete(`/transactions/${id}`);

export default apiClient;
