import axios from '../api/axiosInstance';

export const verifyUserExists = async () => {
  try {
    const token = localStorage.getItem('matestay_token');
    if (!token) return false;

    await axios.get('/user/profile');
    return true;
  } catch (error) {
    // User doesn't exist or token is invalid
    localStorage.removeItem('matestay_token');
    localStorage.removeItem('matestay_user');
    return false;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('matestay_token');
  localStorage.removeItem('matestay_user');
  window.location.href = '/';
};