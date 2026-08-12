import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('auth');

  if (authData) {
    try {
      const parsed = JSON.parse(authData);

      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (error) {
      console.error('Failed to read authentication data', error);
    }
  }

  return config;
});

export default api;