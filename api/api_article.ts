import axiosClient from './axiosClient';
import { Article } from '@/type/indext';

const ENDPOINT = '/admin/news';

// =================================================================
// 1. CÁC HÀM GỌI API (ADMIN)
// =================================================================

/**
 * Lấy danh sách tất cả bài viết (dùng cho trang AdminNews)
 * GET /api/admin/news
 */
export const getAllArticles = async (): Promise<Article[]> => {
  try {
    return await axiosClient.get(ENDPOINT);
  } catch (error) {
    console.error('Error fetching all articles:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết bài viết theo ID
 * GET /api/admin/news/{id}
 */
export const getArticleById = async (id: string): Promise<Article> => {
  try {
    return await axiosClient.get(`${ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error fetching article with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo bài viết mới
 * POST /api/admin/news
 */
export const createArticle = async (articleData: Article): Promise<Article> => {
  try {
    const { id, ...dataToSend } = articleData;
    return await axiosClient.post(ENDPOINT, dataToSend);
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};

/**
 * Cập nhật bài viết
 * PUT /api/admin/news/{id}
 */
export const updateArticle = async (id: string, articleData: Article): Promise<Article> => {
  try {
    const dataToSend = { ...articleData, id };
    return await axiosClient.put(`${ENDPOINT}/${id}`, dataToSend);
  } catch (error) {
    console.error(`Error updating article with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa bài viết
 * DELETE /api/admin/news/{id}
 */
export const deleteArticle = async (id: string): Promise<void> => {
  try {
    await axiosClient.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error deleting article with ID ${id}:`, error);
    throw error;
  }
};


// =================================================================
// 2. CÁC HÀM GỌI API (PUBLIC)
// =================================================================

/**
 * Lấy danh sách tin tức đã xuất bản theo Menu
 * GET /api/admin/news/byMenu?menu={menu}
 */
export const getPublishedNewsByMenu = async (menu: string): Promise<Article[]> => {
  try {
    return await axiosClient.get(`${ENDPOINT}/byMenu`, {
      params: { menu }
    });
  } catch (error) {
    console.error(`Error fetching published news for menu ${menu}:`, error);
    throw error;
  }
};

/**
 * Lấy chi tiết bài viết công khai
 * GET /api/admin/news/{id}
 */
export const getPublicArticleById = async (id: string): Promise<Article> => {
  try {
    return await axiosClient.get(`${ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error fetching public article with ID ${id}:`, error);
    throw error;
  }
};