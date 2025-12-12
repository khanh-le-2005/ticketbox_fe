import axios from 'axios';

const axiosClient = axios.create({
    // Nếu bạn đang test Local thì để localhost
    // Nếu muốn kết nối server thật thì đổi thành: "https://api.momangshow.vn/api"
    baseURL: 'https://api.momangshow.vn/api', 
    
    // XÓA BỎ headers Content-Type mặc định
    // Axios đủ thông minh để tự động thêm 'application/json' khi bạn gửi object
    // và thêm 'multipart/form-data' khi bạn gửi file.
    timeout: 10000, 
});

// Thêm Interceptor để tự động gắn Token (nếu cần)
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosClient;