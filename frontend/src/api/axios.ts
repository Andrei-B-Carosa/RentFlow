import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { getToken } from '../utils/storage'

const BASE_URL = 'http://localhost:8000/api/'

export const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
    },
})

export const apiMultipart: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accept':       'application/json',
    },
})

// attach token + 401 handler to any instance
const attachInterceptors = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        (config) => {
            const token = getToken()
            if (token) config.headers.Authorization = `Bearer ${token}`
            return config
        },
        (error) => Promise.reject(error)
    )

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.clear()
                window.location.href = '/login'
            }
            return Promise.reject(error)
        }
    )
}

// attach to both instances — only once each
attachInterceptors(apiClient)
attachInterceptors(apiMultipart)