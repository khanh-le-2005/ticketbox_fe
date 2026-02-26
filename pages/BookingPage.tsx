// src/pages/BookingPage.tsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import hotelApi from "../api/hotelApi";
import Header from "../components/Header";
// import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorToast from "../components/ErrorToast";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBed,
  FaBuilding,
  FaCalendarAlt
} from "react-icons/fa";
import { getImageUrl } from "../api/api_image";
import { ApiHotelResponse } from "../type/hotel.type";
import FloatButton from "@/components/FloatButton";

const BookingPage: React.FC = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [hotels, setHotels] = useState<ApiHotelResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastError, setToastError] = useState("");
  // Giá theo ngày: key = hotelId_checkInDate
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});

  // --- SEARCH STATE ---
  const [keyword, setKeyword] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const resultsRef = useRef<HTMLDivElement>(null);

  // Helper: Lấy ngày hôm nay YYYY-MM-DD
  const getToday = () => new Date().toISOString().split('T')[0];

  // Helper: Format tiền tệ
  const formatCurrency = (amount: number | undefined | null) => {
    const safeAmount = Number(amount) || 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(safeAmount);
  };

  // --- 1. HÀM TẢI DANH SÁCH MẶC ĐỊNH (GET ALL) ---
  const fetchDefaultHotels = async () => {
    setIsLoading(true);
    try {
      const res: any = await hotelApi.getAll({ page: 0, size: 20 });

      let hotelList: ApiHotelResponse[] = [];
      if (res?.data?.content) {
        hotelList = res.data.content;
      } else if (Array.isArray(res?.data)) {
        hotelList = res.data;
      } else if (Array.isArray(res)) {
        hotelList = res;
      }

      setHotels(hotelList);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
      setToastError("Không thể tải danh sách khách sạn.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHotelPriceByDate = async (
    hotelId: string,
    roomTypeCode: string,
    date: string
  ) => {
    try {
      const res: any = await hotelApi.getRoomPrice(hotelId, roomTypeCode, date);
      // axiosClient trả về response.data, nên res lúc này là ApiResponse
      const data = res?.data;

      if (data?.price && typeof data.price === "number") {
        setPriceMap((prev) => ({
          ...prev,
          [`${hotelId}_${date}`]: data.price,
        }));
      }
    } catch (err) {
      console.warn("Không lấy được giá theo ngày:", hotelId, err);
    }
  };

  // --- 2. HÀM TÌM KIẾM (SEARCH) ---
  const handleSearch = async () => {
    // Nếu không nhập gì cả -> Gọi lại Default
    if (!keyword.trim() && (!checkInDate || !checkOutDate)) {
      fetchDefaultHotels();
      return;
    }

    setIsLoading(true);
    try {
      const params: any = {};
      if (keyword.trim()) params.q = keyword.trim();

      if (checkInDate && checkOutDate) {
        if (new Date(checkOutDate) <= new Date(checkInDate)) {
          setToastError("Ngày trả phòng phải sau ngày nhận phòng.");
          setIsLoading(false);
          return;
        }
        params.checkIn = checkInDate;
        params.checkOut = checkOutDate;
      }

      // Gọi API Search
      const res: any = await hotelApi.search(params);

      let hotelList: ApiHotelResponse[] = [];

      // Xử lý các cấu trúc response khác nhau
      if (res?.success && Array.isArray(res.data)) {
        hotelList = res.data;
      } else if (Array.isArray(res?.data)) {
        hotelList = res.data;
      } else if (res?.data?.content) {
        hotelList = res.data.content;
      } else if (Array.isArray(res)) {
        hotelList = res;
      }

      setHotels(hotelList);
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setToastError("Lỗi khi tìm kiếm khách sạn.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- EFFECT: Load lần đầu ---
  useEffect(() => {
    fetchDefaultHotels();
  }, []);
  useEffect(() => {
    if (!checkInDate || hotels.length === 0) return;

    hotels.forEach((hotel) => {
      const firstRoomType = hotel.roomTypes?.[0];
      if (!firstRoomType) return;

      const key = `${hotel.id}_${checkInDate}`;
      if (priceMap[key]) return; // đã có thì không gọi lại

      fetchHotelPriceByDate(
        hotel.id,
        firstRoomType.code,
        checkInDate
      );
    });
  }, [checkInDate, hotels]);

  const handleViewDetail = (identifier: string) => {
    navigate(`/hotel/${identifier}`);
  };

  const toSlug = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const calculateTotalRooms = (roomTypes: any[]) => {
    return roomTypes?.reduce((sum, type) => sum + (type.totalRooms || 0), 0) || 0;
  };

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <Header />
      <div className="hidden lg:block">
        {/* <Navbar /> */}
      </div>
      <ErrorToast message={toastError} isVisible={!!toastError} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- THANH TÌM KIẾM --- */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-3">
            <span className="text-orange-500"><FaBuilding /></span> Tìm Khách Sạn
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-end">
            {/* 1. Từ khóa */}
            <div className="md:col-span-5 relative">
              <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Điểm đến / Tên khách sạn</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-orange-500">
                  <FaMapMarkerAlt />
                </div>
                <input
                  type="text"
                  placeholder="VD: Đà Nẵng, Hilton..."
                  className="w-full pl-10 pr-4 h-[50px] border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* 2. Ngày nhận - Đã Fix lỗi MacBook */}
            <div className="md:col-span-3 relative">
              <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Nhận phòng</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-orange-500" />
                </div>
                <input
                  type="date"
                  min={getToday()}
                  className="w-full pl-10 pr-4 h-[50px] border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm flex items-center"
                  style={{ WebkitAppearance: 'none', display: 'flex', alignItems: 'center' }}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  onClick={(e) => (e.target as any).showPicker?.()}
                />
              </div>
            </div>

            {/* 3. Ngày trả - Đã Fix lỗi MacBook */}
            <div className="md:col-span-3 relative">
              <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Trả phòng</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-orange-500" />
                </div>
                <input
                  type="date"
                  min={checkInDate || getToday()}
                  className="w-full pl-10 pr-4 h-[50px] border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm flex items-center"
                  style={{ WebkitAppearance: 'none', display: 'flex', alignItems: 'center' }}
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  onClick={(e) => (e.target as any).showPicker?.()}
                />
              </div>
            </div>

            {/* 4. Nút Tìm kiếm */}
            <div className="md:col-span-1">
              <button
                onClick={handleSearch}
                className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 shadow-md transition-all flex items-center justify-center gap-2 h-[50px]"
              >
                <FaSearch />
              </button>
            </div>
          </div>
        </div>

        {/* --- KẾT QUẢ TÌM KIẾM --- */}
        <div ref={resultsRef}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Danh sách khách sạn ({hotels.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white h-80 rounded-lg shadow animate-pulse"></div>
              ))}
            </div>
          ) : hotels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel) => {
                const totalRooms = calculateTotalRooms(hotel.roomTypes || []);

                const priceKey = `${hotel.id}_${checkInDate}`;

                // Logic giá: Ưu tiên giá theo ngày (priceMap), sau đó là minPrice của khách sạn
                const startPrice =
                  (checkInDate && priceMap[priceKey])
                    ? priceMap[priceKey]
                    : (hotel.minPrice || 0);

                const availableRoomCount = hotel.roomTypes?.reduce((acc, rt: any) => acc + (rt.availableRooms ?? rt.totalRooms), 0);
                const isCheckDateMode = checkInDate && checkOutDate;

                return (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col cursor-pointer"
                    onClick={() => {
                      const slugValue = hotel.slug || toSlug(hotel.name || "");
                      handleViewDetail(slugValue || hotel.id);
                    }}
                  >
                    {/* Ảnh bìa */}
                    <div className="h-56 bg-gray-200 relative overflow-hidden">
                      <img
                        src={hotel.galleryImageIds?.length > 0 ? getImageUrl(hotel.galleryImageIds[0]) : "https://placehold.co/600x400"}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center">
                        <span className="text-orange-400 mr-1.5"><FaBed /></span>
                        {isCheckDateMode && availableRoomCount !== undefined
                          ? `Còn ${availableRoomCount} phòng`
                          : `${totalRooms} phòng`}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors mb-2">
                        {hotel.name}
                      </h3>

                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <span className="text-orange-500 mr-1.5 flex-shrink-0"><FaMapMarkerAlt /></span>
                        <span className="line-clamp-1">{hotel.address}</span>
                      </div>

                      <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                        {hotel.description || "Khách sạn tiện nghi..."}
                      </p>

                      <div className="border-t border-gray-100 pt-4 flex items-end justify-between mt-auto">
                        <div>
                          <p className="text-x text-red-600 mb-0.5 animate-pulse">
                            🔥 Giá chỉ từ
                          </p>
                          <p className="text-xl font-bold text-orange-600">
                            {formatCurrency(startPrice)}
                            <span className="text-sm text-gray-500 font-normal ml-1">₫</span>
                          </p>
                        </div>
                        <button className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors text-sm">
                          Xem ngay
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-400">Không tìm thấy khách sạn nào</h3>
              <p className="text-gray-500 mt-2">Vui lòng thử từ khóa hoặc ngày khác.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FloatButton />
    </div>
  );
};

export default BookingPage;
