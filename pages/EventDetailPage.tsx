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
                    <FaImages className="text-indigo-600" /> Thư viện ảnh
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.gallery.map((imgUrl: string, index: number) => (
                      <div
                        key={index}
                        className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery ${index}`}
                          className="object-cover w-full h-40 transform hover:scale-105 transition-transform duration-300"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CỘT PHẢI: SIDEBAR */}
            <div className="bg-gray-50 p-6 md:p-8 md:w-1/3 border-l border-gray-100 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Liên hệ ngay
                </h3>
                <div className="flex items-center gap-4">
                  {/* Facebook */}
                  {/* <a
                    href="https://facebook.com/sharer/sharer.php?u=..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <FaFacebook size={24} />
                  </a> */}

                  {/* Twitter */}
                  {/* <a
                    href="https://twitter.com/intent/tweet?url=..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <FaTwitter size={24} />
                  </a> */}

                  {/* Email */}
                  {/* <a
                    href="mailto:hotro@momangshow.vn"
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <FaEnvelope size={24} />
                  </a> */}

                  {/* Share chung (Copy link) - Cái này thường giữ là Button */}
                  {/* <button
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Đã copy liên kết!");
                    }}
                  >
                    <FaShareAlt size={24} />
                  </button> */}

                  {/* Zalo (Đã đổi từ nút cuối cùng) */}
                  <a
                    href="https://zalo.me/0963310889"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                    flex items-center justify-center
                    rounded-full
                    hover:scale-110
                    transition
                  "
                  >
                    <img src="/zalo.webp" alt="Zalo" className="w-6 h-6" />
                  </a>
                </div>
              </div>
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
              <div className="mt-auto">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg shadow-lg transform transition hover:scale-105 flex justify-center items-center text-lg uppercase"
                >
                  Mua vé ngay
                </button>
              </div>
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
    </div>
  );
};

export default EventDetailPage;
