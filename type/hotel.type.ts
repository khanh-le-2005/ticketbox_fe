export type { Hotel } from "../types";
import { Hotel } from "../types";

export interface RoomType {
  code: string;
  name: string;
  totalRooms: number;
  standardCapacity: number;
  maxCapacity: number;
  pricePerNight?: number;
  priceWeekday?: number;
  priceMonToThu?: number;
  priceFriday?: number;
  priceSaturday?: number;
  priceSunday?: number;
  surchargeSunToThu?: number;
  surchargeFriSat?: number;
}

export interface ApiHotelResponse {
  id: string;
  name: string;
  address: string;
  description: string;
  galleryImageIds: number[];
  minPrice: number;
  roomTypes?: RoomType[];
}

export interface CreateHotelRequest {
  name: string;
  address: string;
  description: string;
  roomTypes?: RoomType[];
}

export interface UpdateHotelRequest extends Partial<CreateHotelRequest> {
  id: string;
}


export enum HotelBookingStep {
  DATE_SELECTION,
  PAYMENT_QR,
  SUCCESS_RECEIPT
}

export interface RoomPriceConfig {
  priceMonToThu: number;
  priceFriday: number;
  priceSaturday: number;
  priceSunday: number;
  surchargeSunToThu: number;
  surchargeFriSat: number;
}

export interface HotelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  roomTypeCode: string;
  priceConfig: RoomPriceConfig;

  // 👇 THÊM 2 TRƯỜNG NÀY ĐỂ RÀNG BUỘC
  standardCapacity: number; // VD: 3
  maxCapacity: number;      // VD: 4

  onSuccess?: () => void;
  initialCheckIn?: string;
  initialCheckOut?: string;
}

export interface HotelDetail extends Hotel {
  avatarUrl?: string;
  imageUrls?: string[];
}