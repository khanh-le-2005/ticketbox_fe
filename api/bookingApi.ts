// import axiosClient from "./axiosClient";
// import { TicketItem } from "../type/Tickets.type";
// import { ApiResponse, ShowPaymentResponse, BookingDetail, CreateShowBookingRequest } from "../type/booking.type";

// // Zalo ZNS template params (vd: order_code) thường có giới hạn độ dài khá ngắn.
// // Tránh dùng UUID (36 chars) làm requestId/orderCode để không bị lỗi "breaks max length".
// const generateShortRequestId = () => {
//   const timestamp = Date.now().toString().slice(-6); // 6 số cuối timestamp
//   const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0"); // 3 số ngẫu nhiên
//   return `MM${timestamp}${random}`; // ~11 ký tự
// };

// const BookingApi = {
//   createBooking: async (request: CreateShowBookingRequest): Promise<ApiResponse<ShowPaymentResponse>> => {
//     const safeRequestId =
//       request.requestId && request.requestId.length <= 20
//         ? request.requestId
//         : request.requestId
//           ? request.requestId.slice(-20) // fallback: cắt ngắn nếu bị truyền vào quá dài
//           : generateShortRequestId();

//     const cleanRequest = {
//       ...request,
//       requestId: safeRequestId,
//       tickets: request.tickets.map((t: any) => ({ ...t, quantity: Number(t.quantity) })),
//     };
//     return axiosClient.post("/bookings", cleanRequest);
//   },

//   getBookingById: async (id: string): Promise<ApiResponse<BookingDetail>> => {
//     return axiosClient.get(`/bookings/${id}`);
//   },

//   checkStatus: async (id: string) => {
//     return axiosClient.get(`/bookings/${id}/status`);
//   },

//   getHistory: async (): Promise<ApiResponse<{ content: TicketItem[] }>> => {
//     return axiosClient.get("/bookings/my-history");
//   },

//   requestOtp: async (target: string, channel: 'EMAIL' | 'ZALO' = 'EMAIL', type: string = 'SHOW') => {
//     return axiosClient.post('/verification/request-otp', null, { params: { target, channel, type } });
//   },

//   requestOtpZalo: async (phone: string, type: string = 'SHOW') => {
//     return axiosClient.post('/verification/request-otp', null, { params: { target: phone, channel: 'ZALO', type } });
//   },
// };

// export default BookingApi;


import axiosClient from "./axiosClient";
import { TicketItem } from "../type/Tickets.type";
import { ApiResponse, ShowPaymentResponse, BookingDetail, CreateShowBookingRequest } from "../type/booking.type";

const BookingApi = {
  createBooking: async (request: CreateShowBookingRequest): Promise<ApiResponse<ShowPaymentResponse>> => {

    const cleanRequest = {
      ...request,
      tickets: request.tickets.map((t: any) => ({ ...t, quantity: Number(t.quantity) })),
    };
    
    return axiosClient.post("/bookings", cleanRequest);
  },

  getBookingById: async (id: string): Promise<ApiResponse<BookingDetail>> => {
    return axiosClient.get(`/bookings/${id}`);
  },

// Trong bookingApi.ts
checkStatus: async (id: string) => {
  return axiosClient.get(`/bookings/${id}/status`);
},

  getHistory: async (): Promise<ApiResponse<{ content: TicketItem[] }>> => {
    return axiosClient.get("/bookings/my-history");
  },

  requestOtp: async (target: string, channel: 'EMAIL' | 'ZALO' = 'EMAIL', type: string = 'SHOW') => {
    return axiosClient.post('/verification/request-otp', null, { params: { target, channel, type } });
  },

  requestOtpZalo: async (phone: string, type: string = 'SHOW') => {
    return axiosClient.post('/verification/request-otp', null, { params: { target: phone, channel: 'ZALO', type } });
  },
};

export default BookingApi;