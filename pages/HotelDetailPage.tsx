import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaMapMarkerAlt, FaStar, FaCheckCircle, FaUserFriends, FaBed,
  FaFacebook, FaTwitter, FaShareAlt, FaChevronLeft, FaChevronRight,
  FaTimes, FaPhone, FaCalendarAlt
} from "react-icons/fa";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HotelBookingModal from "../components/HotelBookingModal";
import hotelApi from "@/api/hotelApi";
import { RoomType, HotelDetail } from "@/type";
import FloatButton from "../components/FloatButton";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode, EffectFade, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/effect-fade';
import type { Swiper as SwiperType } from 'swiper';
import { toast } from 'react-toastify';

const IMAGE_BASE_URL = "https://api.momangshow.vn/api/images";

const HotelDetailPage: React.FC = () => {
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const { id } = useParams<{ id: string }>();

  // --- STATE ---
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [realtimePrice, setRealtimePrice] = useState<number>(0);

  // --- DATES STATE ---
  const [checkIn, setCheckIn] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, number>>({});
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);

  // --- HELPER: FORMAT TIỀN TỆ ---
  const formatCurrency = (amount: number | undefined | null) => {
    const safeAmount = Number(amount) || 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(safeAmount);
  };

  // --- HELPER: LẤY GIÁ HIỂN THỊ ---
  const getDisplayPrice = useCallback((room: RoomType | null) => {
    if (!room) return 0;
    return room.priceMonToThu || room.priceWeekday || room.pricePerNight || 0;
  }, []);

  // --- 1. FETCH DATA ---
  const fetchHotelDetail = useCallback(async (showLoading = true) => {
    if (!id) return;
    try {
      if (showLoading) setLoading(true);
      const res: any = await hotelApi.getById(id);
      const data = res.data?.data || res.data;

      if (data) {
        const galleryIds = data.galleryImageIds || [];
        const urls = galleryIds.length > 0
          ? galleryIds.map((imgId: number) => `${IMAGE_BASE_URL}/${imgId}`)
          : ["https://placehold.co/800x600?text=No+Image"];

        const hotelData: HotelDetail = { ...data, imageUrl: urls[0], imageUrls: urls };
        setHotel(hotelData);


        if (data.roomTypes && data.roomTypes.length > 0) {
          setSelectedRoomType((prev) => {
            if (prev) {
              const updatedRoom = data.roomTypes.find((r: RoomType) => r.code === prev.code);
              return updatedRoom || data.roomTypes[0];
            }
            return data.roomTypes[0];
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHotelDetail(true);
    window.scrollTo(0, 0);
  }, [fetchHotelDetail]);

  // --- 2. GET REALTIME PRICE ---
  useEffect(() => {
    const fetchRoomPrice = async () => {
      if (!id || !selectedRoomType) return;

      setRealtimePrice(getDisplayPrice(selectedRoomType));

      try {
        setIsPriceLoading(true);
        const res: any = await hotelApi.getRoomPrice(id, selectedRoomType.code || "");
        const priceData = res.data?.data || res.data;

        if (priceData && typeof priceData.price === 'number' && priceData.price > 0) {
          setRealtimePrice(priceData.price);
        }
      } catch (error) {
        // Silent error
      } finally {
        setIsPriceLoading(false);
      }
    };
    fetchRoomPrice();
  }, [id, selectedRoomType, getDisplayPrice]);

  // --- 3. FETCH AVAILABILITY ---
  const fetchAllAvailability = useCallback(async () => {
    if (!id || !hotel?.roomTypes || hotel.roomTypes.length === 0) return;

    try {
      setIsAvailabilityLoading(true);
      const results: Record<string, number> = {};

      // Gọi API checking cho từng loại phòng
      const promises = hotel.roomTypes.map(async (room) => {
        try {
          const res: any = await hotelApi.checkAvailability(id, room.code || "", checkIn, checkOut);
          const data = res.data?.data || res.data;
          if (data && typeof data.availableRooms === 'number') {
            results[room.code || ""] = data.availableRooms;
          } else if (data && typeof data.remainingRooms === 'number') {
            results[room.code || ""] = data.remainingRooms;
          }
        } catch (error) {
          console.warn("Failed to check availability for", room.code);
        }
      });

      await Promise.all(promises);
      setAvailabilityMap(results);
    } catch (error) {
      console.error("Error fetching all availability:", error);
    } finally {
      setIsAvailabilityLoading(false);
    }
  }, [id, hotel?.roomTypes, checkIn, checkOut]);

  useEffect(() => {
    fetchAllAvailability();
  }, [fetchAllAvailability]);

  const handleBookingSuccess = () => {
    fetchHotelDetail(false);
    fetchAllAvailability();
  };

  // Gallery handlers
  const openLightbox = (index: number) => { setPhotoIndex(index); setIsGalleryOpen(true); };
  const closeLightbox = () => setIsGalleryOpen(false);
  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hotel?.imageUrls) setPhotoIndex((prev) => (prev + 1) % hotel.imageUrls!.length);
  };
  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hotel?.imageUrls) setPhotoIndex((prev) => (prev - 1 + hotel.imageUrls!.length) % hotel.imageUrls!.length);
  };

  if (loading) return <div className="bg-gray-50 min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;
  if (!hotel) return <div className="text-center py-20">Không tìm thấy khách sạn</div>;

  const images = hotel.imageUrls || [];

  return (
    // <div className="bg-gray-50 min-h-screen font-sans">
    //   <Header />
    //   <Navbar />
    <div className="bg-gray-50 min-h-screen relative">
      <Header />

      {/* 👇 SỬA ĐOẠN NÀY: Ẩn Navbar trên mobile để không bị trùng 2 menu */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-orange-600">Trang chủ</Link> /
          <span className="text-gray-800 font-medium line-clamp-1">{hotel.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* CỘT TRÁI */}
          <div className="lg:w-2/3">
            {/* Gallery */}
            <div className="bg-white p-2 rounded-xl shadow-sm mb-8 overflow-hidden">
              <div className="relative group">
                <Swiper
                  onSwiper={setMainSwiper}
                  style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                  } as React.CSSProperties}
                  spaceBetween={10}
                  // navigation={true}
                  speed={1500}
                  effect={'fade'}
                  fadeEffect={{ crossFade: true }}
                  autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                  }}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  modules={[FreeMode, Navigation, Thumbs, EffectFade, Autoplay]}
                  className="h-[300px] md:h-[500px] w-full rounded-lg mb-2"
                  onClick={() => {
                    if (mainSwiper) openLightbox(mainSwiper.activeIndex);
                  }}
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx} className="cursor-pointer">
                      <img
                        src={img}
                        alt={`${hotel.name} - ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => (e.target as HTMLImageElement).src = "https://placehold.co/800x600?text=No+Image"}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {images.length > 1 && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={5}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="thumbs-swiper h-20 md:h-28"
                  breakpoints={{
                    320: { slidesPerView: 4, spaceBetween: 8 },
                    768: { slidesPerView: 5, spaceBetween: 10 }
                  }}
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx} className="cursor-pointer rounded-lg overflow-hidden border-2 transition-all border-transparent [.swiper-slide-thumb-active_&]:border-orange-500 [.swiper-slide-thumb-active_&]:ring-1 [.swiper-slide-thumb-active_&]:ring-orange-200">
                      <img src={img} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            {/* Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
              <div className="flex items-center text-gray-600 mb-3"><FaMapMarkerAlt className="mr-2 text-orange-500" />{hotel.address}</div>
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mr-2">{[...Array(5)].map((_, i) => <FaStar key={i} size={16} className={i < (hotel.rating || 5) ? "" : "text-gray-300"} />)}</div>
                <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">Tuyệt vời</span>
              </div>
              <hr className="my-6 border-gray-100" />

              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-orange-500 pl-3">Giới thiệu</h2>
                {/* --- GIỮ FIX LỖI MẤT DÒNG --- */}
                <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {hotel.description}
                </p>
              </div>

              {/* Danh sách Loại phòng */}
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-dashed border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 border-l-4 border-orange-500 pl-3">Chọn loại phòng</h2>

                  <div className="flex flex-wrap items-center gap-3 bg-orange-50 p-3 rounded-lg border border-orange-100 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-orange-500" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-orange-800 uppercase">Nhận phòng</span>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="bg-transparent text-sm font-bold outline-none text-gray-700"
                        />
                      </div>
                    </div>
                    <div className="h-8 w-px bg-orange-200 hidden md:block"></div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-orange-500" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-orange-800 uppercase">Trả phòng</span>
                        <input
                          type="date"
                          value={checkOut}
                          min={checkIn}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="bg-transparent text-sm font-bold outline-none text-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {hotel.roomTypes?.map((room) => (
                    <div
                      key={room.code}
                      onClick={() => setSelectedRoomType(room)}
                      className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col sm:flex-row justify-between gap-4 ${selectedRoomType?.code === room.code ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500" : "border-gray-200 hover:border-orange-300 hover:shadow-md"}`}
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                          {room.name} {selectedRoomType?.code === room.code && <span className="text-orange-500"><FaCheckCircle /></span>}
                        </h3>
                        <div className="text-sm text-gray-500 mt-2 flex flex-wrap gap-3">
                          <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border shadow-sm"><FaUserFriends className="text-gray-400" /> {room.standardCapacity} người</span>
                          {isAvailabilityLoading ? (
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border animate-pulse text-xs italic">Đang kiểm tra...</span>
                          ) : availabilityMap[room.code || ""] !== undefined ? (
                            <span className={`flex items-center gap-1 px-2 py-1 rounded border shadow-sm font-bold ${availabilityMap[room.code || ""] > 0 ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                              <span className={availabilityMap[room.code || ""] > 0 ? "text-green-500" : "text-red-500"}><FaBed /></span>
                              {availabilityMap[room.code || ""] > 0 && availabilityMap[room.code || ""] < 5
                                ? `Chỉ còn ${availabilityMap[room.code || ""]} phòng!`
                                : `Còn ${availabilityMap[room.code || ""]} phòng`
                              }
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border shadow-sm"><FaBed className="text-gray-400" /> Tổng {room.totalRooms} phòng</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-orange-600">
                          {formatCurrency(getDisplayPrice(room))}
                        </div>
                        <span className="text-xs text-gray-400">/ đêm (Từ T2-T5)</span>
                      </div>
                    </div>
                  ))}
                  {(!hotel.roomTypes || hotel.roomTypes.length === 0) && (
                    <div className="p-6 text-center bg-gray-50 border border-dashed rounded-lg text-gray-500">Chưa có thông tin phòng.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: BOOKING SUMMARY */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24 border border-orange-100">
              <div className="mb-4 bg-orange-50 p-4 rounded-lg border border-orange-100">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Loại phòng đang chọn:</p>
                {selectedRoomType ? (
                  <p className="font-bold text-gray-900 text-lg line-clamp-2">{selectedRoomType.name}</p>
                ) : (
                  <p className="text-sm text-red-500 italic">Vui lòng chọn phòng bên trái</p>
                )}
              </div>

              <div className="mb-6 flex justify-between items-end">
                <span className="text-gray-500 text-sm">Giá tham khảo</span>
                <span className="text-3xl font-bold text-orange-600 flex items-center">
                  {isPriceLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
                  ) : (
                    formatCurrency(realtimePrice > 0 ? realtimePrice : getDisplayPrice(selectedRoomType))
                  )}
                </span>
              </div>

              <ul className="text-sm text-gray-500 space-y-2 mb-6 border-t border-gray-100 pt-4">
                <li className="flex items-center gap-2"><span className="text-green-500"><FaCheckCircle /></span> Đảm bảo giá tốt nhất</li>
                <li className="flex items-center gap-2"><span className="text-green-500"><FaCheckCircle /></span> Không phí đặt chỗ</li>
                <li className="flex items-center gap-2"><span className="text-green-500"><FaCheckCircle /></span> Xác nhận tức thì</li>
              </ul>

              <button
                onClick={() => {
                  if (selectedRoomType) setIsModalOpen(true);
                  else toast.error("Vui lòng chọn loại phòng trước!");
                }}
                disabled={!selectedRoomType || (availabilityMap[selectedRoomType.code || ""] === 0)}
                className={`w-full font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-orange-200 hover:-translate-y-1
                ${selectedRoomType && availabilityMap[selectedRoomType.code || ""] !== 0 ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:to-orange-700" : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"}`}
              >
                {selectedRoomType && availabilityMap[selectedRoomType.code || ""] === 0 ? "HẾT PHÒNG" : "ĐẶT PHÒNG NGAY"}
              </button>

              {/* CHIA SẺ */}
              {/* <div className="mt-8 pt-6 border-t border-dashed border-gray-200 text-center">
                <p className="text-xs font-bold text-gray-500 uppercase mb-3">CHIA SẺ KHÁCH SẠN NÀY</p>
                <div className="flex justify-center gap-4">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" className="text-blue-600 hover:scale-110 transition"><FaFacebook size={24} /></a>
                  <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target="_blank" className="text-blue-400 hover:scale-110 transition"><FaTwitter size={24} /></a>
                  <button className="text-gray-500 hover:scale-110 transition" onClick={() => navigator.clipboard.writeText(window.location.href)}><FaShareAlt size={22} /></button>
                  <a href="https://zalo.me/share" target="_blank" className="hover:scale-110 transition flex items-center justify-center rounded-full"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px"><path fill="#2962ff" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M33.96,22.189c-0.342-0.129-2.071-1.021-2.392-1.139c-0.321-0.118-0.554-0.183-0.787,0.183c-0.233,0.366-0.904,1.139-1.11,1.372c-0.205,0.233-0.41,0.265-0.752,0.136c-0.342-0.129-1.446-0.531-2.755-1.7c-1.021-0.91-1.722-2.04-1.927-2.392c-0.205-0.353-0.021-0.547,0.108-0.712c-0.118-0.021-0.265-0.342-0.375-0.46c-0.108-0.118-0.224-0.129-0.342-0.129h-0.342c-0.118,0-0.332,0.053-0.497,0.256c-0.165,0.205-0.635,0.635-0.791,1.579c-0.156,0.945-0.032,1.821,0.021,1.968c0.053,0.147,0.321,0.769,0.421,0.954c0.108,0.185,0.224,0.41,0.342,0.575c0.118,0.165,0.205,0.265,0.321,0.431c0.118,0.165,0.214,0.353,0.353,0.554c0.139,0.205,0.296,0.449,0.471,0.672c0.175,0.224,0.431,0.522,0.742,0.778c0.311,0.256,0.662,0.522,1.065,0.745c0.402,0.224,0.881,0.421,1.435,0.554c0.554,0.139,1.196,0.108,1.751-0.075c0.554-0.185,1.527-0.752,1.74-1.424c0.214-0.672-0.108-1.054-0.214-1.164C34.507,22.422,34.209,22.283,33.96,22.189z"></path></svg></a>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Lightbox */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center animate-in fade-in">
          <button onClick={closeLightbox} className="absolute top-5 right-5 text-white p-2 hover:bg-white/10 rounded-full"><FaTimes size={30} /></button>
          <button onClick={prevPhoto} className="absolute left-4 md:left-8 text-white p-3 hover:bg-white/10 rounded-full"><FaChevronLeft size={40} /></button>
          <button onClick={nextPhoto} className="absolute right-4 md:right-8 text-white p-3 hover:bg-white/10 rounded-full"><FaChevronRight size={40} /></button>
          <div className="p-4 w-full max-w-5xl flex justify-center">
            <img src={images[photoIndex]} className="max-h-[85vh] max-w-full rounded shadow-2xl object-contain" alt="Gallery" />
          </div>
        </div>
      )}

      {/* --- GIỮ FIX TRUYỀN GIÁ CHUẨN VÀO MODAL --- */}
      {/* {selectedRoomType && (
        <HotelBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          hotelId={hotel.id}
          roomTypeCode={selectedRoomType.code || ""}
          priceConfig={{
              priceMonToThu: selectedRoomType.priceMonToThu || 0,
              priceFriday: selectedRoomType.priceFriday || 0,
              priceSaturday: selectedRoomType.priceSaturday || 0,
              priceSunday: selectedRoomType.priceSunday || 0
          }}
          onSuccess={handleBookingSuccess}
        />
      )} */}
      {selectedRoomType && (
        <HotelBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}

          hotelId={hotel?.id || ""}
          roomTypeCode={selectedRoomType?.code || ""}

          standardCapacity={selectedRoomType?.standardCapacity || 2}
          maxCapacity={selectedRoomType?.maxCapacity || 4}

          priceConfig={{
            priceMonToThu: selectedRoomType?.priceMonToThu || 0,
            priceFriday: selectedRoomType?.priceFriday || 0,
            priceSaturday: selectedRoomType?.priceSaturday || 0,
            priceSunday: selectedRoomType?.priceSunday || 0,
            surchargeSunToThu: selectedRoomType?.surchargeSunToThu || 0,
            surchargeFriSat: selectedRoomType?.surchargeFriSat || 0
          }}

          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          onSuccess={handleBookingSuccess}
        />
      )}
      <FloatButton />
    </div>
  );
};

export default HotelDetailPage;