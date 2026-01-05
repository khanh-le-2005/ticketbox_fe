// apis/api_show.ts
import axiosClient from './axiosClient';

// ==========================================
// INTERFACES & TYPES
// ==========================================

// src/apis/api_show.ts

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

// ... các phần khác giữ nguyên

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

// ==========================================
// API OBJECT
// ==========================================

const showApi = {
  /**
   * Lấy danh sách Show có phân trang và lọc
   */
  getAllShows: async (params?: IShowSearchParams): Promise<IShowListResponse> => {
    return axiosClient.get('/shows', { params });
    
  },

  /**
   * Lấy chi tiết Show theo ID
   */
  getById: async (id: string): Promise<IShow> => {
    return axiosClient.get(`/shows/${id}`);
  },

  /**
   * Tạo mới Show (Multipart: JSON data + Images)
   */
  create: async (data: IShowCreateRequest, images?: File[]): Promise<IShowResponse> => {
    const formData = new FormData();
    // Backend yêu cầu gửi JSON string dưới dạng field 'data'
    formData.append('data', JSON.stringify(data));
    
    // Append từng file ảnh vào 'images'
    if (images && images.length > 0) {
      images.forEach((file) => formData.append('images', file));
    }

    return axiosClient.post('/shows', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      },
    });
  },

  /**
   * Cập nhật Show (Multipart: JSON data + Images nếu có thay đổi ảnh)
   */
  update: async (id: string, data: IShowUpdateRequest, images?: File[]): Promise<IShowResponse> => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));

    if (images && images.length > 0) {
      images.forEach((file) => formData.append('images', file));
    }

    return axiosClient.put(`/shows/${id}`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      },
    });
  },
  
  /**
   * Xóa Show (Soft delete hoặc Hard delete tùy Backend)
   */
  delete: async (id: string): Promise<any> => {
    return axiosClient.delete(`/shows/${id}`);
  },
  
  /**
   * Kích hoạt hoặc hủy kích hoạt Show (nếu cần)
   */
  toggleActive: async (id: string, active: boolean): Promise<any> => {
    return axiosClient.patch(`/shows/${id}/active`, { active });
  },


  // 2. Lấy chi tiết show theo ID (Hàm bạn đang thiếu)
  getShowById: (id: string) => {
    return axiosClient.get(`/shows/${id}`);
  },

  // 3. Lấy show nổi bật (Dùng cho Slider trang chủ)
  getFeaturedShows: () => {
    return axiosClient.get('/shows/featured');
  }
};


export default showApi;