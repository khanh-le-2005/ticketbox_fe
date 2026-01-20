import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'https://api.momangshow.vn/api';

const axiosClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000, // Tăng lên 30s cho thoải mái
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// --- 1. REQUEST INTERCEPTOR (Gửi Token) ---
axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('jwtToken');

        // Những API không cần Token (Public)
        const publicEndpoints = [
            '/auth/login',
            // '/auth/register', 
            '/shows',
            '/images',
            '/verification',
            '/hotels'
        ];

        // Check xem URL hiện tại có phải public không
        const isPublic = publicEndpoints.some(endpoint => config.url?.includes(endpoint));

        if (token && !isPublic) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// --- 2. RESPONSE INTERCEPTOR (Xử lý dữ liệu trả về) ---
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error: any) => {
        // Xử lý lỗi chung (401, 403, 500...)
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.warn('Hết hạn Token -> Logout');
            localStorage.removeItem('jwtToken');
            // window.location.href = '/login'; // Mở dòng này nếu muốn tự động đá về login
        }

        // Trả về lỗi để component hiển thị alert
        return Promise.reject(error);
    }
);

export default axiosClient;