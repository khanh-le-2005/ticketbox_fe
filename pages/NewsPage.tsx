// src/pages/NewsPage.tsx

import React from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { NewsSection } from "../components/NewsSection";

export const BASE_API_URL = "https://api.momangshow.vn/api/admin/news";

const NewsPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col relative">
      <Header />
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Banner Tin Tức */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-12 relative overflow-hidden">
            {/* Ảnh nền mờ để tạo hiệu ứng đẹp */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80"
              style={{
                backgroundImage:
                  "url('https://picsum.photos/seed/newsbg/1200/300')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>

            <div className="relative z-10 p-4 md:p-8 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-md">
                Tin Tức & Sự Kiện
              </h1>
              <p className="text-gray-200 text-lg drop-shadow-sm">
                Cập nhật những thông tin nóng hổi nhất về thế giới giải trí và
                các hoạt động của công ty.
              </p>
            </div>
          </div>

          {/* Nhúng NewsSection */}
          <section>
            <NewsSection />
          </section>
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

export default NewsPage;
