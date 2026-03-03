// apis/api_show.ts
import axiosClient from './axiosClient';
import { IShowSearchParams, IShowListResponse, IShowResponse, IShowCreateRequest, IShowUpdateRequest, IShow } from '@/type/show.type'; 

const showApi = {
  /**
   * Lấy danh sách Show có phân trang và lọc
   */
  getAllShows: async (params? : IShowSearchParams): Promise<IShowListResponse> => {
    return axiosClient.get('/shows', { params: 
      {size: 100, ...params } 
    });    
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