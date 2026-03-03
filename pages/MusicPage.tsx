// src/pages/MusicPage.tsx

import React, { useState, useEffect } from "react";
import showApi from "../api/showApi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import FloatButton from "@/components/FloatButton";

// Cấu hình URL
// const API_URL = "https://api.momangshow.vn/api/shows";
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

        // --- GỌI QUA showApi ---
        const response: any = await showApi.getAllShows({ size: 100 });

        // response.data là toàn bộ cục JSON trả về
        const result = response.data;

        // Kiểm tra cấu trúc (Hỗ trợ cả response.data.content, response.shows, hoặc response là array)
        const showList = result?.data?.content || result?.content || result?.shows || (Array.isArray(result) ? result : null);

        if (Array.isArray(showList)) {

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
              slug: show.slug,
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
    // <div className="bg-gray-50 min-h-screen flex flex-col relative">
    //   <Header />
    //   <Navbar />
    <div className="bg-gray-50 min-h-screen relative">
      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Banner */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-8 shadow-xl">
            <img
              src="https://i.postimg.cc/26xBRp9H/Gemini-Generated-Image-50e3rn50e3rn50e3.png"
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

      <FloatButton />
    </div>
  );
};

export default MusicPage;
