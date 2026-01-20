// types.ts
export interface RoomTypePayload {
  name: string;
  pricePerNight: number;
  totalRooms: number;
  capacity: number;
}

export interface RoomTypeResponse extends RoomTypePayload {
  code: string; // ID của phòng trả về từ BE
}

// Giả sử API trả về data bọc trong object chuẩn như hình bạn gửi
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ... Các interface cũ (Hotel, RoomType...) giữ nguyên

// Response cho Cách 1: Check Realtime
export interface AvailabilityResponse {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  remainingRooms: number;
  isAvailable: boolean;
}

// Item cho Cách 2: Calendar View
export interface CalendarDayItem {
  date: string;       // YYYY-MM-DD
  availableRooms: number;
  price: number;
}

export interface CalendarResponse {
  data: CalendarDayItem[];
}

export interface CreateHotelBookingRequest {
  hotelId: string;
  roomTypeCode: string;
  checkInDate: string;
  checkOutDate: string;
  quantity: number;
  numberOfGuests: number;
  customerName: string;
  customerEmail: string | null;  // ⚠️ Update: Nullable
  customerPhone: string;
  otp: string;
  notificationChannel?: "EMAIL" | "ZALO"; // ⚠️ Update: New field
}

export interface HotelPaymentResponse {
  user_id: string;
  payment_content: string;
  amount: number;
  qr_base64: string;
}