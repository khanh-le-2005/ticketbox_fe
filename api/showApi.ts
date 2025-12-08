import axiosClient from "./axiosClient";

// Định nghĩa lại interface cơ bản để gợi ý code (tùy chọn, nếu bạn có file types riêng thì import vào)
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
  // 1. Lấy tất cả danh sách show
  getAllShows: () => {
    return axiosClient.get("/shows");
  },

  // 2. Lấy chi tiết 1 show theo ID
  getShowById: (id: string) => {
    return axiosClient.get(`/shows/${id}`);
  },

  // 3. Tạo show mới (Có gửi kèm file ảnh)
  createShow: (data: ShowDTO, images: File[]) => {
    const formData = new FormData();

    // Cách 1: Gửi toàn bộ thông tin show dưới dạng chuỗi JSON vào field 'data' hoặc 'show'
    // (Backend cần parse chuỗi này ra object)
    formData.append("data", JSON.stringify(data));

    // Cách 2: Nếu Backend yêu cầu gửi rời từng trường, bạn phải append từng cái:
    // formData.append("name", data.name);
    // formData.append("startTime", data.startTime);
    // ...

    // Gửi danh sách ảnh
    if (images && images.length > 0) {
      images.forEach((file) => {
        // 'images' là tên field mà Backend (Multer/Spring) mong đợi
        formData.append("images", file); 
      });
    }

    return axiosClient.post("/shows", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 4. Cập nhật show (Có thể cập nhật ảnh hoặc không)
  updateShow: (id: string, data: ShowDTO, images: File[]) => {
    const formData = new FormData();
    
    // Tương tự như create, gửi data dạng JSON string
    formData.append("data", JSON.stringify(data));

    // Nếu có chọn ảnh mới thì gửi lên
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    // Dùng PUT hoặc PATCH tùy backend quy định
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