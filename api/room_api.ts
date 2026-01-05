import axiosClient from "./axiosClient";
import { ApiResponse, RoomTypePayload, RoomTypeResponse } from "@/type";

// Interface request tạo booking
export interface CreateHotelBookingRequest {
  hotelId: string;
  roomTypeCode: string;
  checkInDate: string;
  checkOutDate: string;
  quantity: number;
  numberOfGuests: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  otp: string;
}

export interface HotelPaymentResponse {
  user_id: string; 
  payment_content: string;
  amount: number;
  qr_base64: string;
}

const roomApi = {
  // --- QUẢN LÝ PHÒNG (ADMIN) ---
  getRoomTypesByHotel: (hotelId: string) => {
    return axiosClient.get<ApiResponse<RoomTypeResponse[]>>(`/hotels/${hotelId}/room-types`);
  },

  createRoomType: (hotelId: string, data: RoomTypePayload) => {
    return axiosClient.post<ApiResponse<RoomTypeResponse>>(`/hotels/${hotelId}/room-types`, data);
  },

  deleteRoomType: (hotelId: string, roomCode: string) => {
    return axiosClient.delete<ApiResponse<any>>(`/hotels/${hotelId}/room-types/${roomCode}`);
  },

  // --- QUẢN LÝ PHÒNG VẬT LÝ ---
  getRoomInstancesByHotel: (hotelId: string) => {
    return axiosClient.get(`/hotels/${hotelId}/rooms`); // API lấy danh sách phòng cụ thể
  },

  createRoomInstance: (data: any) => {
    return axiosClient.post('/hotel-rooms', data);
  },

  // --- BOOKING FLOW ---
  requestOtp: (email: string) => {
    return axiosClient.post(`/verification/request-otp`, null, { params: { email } });
  },

  createBooking: (data: CreateHotelBookingRequest) => {
    return axiosClient.post<ApiResponse<HotelPaymentResponse>>("/hotel-bookings", data);
  },

  checkPaymentStatus: (bookingId: string) => {
    return axiosClient.get(`/hotel-bookings/${bookingId}/status`);
  }
};

export default roomApi;