
import axios from 'axios';

const API_URL = 'http://localhost:55007/api';

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
  addAsset: (portfolioId: string, asset: any) => 
    apiClient.post(`/portfolios/${portfolioId}/assets`, asset),
  removeAsset: (portfolioId: string, assetId: string) => 
    apiClient.delete(`/portfolios/${portfolioId}/assets/${assetId}`),
};

// Alert endpoints
export const alertApi = {
  getActive: (portfolioId: string) => apiClient.get(`/alerts/${portfolioId}/active`),
  create: (alert: any) => apiClient.post('/alerts', alert),
  delete: (id: string) => apiClient.delete(`/alerts/${id}`),
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
  updatePreferences: (preferences: any) => apiClient.post('/settings/preferences', preferences),
};
