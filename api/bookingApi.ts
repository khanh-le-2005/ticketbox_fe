// src/api/bookingApi.ts

import axiosClient from "./axiosClient";

// Định nghĩa kiểu dữ liệu gửi đi (Payload)
export interface TicketOrderRequest {
  ticketTypeName: string; // Tên loại vé (Backend sẽ map sang ID)
  quantity: number;       // Số lượng
}

export interface BookingRequestDTO {
  showId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  ticketOrders: TicketOrderRequest[];
}

export const BookingAPI = {
  /**
   * Tạo đơn đặt vé mới
   * POST /api/bookings
   */
  createBooking: (data: BookingRequestDTO) => {
    return axiosClient.post("/bookings", data);
  },

  /**
   * Lấy danh sách vé đã đặt của người dùng đang đăng nhập
   * GET /api/bookings/my-history
   */
  getMyHistory: () => {
    return axiosClient.get("/bookings/my-history");
  },

  /**
   * Xem chi tiết đơn hàng theo mã (Dành cho trang tra cứu)
   * GET /api/bookings/{code}
   */
  getBookingByCode: (code: string) => {
    return axiosClient.get(`/bookings/${code}`);
  }
};

export default BookingAPI;