import React from "react"; 

export interface OtpVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (otpCode: string) => void;
    contactInfo: ContactInfo;
}

export interface ContactInfo {
    email: string;
    phone: string;
}

export interface PaymentStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: any;
  onPaymentSuccess: () => void;
}
export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; 
}




export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
}

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
export interface OtpSendResponse extends ApiResponse<{
  email: string;
  remainingTime: number; 
}> {}

export interface OtpVerifyResponse extends ApiResponse<{
  verified: boolean;
  token?: string; 
}> {}


export interface OtpResendResponse extends ApiResponse<{
  email: string;
  remainingTime: number;
}> {}

export interface OtpInfo {
  email: string;
  remainingTime: number;
  attemptsLeft: number;
  expiresAt: Date;
  isVerified: boolean;
  isExpired: boolean;
}


export interface OtpStatus {
  hasOtp: boolean;
  remainingTime: number;
  attemptsLeft: number;
  isLocked: boolean;
}

export interface OtpConfig {
  length: number;       
  expiryMinutes: number; 
  maxAttempts: number;   
  resendDelay: number;   
}

export interface OtpError {
  code: string;
  message: string;
  retryAfter?: number;
}

export interface OtpSession {
  sessionId: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
  verifiedAt?: Date;
  attempts: number;
  status: "pending" | "verified" | "expired" | "locked";
}
