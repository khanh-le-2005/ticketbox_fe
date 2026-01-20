
export interface TicketItem {
  id: string; // Booking ID gốc
  showName: string;
  showTime: string;
  address: string;
  totalAmount: number;
  status: string;
  bookingDate: string;
}

export interface TicketSelection {
  [tierName: string]: number;
}
export interface TicketTier {
  name: string;      // Mã vé (VIP, STD...)
  displayName?: string; // Tên hiển thị (Vé VIP...) - Nếu bạn có thêm trường này
  price: number;
  available: number;
}

export interface TicketSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selection: TicketSelection, total: number) => void;
  ticketTiers: TicketTier[];
  eventName: string;
}


export type TicketStatus = 'ACTIVE' | 'USED' | 'CANCELLED';
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

export interface TicketCheckInResponse {
  valid: boolean;
  message: string;
  ticketCode: string;
  ticketType: string;
  customerName: string;
  checkInTime: string;
}

export interface TicketApiResponse<T> {
  data: T;
  message: string;
  status: number;
}
