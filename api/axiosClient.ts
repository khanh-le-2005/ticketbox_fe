import axios from 'axios';

const axiosClient = axios.create({
    // Trỏ đúng về cổng Backend Java của bạn (thường là 8080)
    baseURL: 'http://localhost:8080/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;