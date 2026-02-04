export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Show Booking Types
export interface CreateShowBookingRequest {
  requestId: string;
  showId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  otp: string;
  tickets: {
    ticketTypeCode: string;
    quantity: number;
  }[];
  channel?: string;
  notificationChannel?: string;
}

export interface ShowPaymentResponse {
  user_id: string;
  payment_content: string;
  amount: number;
  qr_base64: string;
  transaction_id: string | null;
}

export interface BookingDetail {
  id: string;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED';
}