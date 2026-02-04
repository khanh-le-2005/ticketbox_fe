import axiosClient from './axiosClient';
import { Banner } from '@/type/index';

const ENDPOINT = 'admin/banners';

// =================================================================
// 1. CÁC HÀM GỌI API (ADMIN)
// =================================================================
export const getAllBanners = async (): Promise<Banner[]> => {
  try {
    return await axiosClient.get(ENDPOINT);
  } catch (error) {
    console.error('Error fetching all banners:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết Banner theo ID
 * GET /api/admin/banners/{id}
 */
export const getBannerById = async (id: string): Promise<Banner> => {
  try {
    return await axiosClient.get(`${ENDPOINT}/${id}`);
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
    return await axiosClient.post(ENDPOINT, dataToSend);
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
    return await axiosClient.put(`${ENDPOINT}/${id}`, dataToSend);
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
    await axiosClient.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error deleting banner with ID ${id}:`, error);
    throw error;
  }
};


// =================================================================
// 2. CÁC HÀM GỌI API (PUBLIC)
// =================================================================


export const getActiveBannersByMenu = async (menu: string): Promise<Banner[]> => {
  try {
    return await axiosClient.get(`${ENDPOINT}/active-all`, {
      params: { menu }
    });
  } catch (error) {
    console.error(`Error fetching active banners for menu ${menu}:`, error);
    throw error;
  }
};