// src/pages/EventDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaEnvelope,
  FaShareAlt,
  FaImages,
  FaTimes,         // Icon đóng
  FaChevronLeft,   // Icon trái
  FaChevronRight   // Icon phải
} from "react-icons/fa";
// import { FaPhone } from "react-icons/fa";
// Import API
import showApi from "../api/showApi";
import { getImageUrl } from "../api/api_image";
import FloatButton from "@/components/FloatButton";
import zaloLogo from "../assets/zalo.webp";

// Helper format tiền
const formatCurrency = (val: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    val
  );
const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // --- STATE LIGHTBOX (XEM ẢNH PHÓNG TO) ---
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        window.scrollTo(0, 0);

        // --- 1. LẤY CHI TIẾT SỰ KIỆN HIỆN TẠI ---
        const detailRes: any = await showApi.getById(id);
        const showData = detailRes.data || detailRes;

        // Xử lý ảnh chính
        let mainImageUrl = "https://placehold.co/1200x500?text=No+Banner";
        if (showData.bannerImageId) {
          mainImageUrl = getImageUrl(showData.bannerImageId);
        } else if (
          Array.isArray(showData.galleryImageIds) &&
          showData.galleryImageIds.length > 0
        ) {
          mainImageUrl = getImageUrl(showData.galleryImageIds[0]);
        }

        // Xử lý Gallery
        let galleryUrls: string[] = [];
        if (Array.isArray(showData.galleryImageIds)) {
          galleryUrls = showData.galleryImageIds.map((imgId: number) =>
            getImageUrl(imgId)
          );
        }

        // Quan trọng: Thêm ảnh chính vào đầu danh sách gallery để slide đẹp hơn
        if (galleryUrls.length === 0 && mainImageUrl) {
          galleryUrls.push(mainImageUrl);
        } else if (galleryUrls.length > 0 && !galleryUrls.includes(mainImageUrl)) {
          galleryUrls.unshift(mainImageUrl);
        }

        // Xử lý địa chỉ
        const addr = showData.address || {};
        const fullLocation =
          addr.fullAddress ||
          [addr.specificAddress, addr.ward, addr.district, addr.province]
            .filter(Boolean)
            .join(", ");

        setEvent({
          ...showData,
          id: String(showData.id),
          image: mainImageUrl,
          gallery: galleryUrls, // Mảng ảnh đầy đủ để slide
          fullLocation: fullLocation,
          performers: Array.isArray(showData.performers)
            ? showData.performers
            : [],
        });

        // --- 2. LẤY SỰ KIỆN LIÊN QUAN ---
        const allShowsRes: any = await showApi.getAllShows();
        const allShowsData =
          allShowsRes.data?.content ||
          (Array.isArray(allShowsRes) ? allShowsRes : []);

        if (Array.isArray(allShowsData)) {
          const others = allShowsData
            .filter((item: any) => String(item.id) !== id)
            .slice(0, 3)
            .map((item: any) => {
              let thumbUrl = "https://placehold.co/600x400?text=No+Image";
              const imgId =
                item.bannerImageId ||
                (item.galleryImageIds && item.galleryImageIds[0]);
              if (imgId) thumbUrl = getImageUrl(imgId);

              let minPrice = 0;
              if (item.ticketTypes?.length > 0) {
                minPrice = Math.min(
                  ...item.ticketTypes.map((t: any) => t.price || 0)
                );
              }

              return {
                id: item.id,
                title: item.name,
                date: item.startTime,
                image: thumbUrl,
                minPrice: minPrice,
                formattedPrice:
                  minPrice === 0 ? "Miễn phí" : formatCurrency(minPrice),
              };
            });
          setRelatedEvents(others);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRelatedClick = (relatedId: string) => {
    navigate(`/event/${relatedId}`);
  };

  // --- LIGHTBOX HANDLERS (LOGIC MỚI) ---
  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setIsGalleryOpen(true);
  };

  const closeLightbox = () => setIsGalleryOpen(false);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!event?.gallery) return;
    setPhotoIndex((prev) => (prev + 1) % event.gallery.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!event?.gallery) return;
    setPhotoIndex((prev) => (prev + event.gallery.length - 1) % event.gallery.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!event) {
    return <div className="text-center py-20">Không tìm thấy sự kiện.</div>;
  }

  const eventDate = new Date(event.startTime);

  return (
    // <div className="bg-gray-50 min-h-screen flex flex-col">
    //   <Header />
    //   <Navbar />
    <div className="bg-gray-50 min-h-screen relative">
      <Header />

      {/* 👇 SỬA ĐOẠN NÀY: Ẩn Navbar trên mobile để không bị trùng 2 menu */}
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <main className="flex-grow">
        {/* --- BANNER (CLICK ĐỂ MỞ LIGHTBOX) --- */}
        <div
          className="relative w-full h-[300px] md:h-[450px] bg-gray-900 overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)} // Mở ảnh đầu tiên
        >
          <div
            className="absolute inset-0 bg-cover bg-center blur-sm opacity-50 scale-110"
            style={{ backgroundImage: `url('${event.image}')` }}
          ></div>
          <div className="absolute inset-0 flex justify-center items-center p-4">
            <img
              src={event.image}
              alt={event.name}
              className="h-full w-auto max-w-full object-contain shadow-2xl rounded-md transition-transform duration-500 group-hover:scale-105"
              onError={(e) =>
              (e.currentTarget.src =
                "https://placehold.co/1200x500?text=Error")
              }
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
            {/* <span className="text-white opacity-0 group-hover:opacity-100 border border-white px-4 py-2 rounded-full backdrop-blur-sm transition-opacity duration-300">
              🔍 Xem phóng to
            </span> */}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-20 relative z-10">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            {/* === CỘT TRÁI: THÔNG TIN CHI TIẾT === */}
            <div className="p-6 md:p-8 md:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {event.name}
              </h1>
              <div className="flex flex-wrap gap-6 text-gray-600 mb-6 text-sm md:text-base">
                <div className="flex items-center">
                  <span className="mr-2 text-indigo-600"><FaClock /></span>
                  <span>
                    {eventDate.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-indigo-600"><FaCalendarAlt /></span>
                  <span>
                    {eventDate.toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-indigo-600 flex-shrink-0"><FaMapMarkerAlt /></span>
                  <span>{event.fullLocation || "Đang cập nhật"}</span>
                </div>
              </div>

              <div className="prose max-w-none text-gray-700 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase border-l-4 border-indigo-500 pl-3">
                  Giới thiệu về sự kiện
                </h3>
                <p className="whitespace-pre-line leading-relaxed">
                  {event.description ||
                    "Chưa có mô tả chi tiết cho sự kiện này."}
                </p>
                <br />
                <p>
                  <strong>Nghệ sĩ tham gia: </strong>{" "}
                  {event.performers.length > 0
                    ? event.performers.join(", ")
                    : "Đang cập nhật"}
                </p>
              </div>

              {/* GALLERY ẢNH (CLICK ĐỂ MỞ LIGHTBOX) */}
              {event.gallery && event.gallery.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase">
                    <span className="text-indigo-600"><FaImages /></span> Sơ đồ / Thư viện ảnh
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.gallery.map((imgUrl: string, index: number) => (
                      <div
                        key={index}
                        className="rounded-xl overflow-hidden shadow-lg border border-gray-200 cursor-pointer relative group"
                        // Gắn sự kiện click mở Lightbox
                        onClick={() => openLightbox(index)}
                      >
                        <img
                          src={imgUrl}
                          alt={`Sơ đồ ${index}`}
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 text-3xl drop-shadow-md">🔍</span>
                        </div> */}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CỘT PHẢI: SIDEBAR */}
            <div className="bg-gray-50 p-6 md:p-8 md:w-1/3 border-l border-gray-100 flex flex-col">
              {/* 1. LIÊN HỆ & MẠNG XÃ HỘI */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Liên hệ ngay
                </h3>
                <div className="flex items-center gap-4">
                  <a
                    href="https://zalo.me/0963310889"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-full hover:scale-110 transition"
                  >
                    <img src={zaloLogo}
                      alt="Zalo" className="w-6 h-6" />
                  </a>
                </div>
              </div>

              {/* 2. THÔNG TIN HỖ TRỢ */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6">
                <p className="text-xs text-gray-500 mb-1">
                  Liên hệ bộ phận chăm sóc khách hàng
                </p>
                <p className="text-sm text-gray-800 font-medium mb-1">
                  ✉ Email: momangshow@gmail.com
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  📞 Hotline:{" "}
                  <span className="text-orange-600 font-bold">0929009999</span>
                </p>
              </div>

              {/* 3. BẢN ĐỒ */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 uppercase">
                  <span className="text-orange-500"><FaMapMarkerAlt size={18} /></span>
                  Bản đồ địa điểm
                </h3>

                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-100">
                  {event.address?.latitude && event.address?.longitude && event.address.latitude !== 0 ? (
                    <iframe
                      title="Event Location"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      src={`https://maps.google.com/maps?q=${event.address.latitude},${event.address.longitude}&hl=vi&z=15&output=embed`}
                      className="w-full h-full"
                    />
                  ) : event.fullLocation ? (
                    <iframe
                      title="Event Address"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        event.fullLocation
                      )}&hl=vi&z=14&output=embed`}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <span className="mb-2 opacity-50"><FaMapMarkerAlt size={30} /></span>
                      <span className="text-xs">Chưa có dữ liệu bản đồ</span>
                    </div>
                  )}

                  {(event.address?.latitude && event.address?.longitude) ||
                    event.fullLocation ? (
                    <a
                      href={
                        event.address?.latitude && event.address?.longitude
                          ? `https://www.google.com/maps/dir/?api=1&destination=${event.address.latitude},${event.address.longitude}`
                          : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                            event.fullLocation
                          )}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 bg-white px-3 py-1.5 rounded-md shadow-md text-sm font-medium text-blue-600 hover:bg-gray-100"
                    >
                      🚗 Chỉ đường
                    </a>
                  ) : null}
                </div>
              </div>

              {/* 4. NÚT MUA VÉ */}
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg shadow-lg transform transition hover:scale-105 flex justify-center items-center text-lg "
              >
                Mua vé ngay
              </button>
            </div>
          </div>
        </div>

        {/* --- KHU VỰC SỰ KIỆN LIÊN QUAN --- */}
        {relatedEvents.length > 0 && (
          <div className="bg-gray-100 py-12 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase border-l-4 border-orange-500 pl-3">
                Có thể bạn sẽ thích
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedEvents.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleRelatedClick(item.id)}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  >
                    <div className="h-48 bg-gray-300 relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) =>
                        (e.currentTarget.src =
                          "https://placehold.co/600x400?text=No+Image")
                        }
                      />
                      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold text-indigo-600 shadow">
                        Sắp diễn ra
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2 min-h-[56px]">
                        {item.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="mr-2"><FaCalendarAlt /></span>
                        {new Date(item.date).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="flex justify-between items-center border-t pt-3">
                        <span className="text-orange-600 font-bold">
                          {item.formattedPrice}
                        </span>
                        <button className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          Xem ngay
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* --- LIGHTBOX MODAL (ĐOẠN CODE MỚI THÊM VÀO) --- */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center animate-in fade-in duration-200">
          {/* Close Button */}
          <button onClick={closeLightbox} className="absolute top-5 right-5 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition z-50">
            <FaTimes size={30} />
          </button>

          {/* Navigation Buttons */}
          <button onClick={prevPhoto} className="absolute left-4 md:left-8 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition z-50">
            <FaChevronLeft size={40} />
          </button>
          <button onClick={nextPhoto} className="absolute right-4 md:right-8 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition z-50">
            <FaChevronRight size={40} />
          </button>

          {/* Image */}
          <div className="relative max-w-5xl max-h-[85vh] w-full flex justify-center p-4">
            <img
              src={event.gallery[photoIndex]}
              alt="Gallery Full"
              className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
            />
            <div className="absolute bottom-[-40px] text-white font-medium text-lg tracking-wider">
              {photoIndex + 1} / {event.gallery.length}
            </div>
          </div>
        </div>
      )}

      {/* MODAL ĐẶT VÉ */}
      {event && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          event={{
            id: String(event.id || ""),
            title: event.name,
            ticketTiers:
              event.ticketTypes?.map((t: any) => ({
                name: t.code,
                displayName: t.name,
                price: t.price,
                available: t.realAvailable ?? t.availableQuantity ?? t.totalQuantity ?? 0,
              })) || [],
          }}
        />
      )}

      {/* FLOAT BUTTON ZALO */}
      <FloatButton />
    </div>
  );
};

export default EventDetailPage;