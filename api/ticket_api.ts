import axios from 'axios';

// --- 1. CẤU HÌNH API ---
const BASE_URL = 'https://api.momangshow.vn/api/'; 
// const API_URL = '/api/v1/tickets'; 

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- 2. INTERFACES (Cập nhật theo TicketService.java) ---

export type TicketStatus = 'ACTIVE' | 'USED' | 'CANCELLED';

// Model: Ticket (Dữ liệu thô từ DB)
export interface Ticket {
  id: string;
  ticketCode: string;
  bookingId: string;
  showId: string;
  customerId: string;
  ticketType: string;
  price: number;
  status: TicketStatus;
  checkInTime?: string;
}

// DTO: Response khi check-in thành công
// 👇 ĐÃ SỬA: Cấu trúc khớp với constructor trong TicketService.java
export interface TicketCheckInResponse {
  valid: boolean;       // true/false
  message: string;      // "Check-in thành công..."
  ticketCode: string;
  ticketType: string;   // VIP, GA...
  customerName: string; // Tên khách hàng (Lấy từ Booking)
  checkInTime: string;  // Thời gian check-in
}

// Wrapper: ApiResponse
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// --- 3. API FUNCTIONS ---

const TicketApi = {
  /**
   * Lấy chi tiết vé (Xem trước thông tin)
   * GET /api/v1/tickets/{ticketCode}
   */
  getTicketDetail: async (ticketCode: string): Promise<ApiResponse<Ticket>> => {
    const response = await axiosClient.get<ApiResponse<Ticket>>(`${BASE_URL}/${ticketCode}`);
    return response.data;
  },

  /**
   * Quét vé (Check-in)
   * POST /api/v1/tickets/scan?ticketCode=...
   */
  scanTicket: async (ticketCode: string): Promise<ApiResponse<TicketCheckInResponse>> => {
    // Backend dùng @RequestParam nên gửi params
    const response = await axiosClient.post<ApiResponse<TicketCheckInResponse>>(
      `${BASE_URL}/scan`, 
      null, 
      {
        params: { ticketCode } 
      }
    );
    return response.data;
  }
};

export default TicketApi;