import axios from "axios";
import type { AxiosInstance } from "axios";
import { getToken } from "../utils/storage";

const BASE_URL = 'http://localhost:8000/api/';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Multipart instance — for requests with files
export const apiMultipart = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accept':       'application/json',
    },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
        //navigate back to login?
    }
    return Promise.reject(error);
  }
);

// attach token interceptor to both
const attachToken = (instance: typeof apiClient) => {
    instance.interceptors.request.use((config) => {
        const token = getToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.clear();
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
};

attachToken(apiClient);
attachToken(apiMultipart);

// export default apiClient;