import { format, formatDistance } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM dd, yyyy hh:mm a');
};

export const formatDistanceToNow = (date) => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '+91-$1-$2-$3');
};

export const formatPercentage = (value) => {
  return `${(value * 100).toFixed(2)}%`;
};

export const truncateText = (text, length = 50) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};
