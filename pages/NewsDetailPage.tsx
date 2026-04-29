// src/pages/NewsDetailPage.tsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Tag, Calendar, User, Loader2 } from "lucide-react";
import DOMPurify from "dompurify"; // Thư viện làm sạch HTML

// Import Layout Components
import Header from "../components/Header";
import Footer from "../components/Footer";

// Import API
import { getPublicArticleBySlug, Article } from "../api/api_article";
import FloatButton from "@/components/FloatButton";

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 1. Gọi API lấy dữ liệu ---
  useEffect(() => {
    window.scrollTo(0, 0);

    if (slug) {
      const fetchArticle = async () => {
        setLoading(true);
        try {
          const data = await getPublicArticleBySlug(slug);
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
  }, [slug]);

  // --- 2. Cập nhật SEO Meta Tags & Schema ---
  useEffect(() => {
    if (article) {
      // Cập nhật Title
      const title = article.seoTitle || article.title;
      document.title = title;

      // Cập nhật Meta Description
      let description =
        article.seoDescription || article.shortDescription || "";
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description);

      // Cập nhật Open Graph Tags
      const ogTags = [
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: article.thumbUrl },
        {
          property: "og:url",
          content: window.location.href,
        },
      ];

      ogTags.forEach((tag) => {
        let element = document.querySelector(`meta[property="${tag.property}"]`);
        if (!element) {
          element = document.createElement("meta");
          element.setAttribute("property", tag.property);
          document.head.appendChild(element);
        }
        element.setAttribute("content", tag.content);
      });

      // Thêm JSON-LD Schema
      const schemaData = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.seoTitle || article.title,
        image: [article.thumbUrl],
        datePublished: article.publishedDate || article.createdDate,
        dateModified: article.publishedDate || article.createdDate,
        description: article.seoDescription || article.shortDescription,
        author: {
          "@type": "Person",
          name: "Admin",
        },
      };

      let scriptSchema = document.getElementById("article-schema") as HTMLScriptElement;
      if (!scriptSchema) {
        scriptSchema = document.createElement("script");
        scriptSchema.id = "article-schema";
        scriptSchema.type = "application/ld+json";
        document.body.appendChild(scriptSchema);
      }
      scriptSchema.textContent = JSON.stringify(schemaData);
    }

    return () => {
      // Cleanup nếu cần (tùy chọn)
    };
  }, [article]);

  // Format ngày tháng
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Mới cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // --- RENDER LOADING ---
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-orange-600 mb-4" />
          <span className="text-gray-500 font-medium">
            Đang tải nội dung...
          </span>
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
        <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Rất tiếc!</h2>
          <p className="text-red-500 mb-6">
            {error || "Bài viết không tồn tại."}
          </p>
          <Link
            to="/news"
            className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition font-medium"
          >
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
    // <div className="bg-gray-50 min-h-screen flex flex-col relative">
    //   <Header />
    //   <Navbar />
    <div className="bg-gray-50 min-h-screen relative">
      <Header />

      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb */}
          <div className="max-w-4xl mx-auto mb-6">
            <Link
              to="/news"
              className="inline-flex items-center text-gray-500 hover:text-orange-600 transition-colors font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách tin tức
            </Link>
          </div>

          <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            {/* Ảnh bìa */}
            <div className="relative h-64 md:h-[450px] w-full">
              <img
                src={
                  article.thumbUrl ||
                  "https://via.placeholder.com/800x400?text=No+Image"
                }
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/800x400?text=Image+Error";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

              {/* Tiêu đề nằm trên ảnh */}
              <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full text-white">
                <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium mb-3 opacity-90">
                  <span className="bg-orange-600 px-3 py-1 rounded-full text-white uppercase tracking-wide shadow-sm text-xs font-bold">
                    {article.menu || "Tin Tức"}
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
                className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-img:rounded-xl prose-img:shadow-md prose-p:leading-loose"
                dangerouslySetInnerHTML={{ __html: safeContent }}
              />

              {/* Footer bài viết */}
              <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm">
                  <Tag className="w-4 h-4 text-blue-500" />
                  <span className="font-bold text-gray-700">Tags:</span>
                  {article.tags ? (
                    article.tags.split(",").map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 px-3 py-1 rounded-full text-gray-600 text-xs hover:bg-orange-50 hover:text-orange-600 transition cursor-pointer"
                      >
                        #{tag.trim()}
                      </span>
                    ))
                  ) : (
                    <span>Không có thẻ</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-medium text-sm">
                    Chia sẻ bài viết:
                  </span>
                  <button
                    className="p-2.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                    title="Chia sẻ Facebook"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />

      <FloatButton />
    </div>
  );
};

export default NewsDetailPage;
