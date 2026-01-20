import axiosClient from "./axiosClient";
import { TicketItem } from "../type/Tickets.type";
import { ApiResponse, ShowPaymentResponse, BookingDetail, CreateShowBookingRequest } from "../type/booking.type";
const BookingApi = {
  createBooking: async (request: CreateShowBookingRequest): Promise<ApiResponse<ShowPaymentResponse>> => {
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