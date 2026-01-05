import axiosClient from "./axiosClient";
import {
  OtpSendResponse,
  OtpVerifyResponse,
  OtpResendResponse,
  OtpError,
} from "../api/otp_interface";

class OtpApi {
  /**
   * Gửi OTP về email
   * POST /otp/send
   */
  async sendOtp(email: string): Promise<OtpSendResponse> {
    try {
      const response = await axiosClient.post<OtpSendResponse>(
        "/otp/send",
        { email }
      );

      // ✅ BẮT BUỘC trả về response.data
      return response.data;

    } catch (error: any) {
      throw this.handleError(error);
    }
  }


  /**
   * Xác thực OTP
   * POST /otp/verify
   */
  async verify(
    email: string,
    otp: string
  ): Promise<OtpVerifyResponse> {
    if (!email || !otp) {
      throw {
        code: "INVALID_INPUT",
        message: "Email và OTP là bắt buộc",
      } as OtpError;
    }

    try {
      const response = await axiosClient.post<OtpVerifyResponse>(
        "/otp/verify",
        {
          email,
          otpCode: otp, // ⚠️ QUAN TRỌNG: backend thường dùng otpCode
        }
      );

      // ✅ CHỈ TRẢ VỀ DATA
      return response.data;

    } catch (error: any) {
      throw this.handleError(error);
    }
  }
  /**
   * Gửi lại OTP
   * POST /otp/resend
   */
  async resend(email: string): Promise<OtpResendResponse> {
    if (!email) {
      throw {
        code: "INVALID_EMAIL",
        message: "Email không được để trống",
      } as OtpError;
    }

    try {
      const response = await axiosClient.post<OtpResendResponse>(
        "/otp/resend",
        { email }
      );

      // ✅ CHỈ TRẢ VỀ DATA
      return response.data;

    } catch (error: any) {
      throw this.handleError(error);
    }
  }
  /*
   * Chuẩn hoá lỗi từ backend
   */
  private handleError(error: any): OtpError {
    return {
      code:
        error.response?.data?.code ||
        error.code ||
        "UNKNOWN_ERROR",
      message:
        error.response?.data?.message ||
        error.message ||
        "Đã xảy ra lỗi, vui lòng thử lại",
    };
  }
}
export const otpApi = new OtpApi();
export default otpApi;
