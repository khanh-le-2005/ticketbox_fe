// src/pages/NewsPage.tsx

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { NewsSection } from "../components/NewsSection";
import FloatButton from "@/components/FloatButton";

export const BASE_API_URL = "https://api.momangshow.vn/api/admin/news";

const NewsPage: React.FC = () => {
  return (
    // <div className="bg-gray-50 min-h-screen flex flex-col relative">
    //   <Header />
    //   <Navbar />
    <div className="bg-gray-50 min-h-screen relative">
      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Banner Tin Tức */}
          <div className="relative bg-white rounded-lg shadow-lg mb-12 overflow-hidden h-[320px]">

            {/* Ảnh nền */}
            <img
              src="https://i.postimg.cc/VkGFMjGD/z7523302662966-4ce0aafcde1f5be1619c4d50e4d97087.jpg"
              alt="Banner Tin Tức"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Overlay tối */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 p-6 md:p-10 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Tin Tức & Sự Kiện
              </h1>
              <p className="text-gray-200 text-lg">
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

      <FloatButton />
    </div>
  );
};

export default NewsPage;
