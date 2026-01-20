export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Show Booking Types
export interface CreateShowBookingRequest {
  showId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  otp: string;
  requestId?: string;
  tickets: {
    ticketTypeCode: string;
    quantity: number;
  }[];
  channel?: string;
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