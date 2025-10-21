
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, 
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
}, (err) => Promise.reject(err));

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message || '';
    const isExpired = status === 401 && /expired/i.test(msg);
    if (isExpired) {
      try {
        localStorage.removeItem('token');
      } catch {}
     
      try {
        window.dispatchEvent(new CustomEvent('auth:expired', { detail: { message: msg || 'Session expired' } }));
      } catch {}
    }
    return Promise.reject(error);
  }
);

export default axiosClient;