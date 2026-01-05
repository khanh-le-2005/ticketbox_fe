import axiosClient from "./axiosClient";

// ==========================================
// 1. INTERFACES & TYPES
// ==========================================

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

// HOTEL BOOKING TYPES (Cập nhật theo JSON của bạn)
export interface CreateHotelBookingRequest {
  hotelId: string;
  roomTypeCode: string;
  checkInDate: string; // "YYYY-MM-DD"
  checkOutDate: string; // "YYYY-MM-DD"
  quantity: number;     // <--- THÊM: Số lượng phòng
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  otp: string;
  numberOfGuests: number;
  // Bỏ numberOfGuests nếu JSON bạn gửi không yêu cầu, hoặc để optional
}

// ==========================================
// 2. API FUNCTIONS
// ==========================================

const BookingApi = {
  // --- SHOW ---
  createBooking: async (request: any): Promise<ApiResponse<ShowPaymentResponse>> => {
    const cleanRequest = {
      ...request,
      requestId: request.requestId || crypto.randomUUID(),
      tickets: request.tickets.map((t: any) => ({ ...t, quantity: Number(t.quantity) })),
    };
    return axiosClient.post("/bookings", cleanRequest);
  },

  getBookingById: async (id: string): Promise<ApiResponse<BookingDetail>> => {
    return axiosClient.get(`/bookings/${id}`);
  },
  
  checkStatus: async (id: string) => {
    return axiosClient.get(`/bookings/${id}/status`);
  },

  getHistory: async (email: string): Promise<ApiResponse<any[]>> => {
    return axiosClient.get("/bookings/history", { params: { email } });
  },

  // --- HOTEL ---
  
  // Gửi OTP (Dùng chung)
  requestOtp: async (email: string) => {
      // Gọi endpoint gửi OTP
      return axiosClient.post('/verification/request-otp', null, { params: { email } });
  },
};

export default BookingApi;