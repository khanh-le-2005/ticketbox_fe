import axiosClient from "./axiosClient";
import {
  OtpSendResponse,
  OtpVerifyResponse,
  OtpResendResponse,
  OtpError,
} from "../type/Otpvspay.type";

class OtpApi {
  async sendOtp(email: string): Promise<OtpSendResponse> {
    try {
      const response = await axiosClient.post<OtpSendResponse>(
        "/otp/send",
        { email }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
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
          otpCode: otp, 
        }
      );
      return response.data;

    } catch (error: any) {
      throw this.handleError(error);
    }
  }
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
      return response.data;

    } catch (error: any) {
      throw this.handleError(error);
    }
  }
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
