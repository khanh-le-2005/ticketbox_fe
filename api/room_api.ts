import axiosClient from "./axiosClient";
import { ApiResponse, RoomTypePayload, RoomTypeResponse } from "@/type";
import { CreateHotelBookingRequest, HotelPaymentResponse } from "@/type/room.types";


const roomApi = {
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
  requestOtp: (target: string, channel: 'EMAIL' | 'ZALO' = 'EMAIL', type: string = 'SHOW') => {
    return axiosClient.post(`/verification/request-otp`, null, { params: { target, channel, type } });
  },

  requestOtpZalo: (phone: string, type: string = 'SHOW') => {
    return axiosClient.post(`/verification/request-otp`, null, { params: { target: phone, channel: 'ZALO', type } });
  },

  createBooking: (data: CreateHotelBookingRequest) => {
    return axiosClient.post<ApiResponse<HotelPaymentResponse>>("/hotel-bookings", data);
  },

  checkPaymentStatus: (bookingId: string) => {
    return axiosClient.get(`/hotel-bookings/${bookingId}/status`);
  }
};

export default roomApi;