import axiosClient from "./axiosClient";
import {
  ApiResponse,
  Hotel,
  CreateHotelRequest,
  UpdateHotelRequest,
  AvailabilityResponse,
  CalendarDayItem,
  SpecialPriceItem,
} from "../type"; // Đảm bảo đã export đủ các type này trong file type chung

// Cấu hình URL gốc để ghép link ảnh
export const BASE_API_URL = "https://api.momangshow.vn/api";
export const IMAGE_BASE_URL = `${BASE_API_URL}/images`;
export interface RoomPriceResponse {
  roomTypeCode: string;
  price: number; // Giá hiện tại (theo ngày hiện tại hoặc logic backend)
  currency: string;
}

const hotelApi = {
  // =================================================================
  // 1. QUẢN LÝ KHÁCH SẠN (CRUD)
  // =================================================================

  /**
   * Lấy danh sách khách sạn (có hỗ trợ tìm kiếm & phân trang)
   * GET /api/hotels?page=0&size=10&keyword=...
   */
  getAll: (params?: { page?: number; size?: number; keyword?: string }) => {
    return axiosClient.get<ApiResponse<any>>("/hotels", { params });
  },

  /**
   * Universal Search (Từ khóa + Ngày - Trả về số phòng trống thực tế)
   * GET /api/hotels/search?q=...&checkIn=...&checkOut=...
   */
  search: (params: { q?: string; checkIn?: string; checkOut?: string }) => {
    const cleanParams: any = {};

    if (params.q && params.q.trim() !== "") {
      cleanParams.q = params.q.trim();
    }
    if (params.checkIn && params.checkIn.trim() !== "") {
      cleanParams.checkIn = params.checkIn;
    }
    if (params.checkOut && params.checkOut.trim() !== "") {
      cleanParams.checkOut = params.checkOut;
    }

    // 👇 SỬA DÒNG NÀY: Thêm "-keyword" vào sau chữ search
    return axiosClient.get<ApiResponse<any>>("/hotels/search-keyword", { params: cleanParams });
  },

  /**
   * Lấy chi tiết khách sạn theo ID
   * GET /api/hotels/{id}
   */
  getById: (id: string) => {
    return axiosClient.get<ApiResponse<Hotel>>(`/hotels/${id}`);
  },

  /**
   * Tạo khách sạn mới (Bao gồm upload ảnh và thông tin)
   * POST /api/hotels
   * Content-Type: multipart/form-data
   */
  create: (files: File[], data: CreateHotelRequest) => {
    const formData = new FormData();

    // 1. Append file ảnh
    files.forEach((file) => {
      formData.append("images", file);
    });

    // 2. Append dữ liệu JSON (dưới dạng String) vào key 'data'
    formData.append("data", JSON.stringify(data));

    return axiosClient.post<ApiResponse<Hotel>>("/hotels", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Cập nhật thông tin khách sạn
   * PUT /api/hotels/{id}
   */
  update: (id: string, data: UpdateHotelRequest) => {
    return axiosClient.put<ApiResponse<Hotel>>(`/hotels/${id}`, data);
  },

  /**
   * Xóa khách sạn
   * DELETE /api/hotels/{id}
   */
  delete: (id: string) => {
    return axiosClient.delete<ApiResponse<any>>(`/hotels/${id}`);
  },

  // =================================================================
  // 2. MEDIA & HÌNH ẢNH
  // =================================================================

  /**
   * Upload ảnh lẻ (Dùng cho các trường hợp upload rời)
   * POST /api/images
   */
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res: any = await axiosClient.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Kiểm tra logic thành công của Backend
      if (res.success === 200 || res.success === true) {
        const imageId = res.data;
        return {
          id: imageId,
          url: `${IMAGE_BASE_URL}/${imageId}`,
        };
      } else {
        throw new Error(res.message || "Upload thất bại");
      }
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      throw error;
    }
  },

  /**
   * Helper: Lấy URL ảnh từ ID (hoặc mảng ID)
   */
  getImageUrl: (idOrIds: string | number | number[] | undefined) => {
    if (!idOrIds) return "https://placehold.co/600x400?text=No+Image";

    // Nếu là mảng, lấy phần tử đầu tiên
    const id = Array.isArray(idOrIds) ? idOrIds[0] : idOrIds;

    const strId = String(id);
    if (strId.startsWith("http")) return strId; // Nếu đã là link full
    return `${IMAGE_BASE_URL}/${id}`;
  },

  // =================================================================
  // 3. BOOKING & AVAILABILITY (TÍNH NĂNG MỚI)
  // =================================================================

  /**
   * Kiểm tra phòng trống theo thời gian thực (Realtime Check)
   * GET /api/hotels/{hotelId}/availability
   */
  checkAvailability: (
    hotelId: string,
    roomTypeCode: string,
    checkIn: string,
    checkOut: string
  ) => {
    return axiosClient.get<ApiResponse<AvailabilityResponse>>(
      `/hotels/${hotelId}/availability`,
      {
        params: { roomTypeCode, checkIn, checkOut },
      }
    );
  },

  /**
   * Lấy dữ liệu lịch và giá cho cả tháng (Calendar View)
   * GET /api/hotels/{hotelId}/calendar
   */
  getCalendar: (
    hotelId: string,
    roomTypeCode: string,
    month: number,
    year: number
  ) => {
    return axiosClient.get<ApiResponse<CalendarDayItem[]>>(
      `/hotels/${hotelId}/calendar`,
      {
        params: { roomTypeCode, month, year },
      }
    );
  },

  getRoomPrice: (hotelId: string, roomTypeCode: string, date: string) => {
    return axiosClient.get<ApiResponse<RoomPriceResponse>>(
      `/hotels/${hotelId}/price`,
      {
        params: { roomTypeCode, date, _t: new Date().getTime() },
      }
    );
  },

  calculatePrice: async (data: any) => {
    const res: any = await axiosClient.post<ApiResponse<any>>("/hotels/calculate-price", { ...data, _t: new Date().getTime() });
    if (res && res.data && res.data.totalPrice !== undefined && res.data.currentPrice === undefined) {
      res.data.currentPrice = res.data.totalPrice;
    }
    return res;
  },

  getSpecialPrices: (hotelId: string) => {
    return axiosClient.get<ApiResponse<SpecialPriceItem[]>>(
      `/hotels/${hotelId}/special-prices`
    );
  },
};

export default hotelApi;
