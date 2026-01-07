// src/pages/MusicPage.tsx

import React, { useState, useEffect } from "react";
import axios from "axios"; // Import trực tiếp Axios
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";

// Cấu hình URL
const API_URL = "https://api.momangshow.vn/api/shows";
const API_IMAGE_BASE = "https://api.momangshow.vn/api/images";

// Hàm helper format tiền
const formatCurrency = (val: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    val
  );

const MusicPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const fetchMusicEvents = async () => {
      try {
        setLoading(true);

        // --- GỌI TRỰC TIẾP AXIOS ---
        const response = await axios.get(API_URL);

        // response.data là toàn bộ cục JSON trả về
        const result = response.data;

        // Kiểm tra cấu trúc dựa trên JSON mẫu: { success: true, data: { content: [] } }
        if (
          result.success &&
          result.data &&
          Array.isArray(result.data.content)
        ) {
          const showList = result.data.content;

          // Map dữ liệu
          const mappedEvents = showList.map((show: any) => {
            // 1. Xử lý địa chỉ
            const addr = show.address || {};
            const fullLocation =
              addr.fullAddress ||
              [addr.specificAddress, addr.ward, addr.district, addr.province]
                .filter(Boolean)
                .join(", ");

            // 2. Xử lý giá vé thấp nhất
            let minPrice = 0;
            if (show.ticketTypes && show.ticketTypes.length > 0) {
              minPrice = Math.min(...show.ticketTypes.map((t: any) => t.price));
            }

            // 3. Xử lý ảnh (Dùng bannerImageId)
            let imageUrl = "https://placehold.co/600x400?text=No+Image";

            if (show.bannerImageId) {
              imageUrl = `${API_IMAGE_BASE}/${show.bannerImageId}`;
            } else if (
              show.galleryImageIds &&
              show.galleryImageIds.length > 0
            ) {
              // Nếu không có banner thì lấy ảnh đầu tiên trong gallery
              imageUrl = `${API_IMAGE_BASE}/${show.galleryImageIds[0]}`;
            }

            // 4. Return object chuẩn cho EventCard
            return {
              id: show.id,
              title: show.name,
              date: show.startTime, // "2024-12-31T20:00:00"
              location: fullLocation || "Đang cập nhật",
              image: imageUrl,
              price: minPrice,
              formattedPrice:
                minPrice === 0 ? "Miễn phí" : formatCurrency(minPrice),
              description: show.description,
              status: show.status,
            };
          });

          // Sắp xếp theo thời gian (Mới nhất lên đầu)
          const sortedEvents = mappedEvents.sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          setEvents(sortedEvents);
        } else {
          console.warn("API response format invalid:", result);
          setErrorMsg("Dữ liệu trả về không đúng định dạng.");
        }
      } catch (error: any) {
        console.error("Failed to fetch music events:", error);
        setErrorMsg(
          "Không thể tải danh sách sự kiện. Vui lòng kiểm tra kết nối."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMusicEvents();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col relative">
      <Header />
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Banner */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-8 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop"
              alt="Music Banner"
              className="w-full h-48 object-cover opacity-60"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-md">
                Sự Kiện Ca Nhạc
              </h1>
              <p className="text-gray-200 drop-shadow-md max-w-2xl">
                Khám phá những đêm nhạc sôi động, liveshow hoành tráng và các sự
                kiện âm nhạc đỉnh cao đang diễn ra.
              </p>
            </div>
          </div>

          <section>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
              </div>
            ) : errorMsg ? (
              <div className="text-center py-10 bg-red-50 text-red-600 rounded-lg">
                {errorMsg}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {events.length > 0 ? (
                  events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-10 italic">
                    Hiện chưa có sự kiện nào trong danh mục này.
                  </div>
                )}
              </div>
            )}
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
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
          <img
            src="/zalo.webp"
            alt="Zalo"
            className="w-8 h-8 object-contain relative z-10"
          />
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

export default MusicPage;
