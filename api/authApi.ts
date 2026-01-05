// src/api/authApi.ts

import axiosClient from "./axiosClient";
import { 
  LoginRequestDTO, 
  RegisterRequestDTO, 
  ChangePasswordRequestDTO,
  AuthResponseDTO,
  UserProfileDTO 
} from "../api/authInterfaces";
import axios, { AxiosResponse } from "axios";

export const authApi = {
  // ==============================
  // 1. ĐĂNG NHẬP
  // ==============================

  /**
   * Đăng nhập cho USER
   */
  login: (data: LoginRequestDTO): Promise<AxiosResponse<AuthResponseDTO>> => {
    return axiosClient.post('/auth/login', {
        // --- SỬA QUAN TRỌNG TẠI ĐÂY ---
        // Backend yêu cầu key là 'email', ta gán dữ liệu nhập vào key này
        email: data.identifier, 
        password: data.password
    });
  },

  /**
   * Đăng nhập cho ADMIN
   */
  adminLogin: (data: LoginRequestDTO): Promise<AxiosResponse<AuthResponseDTO>> => {
    return axiosClient.post('/auth/admin-login', {
        // Tương tự cho admin, thường backend cũng chuẩn hóa tên trường giống nhau
        email: data.identifier, 
        password: data.password
    });
  },

  /**
   * Đăng nhập cho NHÂN VIÊN VẬN HÀNH
   */
  operatorLogin: (data: LoginRequestDTO): Promise<AxiosResponse<AuthResponseDTO>> => {
    return axiosClient.post('/auth/operator-login', {
        email: data.identifier,
        password: data.password
    });
  },

  // ... (Các hàm register, profile, changePassword giữ nguyên như cũ)
  register: (data: RegisterRequestDTO): Promise<AxiosResponse<any>> => {
    return axiosClient.post('/auth/register', data);
  },

  getProfile: (): Promise<AxiosResponse<UserProfileDTO>> => {
    return axiosClient.get('/user/profile');
  },

  changePassword: (data: ChangePasswordRequestDTO): Promise<AxiosResponse<any>> => {
    return axiosClient.post('/user/change-password', data);
  }
};
export const registerAuthAccount = (userData: any) => {
    return axios.post('https://api.momangshow.vn/api/auth/register', userData);
};

// Hàm 2: Lưu hồ sơ khách hàng (Gọi về Server Backend của bạn - để Admin thấy)
// Dữ liệu này sẽ được Admin lấy ra xem
export const createCustomerProfile = (profileData: any) => {
    // Gọi: https://api.momangshow.vn/api/customers
    // Lưu ý: Mình đã sửa lỗi 2 dấu gạch chéo "//" trong link bạn gửi thành 1 dấu "/"
    return axios.post(`https://api.momangshow.vn/api/customers`, profileData); 
};

export default authApi;