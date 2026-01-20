import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Article } from '@/type/indext';

// --- 1. ĐỊNH NGHĨA INTERFACE THEO JSON API TRẢ VỀ ---
// export interface Article {
//     id: string;
//     title: string;
//     shortDescription: string;
//     content: string;
//     tags: string | null;
//     thumbUrl: string;
//     menu: string | null;
//     seoTitle: string;
//     seoDescription: string;
//     status: 'DRAFT' | 'PUBLISHED' | 'PENDING'; // Quan trọng để lọc
//     createdDate: string;
//     publishedDate: string;
// }

// URL API trực tiếp
const API_URL = 'https://api.momangshow.vn/api/admin/news';

// --- RENDER COMPONENT ---
export const NewsSection: React.FC = () => {
  const navigate = useNavigate(); 
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 2. LOGIC FETCH API TRỰC TIẾP ---
  useEffect(() => {
    const fetchNews = async () => {
        setLoading(true);
        try {
            // Gọi API bằng fetch native
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: Article[] = await response.json();
            
            // Xử lý dữ liệu:
            // 1. Chỉ lấy bài đã PUBLISHED
            // 2. Sắp xếp theo ngày mới nhất (publishedDate hoặc createdDate)
            const publishedNews = data
                .filter(item => item.status === 'PUBLISHED')
                .sort((a, b) => {
                    const dateA = new Date(a.publishedDate || a.createdDate).getTime();
                    const dateB = new Date(b.publishedDate || b.createdDate).getTime();
                    return dateB - dateA;
                });

            // Lấy 4 bài mới nhất để hiển thị
            setArticles(publishedNews.slice(0, 4));

        } catch (err) {
            console.error("Lỗi khi gọi API News:", err);
            setError("Không thể tải tin tức. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    fetchNews();
  }, []); 

  // --- HÀM XỬ LÝ CLICK ĐIỀU HƯỚNG ---
  const handleArticleClick = (id: string) => {
    if (id) {
        navigate(`/news/${id}`); 
        // Scroll lên đầu trang khi chuyển trang
        window.scrollTo(0, 0);
    }
  };

  // --- HELPER FORMATTING ---
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString.substring(0, 10);
    }
  };

  // --- JSX RENDER LOADING ---
  if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[300px] text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mr-2 text-brand-pink" />
            <span>Đang tải Tin tức...</span>
        </div>
      );
  }
  
  // --- JSX RENDER ERROR ---
  if (error) {
       return (
        <div className="flex items-center justify-center min-h-[300px] text-red-500 bg-red-50 border border-red-200 rounded-lg p-6">
            <span>{error}</span>
        </div>
      );
  }

  // --- JSX RENDER CONTENT ---
  return (
    <div>
      {/* Title / Tabs giả lập (Nếu cần hiển thị tiêu đề) */}
      <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Tin Tức Mới Nhất</h2>
          <p className="text-gray-500 mt-2">Cập nhật thông tin nhanh chóng và chính xác</p>
      </div>

      {/* Content Grid */}
      {articles.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              Hiện chưa có tin tức nào được xuất bản.
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleArticleClick(item.id)} 
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col cursor-pointer border border-gray-100"
              >
                {/* Image Section */}
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={item.thumbUrl || 'https://via.placeholder.com/600x400?text=No+Image'} 
                    alt={item.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { 
                        e.currentTarget.onerror = null; 
                        e.currentTarget.src = 'https://via.placeholder.com/600x400?text=No+Image'; 
                    }}
                  />
                  {/* Badge Tag */}
                  <div className="absolute top-0 left-0 bg-brand-pink text-white text-xs px-3 py-1 rounded-br-lg font-medium shadow-sm">
                    {item.tags ? item.tags.split('/')[1] || 'Tin tức' : 'Mới'}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-brand-pink transition-colors leading-snug">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1">
                    {item.shortDescription}
                  </p>
                  
                  {/* Footer Card */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400 font-medium">
                        {formatDate(item.publishedDate)}
                    </span>
                    <span className="flex items-center text-brand-pink text-xs font-bold uppercase tracking-wide group-hover:translate-x-1 transition-transform">
                      Xem chi tiết <ArrowRight className="w-4 h-4 ml-1 bg-brand-pink text-white rounded-full p-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
      )}

      {/* View More Button */}
      <div className="text-center mt-12">
        <Link to="/news" className="inline-flex bg-gradient-to-r from-brand-pink to-purple-600 text-black px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all font-bold items-center mx-auto">
          Xem tất cả tin tức
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </div>
  );
};