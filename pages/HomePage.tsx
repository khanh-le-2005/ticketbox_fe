// src/pages/HomePage.tsx

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import EventCard from "../components/EventCard";
import EventSection from "../components/EventSection";
import Footer from "../components/Footer";

// Import API
import showApi from "../api/showApi";
import { getImageUrl } from "../api/api_image";

const HomePage: React.FC = () => {
  const [highlightedEvents, setHighlightedEvents] = useState<any[]>([]);
  const [musicEvents, setMusicEvents] = useState<any[]>([]);
  const [edmEvents, setEdmEvents] = useState<any[]>([]);
  const [acousticEvents, setAcousticEvents] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Helper format tiền
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Gọi API
        const res: any = await showApi.getAllShows({
          status: "UPCOMING",
          size: 20,
        });

        // 2. Bóc tách dữ liệu
        let showList: any[] = [];
        if (res?.data?.content && Array.isArray(res.data.content)) {
          showList = res.data.content;
        } else if (Array.isArray(res)) {
          showList = res;
        }

        if (showList.length === 0) {
          console.warn("⚠️ Không có show nào được trả về!");
        }

        const mappedEvents = showList.map((show: any) => {
          let imageUrl = "https://placehold.co/600x400?text=No+Image";

          const imgId =
            show.bannerImageId ||
            (show.galleryImageIds && show.galleryImageIds.length > 0
              ? show.galleryImageIds[0]
              : null);

          if (imgId) {
            imageUrl = getImageUrl(imgId);
          }

          const addr = show.address || {};
          const locationStr =
            addr.fullAddress ||
            [addr.specificAddress, addr.district, addr.province]
              .filter(Boolean)
              .join(", ");

          let minPrice = 0;
          if (Array.isArray(show.ticketTypes) && show.ticketTypes.length > 0) {
            minPrice = Math.min(
              ...show.ticketTypes.map((t: any) => t.price || 0)
            );
          }

          return {
            id: show.id,
            title: show.name,
            date: show.startTime,
            location: locationStr || "Hà Nội",
            image: imageUrl,
            price: minPrice,
            formattedPrice:
              minPrice === 0 ? "Miễn phí" : formatCurrency(minPrice),
            description: show.description,
          };
        });

        const sorted = mappedEvents.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setHighlightedEvents(sorted.slice(0, 4));
        setMusicEvents(sorted.slice(4, 8));
        setEdmEvents(sorted.slice(8, 12));
        setAcousticEvents(sorted.slice(12, 16));
      } catch (err) {
        console.error("❌ Lỗi tải trang chủ:", err);
        setErrorMessage("Không thể tải danh sách sự kiện");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <Header />
      <Navbar />
      <main>
        <Hero />

        {/* --- SỰ KIỆN NỔI BẬT --- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-500 pl-3">
              SỰ KIỆN NỔI BẬT
            </h2>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}

          {highlightedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlightedEvents.map((event) => (
                <div key={event.id} className="h-full">
                  <EventCard event={event} imageClassName="h-48 sm:h-52" />
                </div>
              ))}
            </div>
          ) : (
            !loading &&
            !errorMessage && (
              <p className="text-gray-500 text-center italic">
                Chưa có sự kiện nổi bật nào.
              </p>
            )
          )}
        </section>

        {/* Các section khác */}
        {musicEvents.length > 0 && (
          <EventSection
            title="CA NHẠC"
            events={musicEvents}
            viewMoreLink="/music"
          />
        )}

        {edmEvents.length > 0 && (
          <EventSection
            title="EDM & ROCK"
            events={edmEvents}
            viewMoreLink="/music"
          />
        )}

        {acousticEvents.length > 0 && (
          <EventSection
            title="ACOUSTIC & INDIE"
            events={acousticEvents}
            viewMoreLink="/arts"
          />
        )}
      </main>
      <Footer />

      {/* 👇 FLOAT BUTTON ZALO (Nút Zalo nổi) 👇 */}
      <a
        href="https://zalo.me/0963310889" // ⚠️ Thay số điện thoại Zalo của bạn vào đây
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

          {/* Tooltip nhỏ */}
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

export default HomePage;
