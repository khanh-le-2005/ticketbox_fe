export interface ITicketType {
  id?: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  availableQuantity: number;
  soldQuantity?: number;
  active: boolean;
}

export interface IShowImage {
  imageFileId: string;
  imageContentType: string;
  imageFileName: string;
  displayOrder: number;
  imageUrl?: string; // Thêm trường này để lưu URL đầy đủ
}

export interface IShowArtist {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
}

export interface IShowAddress {
  specificAddress?: string;
  province: string;
  district: string;
  ward: string;
  latitude?: number;
  longitude?: number;
  fullAddress?: string;
}

export interface IShow {
  id: string;
  name: string;
  description?: string;
  genre?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  address: IShowAddress;
  artists: IShowArtist[];
  images: IShowImage[];
  ticketTypes: ITicketType[];
  companyId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  version?: number;
}

export interface IShowArtistDTO {
  id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
}

export interface IShowAddressDTO {
  specificAddress?: string;
  province: string;
  district: string;
  ward: string;
  latitude?: number;
  longitude?: number;
}

export interface IShowCreateRequest {
  name: string;
  description?: string;
  genre?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  address: IShowAddressDTO;
  artists?: IShowArtistDTO[];
  ticketTypes?: ITicketType[];
  companyId: string;
}

export interface IShowUpdateRequest {
  name: string;
  description?: string;
  genre?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  address: IShowAddressDTO;
  artists?: IShowArtistDTO[];
  ticketTypes?: ITicketType[];
  companyId: string;
}

export interface IShowSearchParams {
  keyword?: string;
  companyId?: string;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  size?: number;
}

export interface IShowListResponse {
  shows: IShow[];
  total: number;
  page: number;
  limit: number;
}

export interface IShowResponse {
  show: IShow;
  message?: string;
}

export interface IShowImageResponse {
  images: IShowImage[];
  message?: string;
}


export interface ITicketType {
  id?: string;
  code: string;           // 🔥 BẮT BUỘC
  name: string;
  description?: string;
  price: number;
  totalQuantity: number;  // 🔥 SỬA: Đổi từ quantity sang totalQuantity
  // availableQuantity: number; // Có thể backend tự tính, nhưng gửi kèm cũng được
  active: boolean;
}

export interface IShowImage {
  imageFileId: string;
  imageContentType: string;
  imageFileName: string;
  displayOrder: number;
  imageUrl?: string;
}

export interface IShowArtist {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
}

export interface IShowAddress {
  specificAddress?: string;
  province: string;
  district: string;
  ward: string;
  latitude?: number;
  longitude?: number;
  fullAddress?: string;
}

export interface IShow {
  id: string;
  name: string;
  description?: string;
  genre?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  address: IShowAddress;
  artists: IShowArtist[];
  images: IShowImage[];
  ticketTypes: ITicketType[];
  companyId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  version?: number;
}

// DTOs for Request
export interface IShowArtistDTO {
  id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
}

export interface IShowAddressDTO {
  specificAddress?: string;
  province: string;
  district: string;
  ward: string;
  latitude?: number;
  longitude?: number;
}

export interface IShowCreateRequest {
  name: string;
  description?: string;
  genre?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  address: IShowAddressDTO;
  artists?: IShowArtistDTO[];
  ticketTypes?: ITicketType[];
  companyId: string;
}

export interface IShowUpdateRequest {
  name: string;
  description?: string;
  genre?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  address: IShowAddressDTO;
  artists?: IShowArtistDTO[];
  ticketTypes?: ITicketType[];
  companyId: string;
}

export interface IShowSearchParams {
  page?: number;
  limit?: number;
  keyword?: string;
  companyId?: string;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  size?: number;
}

// Response Types
export interface IShowListResponse {
  shows: IShow[];
  total: number;
  page: number;
  limit: number;
}

export interface IShowResponse {
  show: IShow;
  message?: string;
}


export interface EventCardData {
  id: string;
  title: string;
  image: string;
  date: string;
  location: string;
  formattedPrice: string;
  views?: number;
  price?: number;
}

interface EventCardProps {
  event: EventCardData | any;
  className?: string;
  imageClassName?: string;
}