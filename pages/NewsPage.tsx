// src/pages/NewsPage.tsx

import React from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
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
      <div className="hidden md:block">
        <Navbar />
      </div>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Banner Tin Tức */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-12 relative overflow-hidden h-[300px]">
            {/* Ảnh nền mờ để tạo hiệu ứng đẹp */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-90 h-auto"
              style={{
                backgroundImage:
                  "url('https://i.postimg.cc/BvF17TSK/Beauty-Plus-IMAGE-ENHANCER-1768450444635.png')",
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

      <FloatButton />
    </div>
  );
};

export default NewsPage;
