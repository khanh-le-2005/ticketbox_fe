import axiosClient from "./axiosClient"; // Đảm bảo đây là instance đã cấu hình baseURL

// Interface (Giữ nguyên)
interface ShowDTO {
  id?: string;
  name: string;
  startTime: string;
  description: string;
  address: {
    specificAddress: string;
    ward: string;
    district: string;
    province: string;
  };
  artistIds: string[];
  ticketTypes: any[];
}

export const ShowAPI = {
  // 1. Lấy tất cả
  getAllShows: () => {
    return axiosClient.get("/shows");
  },

  // 2. Lấy chi tiết
  getShowById: (id: string) => {
    return axiosClient.get(`/shows/${id}`);
  },

  // 3. TẠO SHOW (ĐÃ SỬA ĐỂ KHỚP VỚI JAVA SPRING BOOT)
  createShow: (data: ShowDTO, images: File[]) => {
    const formData = new FormData();

    // --- QUAN TRỌNG: Gói JSON vào Blob ---
    // Backend Java yêu cầu @RequestPart("show") phải có Content-Type là application/json
    const jsonBlob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    
    // Tên key phải là "show" (khớp với Controller Backend)
    formData.append("show", jsonBlob); 

    // Gửi danh sách ảnh
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    // Axios tự động set Content-Type là multipart/form-data khi thấy FormData
    // Nhưng ta ghi đè để chắc chắn
    return axiosClient.post("/shows", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 4. CẬP NHẬT SHOW (TƯƠNG TỰ CREATE)
  updateShow: (id: string, data: ShowDTO, images: File[]) => {
    const formData = new FormData();

    const jsonBlob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    formData.append("show", jsonBlob);

    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    return axiosClient.put(`/shows/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 5. Xóa show
  deleteShow: (id: string) => {
    return axiosClient.delete(`/shows/${id}`);
  },
};

export default ShowAPI;