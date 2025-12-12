import axiosClient from "./axiosClient";

export interface BlogPostDTO {
    id?: string;
    title: string;
    slug: string;
    shortDesc: string;
    content: string;
    thumbnail?: string;
    tags?: string;
    status: 'draft' | 'published';
    seoTitle?: string;
    seoDesc?: string;
    createdAt?: string;
}

const BlogAPI = {
    // Lấy tất cả bài viết
    getAllPosts: () => {
        return axiosClient.get("/blog-posts");
    },

    // Lấy chi tiết theo slug
    getPostBySlug: (slug: string) => {
        return axiosClient.get(`/blog-posts/slug/${slug}`);
    },

    // Tạo bài viết mới
    createPost: (data: BlogPostDTO) => {
        return axiosClient.post("/blog-posts", data);
    },

    // Cập nhật
    updatePost: (id: string, data: BlogPostDTO) => {
        return axiosClient.put(`/blog-posts/${id}`, data);
    },

    // Xóa
    deletePost: (id: string) => {
        return axiosClient.delete(`/blog-posts/${id}`);
    }
};

export default BlogAPI;