export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  return phone.length === 10 && /^[0-9]{10}$/.test(phone);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateAmount = (amount) => {
  return !isNaN(amount) && parseFloat(amount) > 0;
};
