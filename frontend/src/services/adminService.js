import API from './api';

export const adminService = {
  getDashboard: async () => {
    return API.get('/admin/dashboard');
  },

  getUsers: async (params = {}) => {
    return API.get('/admin/users', { params });
  },

  updateUserRole: async (userId, role) => {
    return API.put(`/admin/users/${userId}/role`, { role });
  },

  getTransactions: async (params = {}) => {
    return API.get('/admin/transactions', { params });
  },

  getAnalytics: async (period = 'month') => {
    return API.get('/admin/analytics', { params: { period } });
  },
};
