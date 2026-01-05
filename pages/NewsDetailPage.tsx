// src/pages/NewsDetailPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Tag, Calendar, User, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify'; // Thư viện làm sạch HTML

// Import Layout Components
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Import API
import { getPublicArticleById, Article } from '../api/api_article';

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 1. Gọi API lấy dữ liệu ---
  useEffect(() => {
    window.scrollTo(0, 0); 

    if (id) {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                const data = await getPublicArticleById(id);
                setArticle(data);
            } catch (err) {
                console.error(err);
                setError("Không tìm thấy bài viết hoặc lỗi kết nối server.");
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }
  }, [id]);

  // Format ngày tháng
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Mới cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  // --- RENDER LOADING ---
  if (loading) {
      return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-orange-600 mb-4" />
                <span className="text-gray-500 font-medium">Đang tải nội dung...</span>
            </div>
            <Footer />
        </div>
      );
  }

  // --- RENDER ERROR ---
  if (error || !article) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Header />
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Rất tiếc!</h2>
            <p className="text-red-500 mb-6">{error || "Bài viết không tồn tại."}</p>
            <Link to="/news" className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition font-medium">
               Quay lại trang tin tức
            </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Làm sạch HTML
  const safeContent = DOMPurify.sanitize(article.content);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col relative">
      <Header />
      <Navbar />

      <main className="flex-grow pt-8 pb-16">
          <div className="container mx-auto px-4 max-w-7xl">
            
            {/* Breadcrumb */}
            <div className="max-w-4xl mx-auto mb-6">
               <Link to="/news" className="inline-flex items-center text-gray-500 hover:text-orange-600 transition-colors font-medium text-sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại danh sách tin tức
               </Link>
            </div>

            <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
               
               {/* Ảnh bìa */}
               <div className="relative h-64 md:h-[450px] w-full">
                  <img 
                    src={article.thumbUrl || 'https://via.placeholder.com/800x400?text=No+Image'} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Image+Error';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  
                  {/* Tiêu đề nằm trên ảnh */}
                  <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full text-white">
                      <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium mb-3 opacity-90">
                          <span className="bg-orange-600 px-3 py-1 rounded-full text-white uppercase tracking-wide shadow-sm text-xs font-bold">
                              {article.menu || 'Tin Tức'}
                          </span>
                          <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" /> 
                              {formatDate(article.createdDate || article.publishedDate)}
                          </span>
                          <span className="flex items-center gap-1">
                              <User className="w-4 h-4" /> Admin
                          </span>
                      </div>
                      <h1 className="text-2xl md:text-4xl font-bold leading-tight drop-shadow-lg">
                        {article.title}
                      </h1>
                  </div>
               </div>

               {/* Nội dung bài viết */}
               <div className="p-6 md:p-12">
                  {/* Sapo */}
                  {article.shortDescription && (
                      <div className="text-lg md:text-xl font-medium text-gray-800 mb-8 italic border-l-4 border-orange-500 pl-5 py-1 leading-relaxed bg-gray-50 rounded-r-lg">
                          {article.shortDescription}
                      </div>
                  )}

                  {/* HTML Content */}
                  <div 
                    className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-orange-600 prose-img:rounded-xl prose-img:shadow-md prose-p:leading-loose"
                    dangerouslySetInnerHTML={{ __html: safeContent }}
                  />

                  {/* Footer bài viết */}
                  <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm">
                          <Tag className="w-4 h-4 text-orange-500" />
                          <span className="font-bold text-gray-700">Tags:</span>
                          {article.tags ? (
                              article.tags.split(',').map((tag, idx) => (
                                  <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-gray-600 text-xs hover:bg-orange-50 hover:text-orange-600 transition cursor-pointer">
                                      #{tag.trim()}
                                  </span>
                              ))
                          ) : <span>Không có thẻ</span>}
                      </div>
                      
                      <div className="flex items-center gap-3">
                          <span className="text-gray-700 font-medium text-sm">Chia sẻ bài viết:</span>
                          <button className="p-2.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors" title="Chia sẻ Facebook">
                              <Share2 className="w-4 h-4" />
                          </button>
                      </div>
                  </div>
               </div>
            </article>
          </div>
      </main>

      <Footer />

      {/* 👇 FLOAT BUTTON ZALO 👇 */}
      <a
        href="https://zalo.me/0963310889" // ⚠️ Thay số Zalo của bạn vào đây
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 group"
        title="Chat Zalo ngay"
      >
        <div className="relative flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 ring-4 ring-white">
            {/* Hiệu ứng sóng (Ping) */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
            
            {/* Icon Zalo */}
            <img 
                src="/zalo.webp" 
                alt="Zalo" 
                className="w-8 h-8 object-contain relative z-10" 
            />
            
            {/* Tooltip nhỏ hiện khi hover */}
            <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Tư vấn ngay
            </span>
        </div>
      </a>

    </div>
  );
};

export default NewsDetailPage;