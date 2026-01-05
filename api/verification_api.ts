import axiosClient from './axiosClient';

export interface ApiResponse<T> { success: boolean; message: string; data: T; }

const VerificationApi = {
  // Gửi OTP
  requestOtp: async (email: string): Promise<ApiResponse<any>> => {
    return axiosClient.post('/verification/request-otp', null, {
        params: { email }
    });
  },

  // Xác thực OTP (Nếu cần dùng riêng)
  verifyOtp: async (data: { email: string; otpCode: string }): Promise<ApiResponse<any>> => {
    return axiosClient.post('/verification/verify-otp', data);
  }
};

export default VerificationApi;