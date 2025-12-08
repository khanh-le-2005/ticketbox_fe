
import React from 'react';

export interface User {
  email: string;
  lastLogin?: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface TicketTier {
    name: string;
    price: string;
    type: string;
    description?: string;
}

export interface Event {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  date?: {
    month: string;
    day: number;
    year: number;
  };
  views?: number;
  location?: string;
  price?: string;
  time?: string;
  fullLocation?: string;
  lineup?: string[];
  ticketTiers?: TicketTier[];
  seatingChartUrl?: string;
}

export interface Hotel {
    id: number;
    name: string;
    location: string;
    rating: number;
    pricePerNight: number;
    imageUrl: string;
    description?: string;
    amenities?: string[];
    images?: string[];
    availableRooms: number;
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
  ticketTiers: TicketTier[];
  eventName: string;
}

export interface ContactInfo {
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