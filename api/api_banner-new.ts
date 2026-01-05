import axios, { AxiosResponse } from 'axios';
import { BASE_API_URL } from './api_base';

// =================================================================
// 1. INTERFACE/TYPES
// =================================================================

/**
 * Định nghĩa cấu trúc dữ liệu Banner (tương ứng với Java Model)
 */
export interface Banner {
  id?: string; // MongoDB ID là string, tùy chọn khi tạo mới
  imageUrl: string;
  title: string;
  subtitle: string;
  link: string;
  menu?: string; // BỔ SUNG: Trường menu
  displayOrder?: number;
  isActive: boolean;
}


// =================================================================
// 2. CẤU HÌNH API
// =================================================================

const API_ADMIN_BASE_URL = `${BASE_API_URL}/admin/banners`; // URL Admin Controller

// Axios instance cho Admin
const adminApi = axios.create({
  baseURL: API_ADMIN_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${localStorage.getItem('adminToken')}` 
  },
});

// Axios instance cho Public
const publicApi = axios.create({
    baseURL: API_ADMIN_BASE_URL,
});


// =================================================================
// 3. CÁC HÀM GỌI API (ADMIN) - Giữ nguyên
// =================================================================

/**
 * Lấy danh sách tất cả Banners (dùng cho trang AdminBanners)
 * GET /api/admin/banners
 */
export const getAllBanners = async (): Promise<Banner[]> => {
  try {
    const response: AxiosResponse<Banner[]> = await adminApi.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching all banners:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết Banner theo ID (dùng cho trang AddEditBanner)
 * GET /api/admin/banners/{id}
 */
export const getBannerById = async (id: string): Promise<Banner> => {
  try {
    const response: AxiosResponse<Banner> = await adminApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching banner with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Thêm Banner mới
 * POST /api/admin/banners
 */
export const createBanner = async (bannerData: Banner): Promise<Banner> => {
  try {
    const { id, ...dataToSend } = bannerData; 
    const response: AxiosResponse<Banner> = await adminApi.post('', dataToSend);
    return response.data;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

/**
 * Cập nhật Banner hiện có
 * PUT /api/admin/banners/{id}
 */
export const updateBanner = async (id: string, bannerData: Banner): Promise<Banner> => {
  try {
    const dataToSend = { ...bannerData, id }; 
    const response: AxiosResponse<Banner> = await adminApi.put(`/${id}`, dataToSend);
    return response.data;
  } catch (error) {
    console.error(`Error updating banner with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa Banner
 * DELETE /api/admin/banners/{id}
 */
export const deleteBanner = async (id: string): Promise<void> => {
  try {
    await adminApi.delete(`/${id}`);
  } catch (error) {
    console.error(`Error deleting banner with ID ${id}:`, error);
    throw error;
  }
};


// =================================================================
// 4. CÁC HÀM GỌI API (PUBLIC - ĐÃ SỬA)
// =================================================================

/**
 * Lấy danh sách Banners đang hoạt động theo Menu (dùng cho HeroCarousel trang chủ)
 * GET /api/banners?menu={menu}
 * @param menu - Tên menu cần lấy banner (VD: homepage)
 */
export const getActiveBannersByMenu = async (menu: string): Promise<Banner[]> => {
    try {
        // Gọi đến Public Controller /api/banners với tham số menu
        const response: AxiosResponse<Banner[]> = await publicApi.get('/byMenu', { 
            params: { menu } // Gửi { menu: 'homepage' }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching active banners for menu ${menu}:`, error);
        throw error;
    }
};

/**
 * [Đã Sửa tên] Hàm này có thể được loại bỏ hoặc giữ lại nếu bạn có endpoint /active riêng.
 * Nếu không cần, bạn có thể xóa hàm này.
 */
// export const getActiveBanners = async (): Promise<Banner[]> => { ... }