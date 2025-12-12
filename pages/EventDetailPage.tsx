// src/pages/EventDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaFacebook, FaTwitter, FaEnvelope, FaShareAlt } from 'react-icons/fa';

// Import API
import showApi from '../api/showApi';

// --- ĐƯỜNG DẪN ẢNH GỐC ---
const API_IMAGE_BASE = "https://api.momangshow.vn/api/images";

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Gọi API lấy chi tiết show
        const response = await showApi.getShowById(id);
        const showData = response.data;

        // --- XỬ LÝ ẢNH (Logic mới) ---
        let imageUrl = 'https://placehold.co/1200x500?text=No+Banner'; // Ảnh mặc định
        
        if (showData.images && showData.images.length > 0) {
            const firstImg = showData.images[0];
            let imageId = "";

            if (typeof firstImg === 'object' && firstImg !== null) {
                imageId = firstImg.imageFileId || firstImg.id;
            } else {
                imageId = String(firstImg);
            }

            if (imageId && !imageId.includes("object")) {
                imageUrl = `${API_IMAGE_BASE}/${imageId}`;
            }
        }

        // --- XỬ LÝ ĐỊA CHỈ ---
        const addr = showData.address || {};
        const fullLocation = addr.fullAddress || 
            [addr.specificAddress, addr.ward, addr.district, addr.province].filter(Boolean).join(", ");

        // Cập nhật state
        setEvent({
            ...showData,
            image: imageUrl, // Gán link ảnh đã xử lý
            fullLocation: fullLocation
        });

      } catch (error) {
        console.error("Failed to fetch event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

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
        {/* --- BANNER ẢNH (Đã sửa) --- */}
        <div className="relative w-full h-[300px] md:h-[450px] bg-gray-900 overflow-hidden">
             {/* Lớp nền mờ (Blur) */}
            <div 
                className="absolute inset-0 bg-cover bg-center blur-sm opacity-50 scale-110"
                style={{ backgroundImage: `url('${event.image}')` }}
            ></div>
            
            {/* Ảnh chính hiển thị rõ */}
            <div className="absolute inset-0 flex justify-center items-center p-4">
                 <img 
                    src={event.image} 
                    alt={event.name} 
                    className="h-full w-auto max-w-full object-contain shadow-2xl rounded-md"
                    onError={(e) => e.currentTarget.src = 'https://placehold.co/1200x500?text=No+Image'}
                 />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-20 relative z-10">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Cột trái: Thông tin chính */}
            <div className="p-6 md:p-8 md:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.name}</h1>
              
              <div className="flex flex-wrap gap-6 text-gray-600 mb-6 text-sm md:text-base">
                <div className="flex items-center">
                  <FaClock className="mr-2 text-indigo-600" />
                  <span>{eventDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-indigo-600" />
                  <span>{eventDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-indigo-600 flex-shrink-0" />
                  <span>{event.fullLocation || "Đang cập nhật"}</span>
                </div>
              </div>

              <div className="prose max-w-none text-gray-700">
                <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase border-l-4 border-indigo-500 pl-3">Giới thiệu về sự kiện</h3>
                <p className="whitespace-pre-line leading-relaxed">
                  {event.description || "Chưa có mô tả chi tiết cho sự kiện này."}
                </p>
                <br/>
                <p><strong>Nghệ sĩ tham gia:</strong> {event.performers || "Đang cập nhật"}</p>
              </div>
              
              {/* Hình ảnh minh họa thêm (nếu có) - Code tạm */}
              <div className="mt-8">
                 {/* Bạn có thể thêm logic hiển thị thêm các ảnh khác trong mảng images tại đây */}
              </div>
            </div>

            {/* Cột phải: Sidebar đặt vé */}
            <div className="bg-gray-50 p-6 md:p-8 md:w-1/3 border-l border-gray-100 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Chia sẻ</h3>
                <div className="flex gap-4">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors"><FaFacebook size={24} /></button>
                  <button className="text-blue-400 hover:text-blue-600 transition-colors"><FaTwitter size={24} /></button>
                  <button className="text-gray-600 hover:text-gray-800 transition-colors"><FaEnvelope size={24} /></button>
                  <button className="text-gray-600 hover:text-gray-800 transition-colors"><FaShareAlt size={24} /></button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6">
                 <p className="text-xs text-gray-500 mb-1">Liên hệ bộ phận chăm sóc khách hàng</p>
                 <p className="text-sm text-gray-800 font-medium mb-1">✉ Email: hotro@momangshow.vn</p>
                 <p className="text-sm text-gray-800 font-medium">📞 Vui lòng gọi: <span className="text-orange-600 font-bold">1900 1234</span></p>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg shadow-lg transform transition hover:scale-105 flex justify-center items-center text-lg uppercase"
                >
                  Mua vé ngay
                </button>
                <p className="text-center text-xs text-gray-500 mt-2">Cam kết hoàn tiền 100% nếu sự kiện bị hủy</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal Đặt vé */}
      {event && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          event={{
              id: event.id,
              title: event.name,
              date: { // Map tạm để khớp với BookingModal cũ nếu cần, hoặc sửa BookingModal sau
                  day: eventDate.getDate(),
                  month: eventDate.toLocaleString('default', { month: 'short' }),
                  year: eventDate.getFullYear()
              },
              time: eventDate.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}),
              location: event.fullLocation,
              ticketTiers: event.ticketTypes?.map((t: any) => ({
                  name: t.name,
                  price: t.price,
                  available: t.totalQuantity - (t.soldQuantity || 0)
              })) || []
          }}
        />
      )}
    </div>
  );
};

export default EventDetailPage;