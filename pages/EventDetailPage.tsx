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
} from "react-icons/fa";

// Import API
import showApi from "../api/showApi";
import { getImageUrl } from "../api/api_image";

// Helper format tiền
const formatCurrency = (val: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    val
  );

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<any[]>([]); // Danh sách liên quan
  const [loading, setLoading] = useState<boolean>(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        window.scrollTo(0, 0); // Quan trọng: Cuộn lên đầu khi chuyển trang

        // --- 1. LẤY CHI TIẾT SỰ KIỆN HIỆN TẠI ---
        const detailRes: any = await showApi.getById(id);
        const showData = detailRes.data || detailRes;

        // Xử lý ảnh chính (Banner -> Gallery[0] -> Placeholder)
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
          gallery: galleryUrls,
          fullLocation: fullLocation,
          performers: Array.isArray(showData.performers)
            ? showData.performers
            : [],
        });

        // --- 2. LẤY SỰ KIỆN LIÊN QUAN (Logic Inline) ---
        // Gọi API lấy tất cả show, sau đó lọc và lấy 3 cái khác show hiện tại
        const allShowsRes: any = await showApi.getAllShows();
        const allShowsData =
          allShowsRes.data?.content ||
          (Array.isArray(allShowsRes) ? allShowsRes : []);

        if (Array.isArray(allShowsData)) {
          const others = allShowsData
            .filter((item: any) => String(item.id) !== id) // Loại bỏ show đang xem
            .slice(0, 3) // Lấy 3 show
            .map((item: any) => {
              // Xử lý ảnh thumbnail
              let thumbUrl = "https://placehold.co/600x400?text=No+Image";
              const imgId =
                item.bannerImageId ||
                (item.galleryImageIds && item.galleryImageIds[0]);
              if (imgId) thumbUrl = getImageUrl(imgId);

              // Xử lý giá thấp nhất
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

  // Hàm xử lý khi click vào sự kiện liên quan
  const handleRelatedClick = (relatedId: string) => {
    navigate(`/event/${relatedId}`);
    // useEffect sẽ tự chạy lại và cuộn lên đầu trang
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
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <Navbar />

      <main className="flex-grow">
        {/* --- BANNER --- */}
        <div className="relative w-full h-[300px] md:h-[450px] bg-gray-900 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center blur-sm opacity-50 scale-110"
            style={{ backgroundImage: `url('${event.image}')` }}
          ></div>
          <div className="absolute inset-0 flex justify-center items-center p-4">
            <img
              src={event.image}
              alt={event.name}
              className="h-full w-auto max-w-full object-contain shadow-2xl rounded-md"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://placehold.co/1200x500?text=Error")
              }
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
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
                  <FaClock className="mr-2 text-indigo-600" />
                  <span>
                    {eventDate.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-indigo-600" />
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
                  <FaMapMarkerAlt className="mr-2 text-indigo-600 flex-shrink-0" />
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

              {/* GALLERY ẢNH */}
              {event.gallery && event.gallery.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase">
                    <FaImages className="text-indigo-600" /> Sơ đồ / Thư viện
                    ảnh
                  </h3>
                  {/* 1. ĐỔI GRID: Chỉ để 1 cột duy nhất (grid-cols-1) để ảnh to nhất có thể */}
                  <div className="grid grid-cols-1 gap-8">
                    {event.gallery.map((imgUrl: string, index: number) => (
                      <div
                        key={index}
                        className="rounded-xl overflow-hidden shadow-lg border border-gray-200"
                      >
                        {/* 
             2. LOGIC ẢNH: 
             - w-full: Chiếm hết chiều ngang khung chứa.
             - h-auto: Chiều cao tự động (không cố định) để giữ đúng tỷ lệ ảnh, không bị méo.
             - Bỏ 'object-cover' để không bị cắt mất chi tiết ghế.
          */}
                        <img
                          src={imgUrl}
                          alt={`Sơ đồ ${index}`}
                          className="w-full h-auto block"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                          // Thêm tính năng click vào để xem ảnh gốc (tab mới) nếu ảnh quá dài
                          onClick={() => window.open(imgUrl, "_blank")}
                          style={{ cursor: "zoom-in" }}
                          title="Nhấn để xem ảnh phóng to"
                        />
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
                  {/* ... (Giữ nguyên icon Zalo/MXH) ... */}
                  <a
                    href="https://zalo.me/0963310889"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-full hover:scale-110 transition"
                  >
                    <img src="/zalo.webp" alt="Zalo" className="w-6 h-6" />
                  </a>
                </div>
              </div>

              {/* 2. THÔNG TIN HỖ TRỢ */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6">
                <p className="text-xs text-gray-500 mb-1">
                  Liên hệ bộ phận chăm sóc khách hàng
                </p>
                <p className="text-sm text-gray-800 font-medium mb-1">
                  ✉ Email: hotro@momangshow.vn
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  📞 Hotline:{" "}
                  <span className="text-orange-600 font-bold">1900 1234</span>
                </p>
              </div>

              {/* 3. BẢN ĐỒ */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 uppercase">
                  <FaMapMarkerAlt className="text-orange-500" size={18} />
                  Bản đồ địa điểm
                </h3>

                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-100">
                  {/* ... (Giữ nguyên logic iframe bản đồ) ... */}
                  {event.address?.latitude &&
                  event.address?.longitude &&
                  event.address.latitude !== 0 ? (
                    <iframe
                      title="Event Location"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      src={`https://maps.google.com/maps?q=${event.address.latitude},${event.address.longitude}&hl=vi&z=15&output=embed`}
                      className="w-full h-full"
                    ></iframe>
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
                    ></iframe>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <FaMapMarkerAlt size={30} className="mb-2 opacity-50" />
                      <span className="text-xs">Chưa có dữ liệu bản đồ</span>
                    </div>
                  )}
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${event.address?.latitude},${event.address?.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-600 mt-2 block hover:underline truncate"
                >
                  📍 {event.fullLocation || "Xem trên Google Maps"}
                </a>
              </div>

              {/* 4. NÚT MUA VÉ (Đã chuyển lên đây và bỏ thẻ div mt-auto) */}
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg shadow-lg transform transition hover:scale-105 flex justify-center items-center text-lg"
              >
                Mua vé ngay
              </button>

              {/* Mình thêm class 'animate-pulse' nhẹ để nút gây chú ý hơn */}
            </div>
          </div>
        </div>

        {/* --- KHU VỰC SỰ KIỆN LIÊN QUAN (INLINE) --- */}
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
                    {/* Ảnh Thumbnail */}
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
                    {/* Nội dung text */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2 min-h-[56px]">
                        {item.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <FaCalendarAlt className="mr-2" />
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

      {/* MODAL ĐẶT VÉ (Đã cập nhật logic available) */}
      {event && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          event={{
            id: String(event.id || ""),
            title: event.name,
            ticketTiers:
              event.ticketTypes?.map((t: any) => ({
                name: t.code, // Mã vé (VIP, STD)
                displayName: t.name, // Tên hiển thị
                price: t.price,
                // Logic check số lượng vé còn lại:
                // Backend có thể trả về 'availableQuantity', 'realAvailable' hoặc 'totalQuantity'
                // Dùng toán tử ?? để ưu tiên lấy giá trị tồn tại đầu tiên
                available:
                  t.realAvailable ??
                  t.availableQuantity ??
                  t.totalQuantity ??
                  0,
              })) || [],
          }}
        />
      )}

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

export default EventDetailPage;
