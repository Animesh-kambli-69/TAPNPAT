import API from './api';

export const driverService = {
  getDashboard: async () => {
    return API.get('/driver/dashboard');
  },

  getRides: async (params = {}) => {
    return API.get('/driver/rides', { params });
  },

  getEarnings: async (period = 'month') => {
    return API.get('/driver/earnings', { params: { period } });
  },

  getAnalytics: async (period = 'month') => {
    return API.get(`/driver/analytics/${period}`);
  },

  getTransactions: async (params = {}) => {
    return API.get('/driver/transactions', { params });
  },
};
