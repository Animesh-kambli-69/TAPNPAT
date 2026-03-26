import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for development/testing
const mockData = {
  '/driver/dashboard': {
    todayEarnings: 1250.50,
    todayRides: 8,
    weekEarnings: 8750.00,
    weekRides: 52,
    monthEarnings: 35000.00,
    monthRides: 220,
    averageRating: 4.8,
    completedRides: 220,
    chartData: [
      { date: 'Mon', earnings: 1100 },
      { date: 'Tue', earnings: 1250 },
      { date: 'Wed', earnings: 980 },
      { date: 'Thu', earnings: 1450 },
      { date: 'Fri', earnings: 1600 },
      { date: 'Sat', earnings: 1800 },
      { date: 'Sun', earnings: 1200 },
    ],
  },
  '/driver/rides': [
    { id: 1, passengerId: 'p1', startLocation: 'Station', endLocation: 'Mall', fare: 150, status: 'completed', time: '10:30 AM' },
    { id: 2, passengerId: 'p2', startLocation: 'Airport', endLocation: 'Hotel', fare: 280, status: 'completed', time: '2:15 PM' },
  ],
  '/driver/earnings': {
    period: 'month',
    total: 35000,
    data: [
      { date: '2024-03-01', earnings: 1200 },
      { date: '2024-03-02', earnings: 1350 },
      { date: '2024-03-03', earnings: 1100 },
    ],
  },
  '/customer/wallet': {
    balance: 5000.50,
    currency: '₹',
    lastUpdated: new Date().toISOString(),
    recentTransactions: [
      { id: 1, amount: 150, type: 'payment', merchant: 'Auto Ride', date: new Date().toISOString() },
    ],
  },
  '/customer/transactions': [
    { id: 1, amount: 150, type: 'payment', merchant: 'Auto Ride', date: new Date().toISOString(), status: 'completed' },
    { id: 2, amount: 500, type: 'topup', description: 'Wallet Top-up', date: new Date().toISOString(), status: 'completed' },
  ],
  '/admin/dashboard': {
    totalUsers: 5240,
    totalTransactions: 45680,
    totalRevenue: 850000,
    averageTransaction: 125,
    userDistribution: { drivers: 1200, customers: 3500, merchants: 540 },
  },
};

// Request interceptor to add token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and provide mock data fallback
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Fallback to mock data if backend is unavailable
    if (!error.response && error.config) {
      const endpoint = error.config.url;
      if (mockData[endpoint]) {
        console.warn(`Using mock data for ${endpoint}`);
        return Promise.resolve(mockData[endpoint]);
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default API;
