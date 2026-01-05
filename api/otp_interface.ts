// ===============================
// API RESPONSE CHUẨN (DÙNG CHUNG)
// ===============================
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
}

// ===============================
// OTP REQUEST
// ===============================
export interface OtpSendRequest {
  email: string;
}

export interface OtpVerifyRequest {
  email: string;
  otp: string;
}

export interface OtpResendRequest {
  email: string;
}

// ===============================
// OTP RESPONSE
// ===============================

// Gửi OTP
export interface OtpSendResponse extends ApiResponse<{
  email: string;
  remainingTime: number; // giây
}> {}

// Xác thực OTP
export interface OtpVerifyResponse extends ApiResponse<{
  verified: boolean;
  token?: string; // có thể có JWT sau khi verify
}> {}

// Gửi lại OTP
export interface OtpResendResponse extends ApiResponse<{
  email: string;
  remainingTime: number;
}> {}

// ===============================
// CLIENT SIDE OTP STATE
// ===============================
export interface OtpInfo {
  email: string;
  remainingTime: number;
  attemptsLeft: number;
  expiresAt: Date;
  isVerified: boolean;
  isExpired: boolean;
}

// ===============================
// OTP STATUS
// ===============================
export interface OtpStatus {
  hasOtp: boolean;
  remainingTime: number;
  attemptsLeft: number;
  isLocked: boolean;
}

// ===============================
// OTP CONFIG
// ===============================
export interface OtpConfig {
  length: number;        // 6
  expiryMinutes: number; // 5
  maxAttempts: number;   // 5
  resendDelay: number;   // 30s
}

// ===============================
// ERROR FORMAT (OPTIONAL)
// ===============================
export interface OtpError {
  code: string;
  message: string;
  retryAfter?: number;
}

// ===============================
// SESSION (OPTIONAL - FRONTEND)
// ===============================
export interface OtpSession {
  sessionId: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
  verifiedAt?: Date;
  attempts: number;
  status: "pending" | "verified" | "expired" | "locked";
}
