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
      <a
        href="tel:0929009999" // ⚠️ Thay số ĐIỆN THOẠI nghe gọi vào đây
        className="fixed bottom-28 right-8 z-50 group"
        title="Gọi ngay"
      >
        <div className="relative flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 ring-4 ring-white">
          {/* Hiệu ứng sóng (Ping) */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>

          {/* Icon Phone SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-7 h-7 text-white relative z-10 animate-bounce-slow"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
            />
          </svg>

          {/* Tooltip */}
          <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Gọi ngay
          </span>
        </div>
      </a>
    </div>
  );
};

export default NewsPage;
