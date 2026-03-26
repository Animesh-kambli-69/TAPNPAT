import API from './api';

const mockUsers = {
  'driver@tapngo.com': { id: '1', name: 'John Driver', email: 'driver@tapngo.com', phone: '9876543210', role: 'driver' },
  'customer@tapngo.com': { id: '2', name: 'Raj Customer', email: 'customer@tapngo.com', phone: '9876543211', role: 'customer' },
  'admin@tapngo.com': { id: '3', name: 'Admin User', email: 'admin@tapngo.com', phone: '9876543212', role: 'admin' },
  'merchant@tapngo.com': { id: '4', name: 'Merchant User', email: 'merchant@tapngo.com', phone: '9876543213', role: 'merchant' },
};

export const authService = {
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (err) {
      // Mock register response
      const mockUser = { id: Date.now(), name: userData.name, email: userData.email, phone: userData.phone, role: userData.role || 'customer' };
      const mockToken = 'mock-token-' + Date.now();
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { token: mockToken, user: mockUser };
    }
  },

  login: async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (err) {
      // Mock login with demo credentials
      if (mockUsers[email] && password === 'password123') {
        const mockUser = mockUsers[email];
        const mockToken = 'mock-token-' + Date.now();
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { token: mockToken, user: mockUser };
      }
      throw new Error('Invalid email or password. Use demo credentials to test.');
    }
  },

  logout: async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      // Silent fail for mock logout
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    try {
      return API.get('/auth/profile');
    } catch (err) {
      const user = authService.getStoredUser();
      return user || {};
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await API.put('/auth/profile', userData);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (err) {
      const updatedUser = { ...authService.getStoredUser(), ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    }
  },

  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getStoredToken: () => {
    return localStorage.getItem('token');
  },

  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },
};
