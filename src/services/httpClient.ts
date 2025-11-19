
import axios from "axios";
import { tokenManager } from "../utils/tokenManager";

const VITE_API_URL = (import.meta as any).env.VITE_API_URL;

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

const httpClient = axios.create({
    baseURL: VITE_API_URL,
    withCredentials: true,
})

httpClient.interceptors.request.use(
    (config) => {
        const token = tokenManager.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

httpClient.interceptors.request.use(
    (config) => {
        if (config.data instanceof FormData) {
            config.headers["content-type"] = "multipart/form-data";
        } else {
            config.headers["content-type"] = "application/json";
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

httpClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/refresh-token")
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return httpClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await httpClient.get("auth/refresh-token", {});

                const newToken = data.data.accessToken;
                tokenManager.setToken(newToken);
                isRefreshing = false;
                processQueue(null, newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return httpClient(originalRequest);

            } catch (refreshError) {
                isRefreshing = false;
                tokenManager.removeToken();
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default httpClient;
