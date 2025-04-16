import axios from 'axios';
import { useStore } from '../store/store';

interface RefreshError {
  response?: {
    status: number;
  };
}

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currentToken = useStore.getState().refreshToken;
        if (!currentToken) {
          throw new Error('No token available');
        }
        const response = await axios.post(`${apiUrl}/auth/refresh-token`, {
            refreshToken: currentToken
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.data?.data?.token) {
          throw new Error('No token in refresh response');
        }

        const newToken = response.data.data.token;
        
        useStore.getState().setToken(newToken);
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if ((refreshError as RefreshError)?.response?.status === 401) {
          useStore.getState().logout();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
