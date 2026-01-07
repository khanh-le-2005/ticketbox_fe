// src/pages/BookingPage.tsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import axiosClient from "../api/axiosClient";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorToast from "../components/ErrorToast";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBed,
  FaBuilding,
} from "react-icons/fa";
import { getImageUrl } from "../api/api_image";

// --- INTERFACE ---
interface ApiHotelResponse {
  id: string;
  name: string;
  address: string;
  description: string;
  galleryImageIds: number[];
  minPrice: number;
  roomTypes?: {
    code: string;
    name: string;
    totalRooms: number;
    priceWeekday: number;
  }[];
}

const locations = [
  "Tất cả", "Hà Nội", "TP. Hồ Chí Minh", "Phú Quốc", 
  "Hội An", "Đà Nẵng", "Nha Trang", "Huế", "Hạ Long"
];

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [hotels, setHotels] = useState<ApiHotelResponse[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<ApiHotelResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastError, setToastError] = useState("");

  // Search State
  const [selectedLocation, setSelectedLocation] = useState("Tất cả");

  const resultsRef = useRef<HTMLDivElement>(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      try {
        const res: any = await axiosClient.get("/hotels");
        let hotelList: ApiHotelResponse[] = [];
        
        if (res?.data?.content) hotelList = res.data.content;
        else if (Array.isArray(res?.data)) hotelList = res.data;
        else if (Array.isArray(res)) hotelList = res;

        setHotels(hotelList);
        setFilteredHotels(hotelList); 
      } catch (error) {
        console.error("Lỗi tải danh sách:", error);
        setToastError("Không thể tải danh sách khách sạn.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // --- HANDLERS ---
  const handleSearch = () => {
    if (selectedLocation === "Tất cả") {
        setFilteredHotels(hotels);
    } else {
        const filtered = hotels.filter(h => h.address.includes(selectedLocation));
        setFilteredHotels(filtered);
    }
    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleViewDetail = (hotelId: string) => {
    navigate(`/hotel/${hotelId}`);
  };

  const calculateTotalRooms = (roomTypes: any[]) => {
    return roomTypes?.reduce((sum, type) => sum + (type.totalRooms || 0), 0) || 0;
  };

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <Header />
      <Navbar />
      <ErrorToast message={toastError} isVisible={!!toastError} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* THANH TÌM KIẾM */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
            <FaBuilding className="text-orange-500 mr-3" /> Tìm Khách Sạn
          </h1>
          <div className="flex gap-4 items-end">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaMapMarkerAlt className="inline mr-2 text-gray-400" /> Chọn địa điểm
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleSearch}
              className="bg-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 shadow-md transition-all flex items-center gap-2"
            >
              <FaSearch /> Tìm Kiếm
            </button>
          </div>
        </div>

        {/* KẾT QUẢ TÌM KIẾM */}
        <div ref={resultsRef}>
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-gray-800">
                Khách sạn tại {selectedLocation} ({filteredHotels.length})
             </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white h-80 rounded-lg shadow animate-pulse"></div>
              ))}
            </div>
          ) : filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHotels.map((hotel) => {
                const totalRooms = calculateTotalRooms(hotel.roomTypes || []);
                const startPrice = hotel.minPrice || hotel.roomTypes?.[0]?.priceWeekday || 0;

                return (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col cursor-pointer"
                    onClick={() => handleViewDetail(hotel.id)}
                  >
                    {/* Ảnh bìa */}
                    <div className="h-56 bg-gray-200 relative overflow-hidden">
                      <img
                        src={hotel.galleryImageIds?.length > 0 ? getImageUrl(hotel.galleryImageIds[0]) : "https://placehold.co/600x400"}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center">
                        <FaBed className="mr-1.5 text-orange-400" /> {totalRooms} phòng
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                          {hotel.name}
                        </h3>
                      </div>

                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <FaMapMarkerAlt className="mr-1.5 text-orange-500 flex-shrink-0" />
                        <span className="line-clamp-1">{hotel.address}</span>
                      </div>

                      <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                        {hotel.description || "Khách sạn tiện nghi..."}
                      </p>

                      <div className="border-t border-gray-100 pt-4 flex items-end justify-between mt-auto">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Giá chỉ từ</p>
                          <p className="text-xl font-bold text-orange-600">
                            {new Intl.NumberFormat("vi-VN").format(startPrice)}
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
              <p className="text-gray-500 mt-2">Vui lòng thử địa điểm khác.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* 👇 FLOAT BUTTON ZALO (Giống trang chủ) 👇 */}
      <a
        href="https://zalo.me/0963310889" // ⚠️ Thay số Zalo của bạn
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
                Tư vấn đặt phòng
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
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

export default BookingPage;