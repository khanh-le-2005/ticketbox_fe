// src/pages/MyTicketsPage.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSearch,
  FaUser,
  FaQrcode,
  FaSignInAlt,
  FaHotel,
  FaMusic,
} from "react-icons/fa";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import BookingApi from "../api/bookingApi";
import FloatButton from "@/components/FloatButton";

// ĐỊNH NGHĨA LẠI INTERFACE DỰA TRÊN JSON BẠN GỬI
// Bạn nên cập nhật lại file ../type/Tickets.type tương tự như này
interface BookingItem {
  id: string;
  type: "HOTEL" | "SHOW";
  title: string;
  eventDate: string; // Tương ứng showTime hoặc checkInDate
  location: string;
  totalAmount: number;
  status: "CHECKED_OUT" | "CANCELLED" | "NON_ARRIVAL" | "CONFIRMED" | "PENDING";
  createdAt: string; // Tương ứng bookingDate
  checkInDate?: string;
  checkOutDate?: string;
  roomTypeName?: string;
  quantity: number;
  numberOfGuests?: number;
}

const MyTicketsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await BookingApi.getHistory();
      
      // JSON trả về: { success: true, data: { content: [...] } }
      if (res.success && res.data && Array.isArray(res.data.content)) {
        setTickets(res.data.content);
      } else {
        setTickets([]);
      }
    } catch (error: any) {
      console.error("Lỗi khi tải vé:", error);
      if (error === 401 || error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const generateQrCodeUrl = (data: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      data
    )}&margin=5`;

  // Helper function để hiển thị trạng thái đẹp hơn
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return { text: "ĐÃ ĐẶT", color: "bg-green-100 text-green-700" };
      case "CHECKED_OUT":
        return { text: "HOÀN THÀNH", color: "bg-blue-100 text-blue-700" };
      case "CANCELLED":
        return { text: "ĐÃ HỦY", color: "bg-red-100 text-red-700" };
      case "NON_ARRIVAL":
        return { text: "KHÔNG ĐẾN", color: "bg-gray-100 text-gray-600" };
      default:
        return { text: status, color: "bg-yellow-100 text-yellow-700" };
    }
  };

  const filteredTickets = tickets.filter(
    (t) =>
      (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.id && t.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8 border-b pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Lịch sử đặt vé</h1>
            <p className="text-gray-500 mt-1">
              Quản lý và xem lại lịch sử đặt vé khách sạn & show diễn của bạn.
            </p>
          </div>
          {user && (
            <button
              onClick={fetchHistory}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Làm mới
            </button>
          )}
        </div>

        {!user ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-orange-100 p-4 rounded-full mb-4">
              <FaUser className="text-4xl text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Bạn chưa đăng nhập
            </h2>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Vui lòng đăng nhập để xem lịch sử đặt vé.
            </p>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="flex items-center bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
              >
                <FaSignInAlt className="mr-2" /> Đăng nhập ngay
              </Link>
            </div>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <FaTicketAlt className="mx-auto text-6xl text-gray-200 mb-4" />
                <h2 className="text-xl font-semibold text-gray-600">
                  Bạn chưa có đơn hàng nào
                </h2>
                <Link
                  to="/"
                  className="mt-6 inline-block bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Đặt ngay
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative max-w-md mb-6">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo tên hoặc mã đơn..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>

                {filteredTickets.map((ticket) => {
                  const statusInfo = getStatusDisplay(ticket.status);
                  
                  return (
                    <div
                      key={ticket.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow"
                    >
                      {/* Cột Icon phân loại (HOTEL/SHOW) */}
                      <div className="w-full md:w-32 bg-gray-100 flex flex-col items-center justify-center text-gray-400 p-4 border-r border-gray-100">
                        {ticket.type === "HOTEL" ? (
                          <>
                            <FaHotel size={32} className="text-blue-500 mb-2" />
                            <span className="text-xs font-bold text-blue-600">HOTEL</span>
                          </>
                        ) : (
                          <>
                            <FaMusic size={32} className="text-pink-500 mb-2" />
                            <span className="text-xs font-bold text-pink-600">SHOW</span>
                          </>
                        )}
                      </div>

                      {/* Thông tin chính */}
                      <div className="p-5 flex-grow flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono font-bold">
                              #{ticket.id.slice(-6).toUpperCase()}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${statusInfo.color}`}
                            >
                              {statusInfo.text}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            Ngày đặt: {formatDate(ticket.createdAt)}
                          </span>
                        </div>

                        {/* Title (Thay vì showName) */}
                        <h3 className="text-xl font-bold text-indigo-700 mb-1">
                          {ticket.title}
                        </h3>

                        {/* Chi tiết theo loại */}
                        <div className="text-sm text-gray-600 space-y-2 mb-3 mt-2">
                          <p className="flex items-center text-gray-700">
                            <FaCalendarAlt className="mr-2 text-orange-500" />
                            <span className="font-medium">
                              {/* Sử dụng eventDate */}
                              {formatDate(ticket.eventDate)}
                              {ticket.checkOutDate && ` - ${formatDate(ticket.checkOutDate).split(' ')[1]}`} 
                            </span>
                          </p>
                          <p className="flex items-start">
                            <FaMapMarkerAlt className="mr-2 text-orange-500 mt-1 flex-shrink-0" />
                            {/* Sử dụng location */}
                            <span>{ticket.location}</span>
                          </p>
                          
                          {/* Hiển thị thêm loại phòng nếu là khách sạn */}
                          {ticket.type === "HOTEL" && ticket.roomTypeName && (
                             <p className="text-gray-500 italic pl-6">
                               Loại phòng: {ticket.roomTypeName}
                             </p>
                          )}
                        </div>

                        <div className="mt-auto pt-3 border-t flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {ticket.quantity} vé/phòng • {ticket.numberOfGuests || 1} khách
                          </span>
                          <span className="text-orange-600 font-bold text-lg">
                            {formatCurrency(ticket.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* QR Code (Chỉ hiện khi CONFIRMED hoặc CHECKED_OUT) */}
                      {(ticket.status === "CONFIRMED" || ticket.status === "CHECKED_OUT") && (
                        <div className="p-4 bg-gray-50 border-l flex flex-col items-center justify-center min-w-[150px]">
                          <div className="bg-white p-1 rounded shadow-sm mb-2">
                            <img
                              src={generateQrCodeUrl(ticket.id)}
                              alt="QR"
                              className="w-24 h-24"
                            />
                          </div>
                          <span className="text-xs text-gray-500">Mã vé</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
      <FloatButton />
    </div>
  );
};

export default MyTicketsPage;