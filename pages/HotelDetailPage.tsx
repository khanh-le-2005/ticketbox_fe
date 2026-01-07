import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaStar,
  FaCheckCircle,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaUserFriends,
  FaBed,
  FaSearch,
  FaCalendarAlt,
  FaUsers,
  FaBuilding,
  FaInfoCircle,
  FaFacebook,
  FaTwitter,
  FaShareAlt,
  FaSpinner, // Thêm icon loading nhỏ cho giá
} from "react-icons/fa";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import HotelBookingModal from "../components/HotelBookingModal";

import hotelApi from "@/api/hotelApi"; // Đảm bảo đúng đường dẫn apis
import { Hotel, RoomType } from "@/type";

const IMAGE_BASE_URL = "https://api.momangshow.vn/api/images";

interface HotelDetail extends Hotel {
  avatarUrl?: string;
  imageUrls?: string[];
}

const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // --- STATE ---
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  // State loại phòng đang chọn
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(
    null
  );

  // State giá tiền thực tế (Cập nhật từ API price)
  const [realtimePrice, setRealtimePrice] = useState<number>(0);
  const [isPriceLoading, setIsPriceLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- HÀM FETCH DATA ---
  const fetchHotelDetail = useCallback(
    async (showLoading = true) => {
      if (!id) return;
      try {
        if (showLoading) setLoading(true);
        const res: any = await hotelApi.getById(id);
        const data = res.data?.data || res.data;

        if (data) {
          const galleryIds = data.galleryImageIds || [];
          const urls =
            galleryIds.length > 0
              ? galleryIds.map((imgId: number) => `${IMAGE_BASE_URL}/${imgId}`)
              : ["https://placehold.co/800x600?text=No+Image"];

          const hotelData: HotelDetail = {
            ...data,
            imageUrl: urls[0],
            imageUrls: urls,
          };

          setHotel(hotelData);

          if (!activeImage) setActiveImage(urls[0]);

          // Logic chọn phòng mặc định
          if (data.roomTypes && data.roomTypes.length > 0) {
            // Nếu chưa chọn phòng nào thì chọn phòng đầu tiên
            if (!selectedRoomType) {
              setSelectedRoomType(data.roomTypes[0]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch hotel detail:", error);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [id, activeImage, selectedRoomType]
  );

  useEffect(() => {
    fetchHotelDetail(true);
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // --- EFFECT: LẤY GIÁ THEO NGÀY (LOGIC MỚI) ---
  useEffect(() => {
    const fetchRoomPrice = async () => {
      if (!id || !selectedRoomType) return;

      // 1. Set giá mặc định trước (tránh hiện 0đ)
      const defaultPrice =
        selectedRoomType.priceWeekday || selectedRoomType.pricePerNight || 0;
      setRealtimePrice(defaultPrice);

      try {
        setIsPriceLoading(true);
        // 2. Gọi API lấy giá realtime
        // URL: https://api.momangshow.vn/api/hotels/{id}/price?roomTypeCode={code}
        const res: any = await hotelApi.getRoomPrice(
          id,
          selectedRoomType.code || ""
        );

        const priceData = res.data?.data || res.data;

        // 3. Nếu có giá mới từ API thì cập nhật
        if (priceData && priceData.price) {
          setRealtimePrice(priceData.price);
        }
      } catch (error) {
        console.warn("Không lấy được giá realtime, dùng giá mặc định");
      } finally {
        setIsPriceLoading(false);
      }
    };

    fetchRoomPrice();
  }, [id, selectedRoomType]); // Chạy lại khi đổi khách sạn hoặc đổi loại phòng

  const handleBookingSuccess = () => {
    fetchHotelDetail(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Header />
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center py-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Không tìm thấy khách sạn
          </h2>
          <Link
            to="/"
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
          >
            Về trang chủ
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-orange-600">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium line-clamp-1">
            {hotel.name}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* === CỘT TRÁI === */}
          <div className="lg:w-2/3">
            {/* Gallery Ảnh */}
            <div className="bg-white p-2 rounded-xl shadow-sm mb-8">
              <div className="h-[300px] md:h-[450px] w-full mb-2 overflow-hidden rounded-lg bg-gray-100 relative group">
                <img
                  src={activeImage}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      "https://placehold.co/800x600?text=Image+Error")
                  }
                />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {hotel.imageUrls?.slice(0, 5).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`cursor-pointer h-16 md:h-20 rounded-md overflow-hidden border-2 transition-all ${
                      activeImage === img
                        ? "border-orange-500 opacity-100"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Gallery ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {hotel.name}
              </h1>

              <div className="flex items-center text-gray-600 mb-3 text-sm md:text-base">
                <FaMapMarkerAlt className="mr-2 text-orange-500 flex-shrink-0" />
                <span>{hotel.address}</span>
              </div>

              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < (hotel.rating || 5)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                      size={16}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  Tuyệt vời
                </span>
              </div>

              <hr className="my-6 border-gray-100" />

              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-orange-500 pl-3">
                  Giới thiệu
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {hotel.description ||
                    `Chào mừng bạn đến với ${hotel.name}. Tận hưởng kỳ nghỉ tuyệt vời với dịch vụ đẳng cấp và tiện nghi hiện đại.`}
                </p>
              </div>

              {/* Danh sách Loại phòng */}
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-orange-500 pl-3">
                  Chọn loại phòng
                </h2>
                <div className="space-y-4">
                  {hotel.roomTypes && hotel.roomTypes.length > 0 ? (
                    hotel.roomTypes.map((room) => (
                      <div
                        key={room.code}
                        onClick={() => setSelectedRoomType(room)}
                        className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                          selectedRoomType?.code === room.code
                            ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                            : "border-gray-200 hover:border-orange-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-800 text-lg">
                              {room.name}
                            </h3>
                            {selectedRoomType?.code === room.code && (
                              <FaCheckCircle className="text-orange-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500 flex flex-wrap gap-4">
                            <span className="flex items-center bg-gray-100 px-2 py-1 rounded">
                              <FaUserFriends className="mr-1 text-gray-400" />{" "}
                              {room.standardCapacity} người
                            </span>
                            <span className="flex items-center bg-gray-100 px-2 py-1 rounded">
                              <FaBed className="mr-1 text-gray-400" />{" "}
                              {room.totalRooms} phòng tổng
                            </span>
                          </div>
                        </div>

                        <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end">
                          <div className="text-xl font-bold text-orange-600">
                            {formatCurrency(
                              room.priceWeekday || room.pricePerNight
                            )}
                          </div>
                          <span className="text-xs text-gray-400">/ đêm</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                      Khách sạn này chưa cập nhật danh sách phòng.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* === CỘT PHẢI: BOOKING SUMMARY === */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24 border border-orange-100">
              <div className="mb-4 bg-gradient-to-r from-orange-50 to-white p-4 rounded-lg border border-orange-100">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                  Loại phòng đang chọn:
                </p>
                {selectedRoomType ? (
                  <p className="font-bold text-gray-900 text-lg">
                    {selectedRoomType.name}
                  </p>
                ) : (
                  <p className="text-sm text-red-500 italic">
                    Vui lòng chọn phòng ở bên trái
                  </p>
                )}
              </div>

              <div className="mb-6 flex justify-between items-end">
                <span className="text-gray-500 text-sm">Giá mỗi đêm</span>
                {/* HIỂN THỊ GIÁ REALTIME */}
                <span className="text-3xl font-bold text-orange-600 flex items-center">
                  {isPriceLoading ? (
                    // Skeleton loading cho giá
                    <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
                  ) : selectedRoomType ? (
                    formatCurrency(realtimePrice)
                  ) : (
                    "0 ₫"
                  )}
                </span>
              </div>

              <ul className="text-sm text-gray-500 space-y-2 mb-6 border-t border-gray-100 pt-4">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Đảm bảo giá tốt
                  nhất
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Không phí đặt chỗ
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Xác nhận tức thì
                </li>
              </ul>

              {/* Nút Đặt phòng */}
              <button
                onClick={() => {
                  if (selectedRoomType) setIsModalOpen(true);
                  else alert("Vui lòng chọn loại phòng trước!");
                }}
                disabled={
                  !selectedRoomType ||
                  selectedRoomType.totalRooms === 0 ||
                  isPriceLoading
                }
                className={`w-full font-bold py-4 px-4 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg shadow-orange-200
                ${
                  selectedRoomType &&
                  selectedRoomType.totalRooms > 0 &&
                  !isPriceLoading
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                {isPriceLoading
                  ? "Đang cập nhật giá..."
                  : selectedRoomType && selectedRoomType.totalRooms === 0
                  ? "Hết phòng"
                  : "ĐẶT PHÒNG NGAY"}
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                Bước tiếp theo: Nhập ngày & Thông tin khách hàng.
              </p>

              {/* --- MỤC CHIA SẺ --- */}
              <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
                <p className="text-xs font-bold text-gray-500 text-center mb-3 uppercase tracking-wide">
                  Chia sẻ khách sạn này
                </p>
                <div className="flex items-center justify-center gap-5">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:scale-110 transition-transform"
                    title="Chia sẻ lên Facebook"
                  >
                    <FaFacebook size={24} />
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:scale-110 transition-transform"
                    title="Chia sẻ lên Twitter"
                  >
                    <FaTwitter size={24} />
                  </a>

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

                  {/* Copy Link */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Đã sao chép liên kết!");
                    }}
                    className="text-gray-500 hover:scale-110 transition-transform hover:text-gray-700"
                    title="Sao chép liên kết"
                  >
                    <FaShareAlt size={22} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* --- MODAL ĐẶT PHÒNG --- */}
      {selectedRoomType && (
        <HotelBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          hotelId={hotel.id}
          roomTypeCode={selectedRoomType.code || ""}
          // 👇 QUAN TRỌNG: Truyền giá realtime vào modal để tính tiền
          pricePerNight={
            realtimePrice ||
            selectedRoomType.priceWeekday ||
            selectedRoomType.pricePerNight
          }
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Nút Zalo Float */}
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

export default HotelDetailPage;
