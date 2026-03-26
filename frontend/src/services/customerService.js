import API from './api';

export const customerService = {
  getWallet: async () => {
    return API.get('/customer/wallet');
  },

  topupWallet: async (amount) => {
    return API.post('/customer/topup', { amount });
  },

  getTransactions: async (params = {}) => {
    return API.get('/customer/transactions', { params });
  },

  getRideHistory: async (params = {}) => {
    return API.get('/customer/rides', { params });
  },

  getAnalytics: async (period = 'month') => {
    return API.get('/customer/analytics', { params: { period } });
  },
};
