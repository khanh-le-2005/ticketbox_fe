import axiosClient from './axiosClient';

// Lưu ý: Hàm này dùng để gọi API upload, không phải để hiển thị ảnh
export const uploadImageFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res: any = await axiosClient.post('/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (res.success) {
        return String(res.data); // Trả về ID ảnh
    } else {
        throw new Error(res.message);
    }
  } catch (error) {
    throw error;
  }
};

// Hàm này không gọi API, chỉ tạo string URL
export const getImageUrl = (id: string | number): string => {
  return `https://api.momangshow.vn/api/images/${id}`;
};