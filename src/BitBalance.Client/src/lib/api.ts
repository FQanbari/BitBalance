
import axios from 'axios';
import { Alert, Asset, Portfolio, UserSettings } from '../types';

const API_URL = 'https://localhost:55008/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle authentication errors
    if (response && response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Portfolio endpoints
export const portfolioApi = {
  getAll: () => apiClient.get('/portfolios'),
  get: (id: string) => apiClient.get(`/portfolios/${id}`),
  create: (data: { name: string }) => apiClient.post('/portfolios', data),
  delete: (id: string) => apiClient.delete(`/portfolios/${id}`),
  addAsset: (portfolioId: string, asset: Asset) => 
    apiClient.post(`/portfolios/${portfolioId}/assets`, asset),
  removeAsset: (portfolioId: string, assetId: string) => 
    apiClient.delete(`/portfolios/${portfolioId}/assets/${assetId}`),
};

// Alert endpoints
export const alertApi = {
  getActive: (portfolioId: string) => apiClient.get(`/alerts/${portfolioId}/active`),
  getAllActive: () => apiClient.get(`/alerts/active`),
  create: (alert: Alert) => apiClient.post('/alerts', alert),
  delete: (portfolioId: string, id: string) => apiClient.delete(`/alerts/${portfolioId}/${id}`),
  evaluate: () => apiClient.post('/alerts/evaluate'),
};

// Analysis endpoints
export const analysisApi = {
  getPortfolioAllocation: (portfolioId: string) => 
    apiClient.get(`/analysis/portfolio/${portfolioId}/allocation`),
};

// Auth endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    apiClient.post('/auth/login', credentials),
  register: (userData: { email: string; password: string; name: string }) => 
    apiClient.post('/auth/register', userData),
  getUser: () => apiClient.get('/auth/me'),
};

// Settings endpoints
export const settingsApi = {
    getPreferences: () => apiClient.get(`/UserSettings`),
    updatePreferences: (preferences: UserSettings) => apiClient.put('/UserSettings/preferences', preferences),
};
