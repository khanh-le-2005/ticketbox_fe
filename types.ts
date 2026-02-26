
import React from 'react';

// --- AUTHENTICATION ---
export interface User {
  email: string;
  lastLogin: number;
  role: "ADMIN" | "VANHANH";
}
export interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// --- EVENT & SHOW (Đã gộp và chuẩn hóa) ---
export interface TicketType {
  name: string;
  price: number;
  totalQuantity: number;
  soldQuantity?: number;
  description?: string; // Thêm description nếu cần
}

export interface EventAddress {
  specificAddress: string;
  ward: string;
  district: string;
  province: string;
  fullAddress?: string;
}

export interface Event {
  id: string; // Dùng string cho đồng bộ với showId trong bookingApi
  name: string;
  description: string;
  startTime: string;
  address: EventAddress | string;
  images: any[];
  ticketTypes: TicketType[];
  active: boolean;
  image?: string;    // Dùng cho hiển thị Thumbnail
  location?: string; // Dùng cho hiển thị rút gọn
  price?: number;    // Giá thấp nhất để hiển thị
  slug?: string;     // URL Slug
}

// --- BOOKING LOGIC ---
// export interface TicketSelection {
//   [tierName: string]: number; // Ví dụ: { "VIP": 2, "Standard": 1 }
// }

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface TicketItem {
  code: string;
  tierName: string;
}

export interface EventBookingDetails {
  bookingId: string;
  event: Event;
  ticketSelection: TicketSelection;
  tickets: TicketItem[];
  totalPrice: number;
  contactInfo: ContactInfo;
  timestamp?: string;
}

// --- COMPONENT PROPS (Giữ nguyên các UI props bạn đã viết) ---
export interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contactInfo: ContactInfo | null;
}

export interface QrVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isConfirming: boolean;
  qrCodeData: string; // Chứa thông tin chuyển khoản MB Bank
}

// ... Các interface Hotel và Receipt khác bạn giữ nguyên bên dưới ...

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerNight: number;
  imageUrl: string;
  description?: string;
  amenities?: string[];
  images?: string[];
  availableRooms: number;
  address: string;
  slug?: string;
}

export interface EventSectionProps {
  title: string;
  events: Event[];
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface HotelCardProps {
  hotel: Hotel;
  onBookNow: (hotel: Hotel) => void;
}

export interface BookingModalProps {
  hotel: Hotel | null;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  isOpen: boolean;
  isBooking: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface BookingSuccessToastProps {
  message: string;
  isVisible: boolean;
}

export interface BookingDetails {
  bookingId: string;
  hotel: Hotel;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  nights: number;
  totalPrice: number;
}

export interface BookingReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: BookingDetails | null;
}

export interface TicketSelection {
  [tierName: string]: number;
}

export interface TicketSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selection: TicketSelection, totalPrice: number) => void;
  //   ticketTiers: TicketTier[];
  eventName: string;
}

export interface ContactInfo {
  name?: string;
  phone: string;
  email: string;
}

export interface ContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (contactInfo: ContactInfo) => void;
}

export interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contactInfo: ContactInfo | null;
}

export interface QrVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isConfirming: boolean;
  qrCodeData: string;
}

export interface TicketItem {
  code: string;
  tierName: string;
}

export interface EventBookingDetails {
  bookingId: string;
  event: Event;
  ticketSelection: TicketSelection;
  tickets: TicketItem[]; // Array of individual tickets with unique codes
  totalPrice: number;
  contactInfo: ContactInfo;
  // Thời điểm đặt (ISO string) — optional
  timestamp?: string;
}

export interface EventReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: EventBookingDetails | null;
}

// Interface cho Địa chỉ (Backend trả về Object)
export interface EventAddress {
  specificAddress: string;
  ward: string;
  district: string;
  province: string;
  fullAddress?: string;
}

// Interface cho Loại vé
export interface TicketType {
  name: string;
  price: number;
  totalQuantity: number;
  soldQuantity?: number;
}

// Interface chính cho Sự kiện (Show)
export interface Event {
  id: string;
  name: string;          // Tên show
  description: string;
  startTime: string;     // Backend trả về ISO string
  address: EventAddress | string; // Có thể là object hoặc string tùy lúc tạo
  images: any[];         // Danh sách ảnh
  ticketTypes: TicketType[];
  active: boolean;
  // Các trường Frontend cũ có thể cần map lại
  category?: string;
  image?: string;        // Ảnh đại diện (Frontend dùng cái này)
  location?: string;     // Địa chỉ hiển thị (Frontend dùng cái này)
  date?: string;         // Ngày hiển thị
  price?: number;        // Giá thấp nhất để hiển thị "Từ..."
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  DIRTY = 'DIRTY',
  MAINTENANCE = 'MAINTENANCE',
  RESERVED = 'RESERVED'
}

// Payload đặt phòng
export interface BookingRequestPayload {
  hotelId: string;
  roomTypeCode: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  quantity: number;
  numberOfGuests: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  otp: string;
}

// Thông tin Booking trả về (để Admin quản lý)
export interface BookingResponse {
  id: string;
  customerName: string;
  roomNumber?: string; // Có thể null nếu chưa gán phòng
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  checkInDate: string;
  checkOutDate: string;
}

// Thông tin Phòng (cho Admin Grid view)
export interface RoomData {
  id: string;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  roomTypeCode: string;
}