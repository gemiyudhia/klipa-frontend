import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: '/api/proxy',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export default apiClient;
