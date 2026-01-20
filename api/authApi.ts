// src/api/authApi.ts

import axiosClient from "./axiosClient";
import {
  LoginRequestDTO,
  RegisterRequestDTO,
  ChangePasswordRequestDTO,
  AuthResponseDTO,
  UserProfileDTO
} from "../type/authInterfaces.type";
import axios, { AxiosResponse } from "axios";

export const authApi = {
  login: (data: LoginRequestDTO): Promise<AxiosResponse<AuthResponseDTO>> => {
    return axiosClient.post('/auth/login', {
      email: data.identifier,
      password: data.password
    });
  },
  adminLogin: (data: LoginRequestDTO): Promise<AxiosResponse<AuthResponseDTO>> => {
    return axiosClient.post('/auth/admin-login', {
      email: data.identifier,
      password: data.password
    });
  },
  operatorLogin: (data: LoginRequestDTO): Promise<AxiosResponse<AuthResponseDTO>> => {
    return axiosClient.post('/auth/operator-login', {
      email: data.identifier,
      password: data.password
    });
  },
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
export const createCustomerProfile = (profileData: any) => {
  return axios.post(`https://api.momangshow.vn/api/customers`, profileData);
};

export default authApi;