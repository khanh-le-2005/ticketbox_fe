// src/pages/MyTicketsPage.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaMapMarkerAlt, FaCalendarAlt, FaSearch, FaUser, FaQrcode, FaSignInAlt } from 'react-icons/fa';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth'; 
import BookingApi from '../api/bookingApi'; 
// Đảm bảo BookingApi.getHistory() gọi đúng: axiosClient.get('/bookings/my-history');

interface TicketItem {
    id: string; // Booking ID gốc
    showName: string;
    showTime: string;
    address: string;
    totalAmount: number;
    status: string;
    bookingDate: string;
}

const MyTicketsPage: React.FC = () => {
    const { user } = useAuth(); // Lấy user từ Context
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<TicketItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Hàm gọi API lấy dữ liệu
    const fetchHistory = async () => {
        // Nếu chưa đăng nhập thì không gọi API này (vì sẽ lỗi 401)
        if (!user) return; 

        try {
            setLoading(true);
            console.log("Đang gọi API: /bookings/my-history");
        
            const res: any = await BookingApi.getHistory();
            
            console.log("Dữ liệu trả về:", res);

            // Xử lý dữ liệu trả về theo đúng cấu trúc JSON bạn cung cấp
            // Cấu trúc: { success: true, data: { content: [...] } }
            if (res.success && res.data && Array.isArray(res.data.content)) {
                setTickets(res.data.content);
            } else {
                setTickets([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải vé:", error);
            // Nếu lỗi 401 (Hết hạn token) -> Logout
            if (error === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi component load hoặc khi user thay đổi
    useEffect(() => {
        fetchHistory();
    }, [user]);

    // Format tiền tệ
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Format ngày giờ
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    // Tạo link QR Code
    const generateQrCodeUrl = (data: string) => 
        `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}&margin=5`;

    // Lọc danh sách hiển thị
    const filteredTickets = tickets.filter(t => 
        t.showName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            <Navbar />
            
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                
                <div className="mb-8 border-b pb-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Vé Của Tôi</h1>
                        <p className="text-gray-500 mt-1">Quản lý và xem lại lịch sử đặt vé của bạn.</p>
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

                {/* --- TRƯỜNG HỢP 1: CHƯA ĐĂNG NHẬP --- */}
                {!user ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="bg-orange-100 p-4 rounded-full mb-4">
                            <FaUser className="text-4xl text-orange-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Bạn chưa đăng nhập</h2>
                        <p className="text-gray-500 text-center max-w-md mb-6">
                            Để xem lịch sử đặt vé (My History), bạn cần đăng nhập vào tài khoản đã dùng để mua vé.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/login" className="flex items-center bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition font-medium">
                                <FaSignInAlt className="mr-2" /> Đăng nhập ngay
                            </Link>
                            <Link to="/" className="flex items-center border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium">
                                Về trang chủ
                            </Link>
                        </div>
                        {/* Gợi ý nếu khách muốn tra cứu mà ko cần login (Cần Backend hỗ trợ API khác) */}
                        <p className="mt-8 text-sm text-gray-400 italic">
                            *Nếu bạn mua vé không cần tài khoản, vui lòng kiểm tra Email để lấy vé.
                        </p>
                    </div>
                ) : (
                    /* --- TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP --- */
                    <>
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                                <FaTicketAlt className="mx-auto text-6xl text-gray-200 mb-4" />
                                <h2 className="text-xl font-semibold text-gray-600">Bạn chưa có đơn hàng nào</h2>
                                <Link to="/" className="mt-6 inline-block bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors">
                                    Mua vé ngay
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Thanh tìm kiếm */}
                                <div className="relative max-w-md mb-6">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Tìm theo tên show hoặc mã đơn..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                </div>

                                {/* Danh sách vé */}
                                {filteredTickets.map((ticket) => (
                                    <div key={ticket.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                                        {/* Ảnh giả định (Vì API JSON chưa trả về ảnh) */}
                                        <div className="w-full md:w-48 h-48 bg-gray-200 relative flex items-center justify-center text-gray-400">
                                             {/* Nếu sau này API có ảnh, thay src vào đây */}
                                            <FaTicketAlt size={40} />
                                        </div>

                                        {/* Thông tin vé */}
                                        <div className="p-5 flex-grow flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono font-bold">
                                                        ID: {ticket.id.slice(-6).toUpperCase()}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${ticket.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {ticket.status === 'CONFIRMED' ? 'ĐÃ THANH TOÁN' : 'CHỜ XỬ LÝ'}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    Đặt ngày: {new Date(ticket.bookingDate).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                            
                                            <h3 className="text-xl font-bold text-indigo-700 mb-1">{ticket.showName}</h3>
                                            
                                            <div className="text-sm text-gray-600 space-y-2 mb-3 mt-2">
                                                <p className="flex items-center text-gray-700">
                                                    <FaCalendarAlt className="mr-2 text-orange-500"/> 
                                                    <span className="font-medium">{formatDate(ticket.showTime)}</span>
                                                </p>
                                                <p className="flex items-start">
                                                    <FaMapMarkerAlt className="mr-2 text-orange-500 mt-1 flex-shrink-0"/> 
                                                    <span>{ticket.address}</span>
                                                </p>
                                            </div>

                                            <div className="mt-auto pt-3 border-t flex justify-between items-center">
                                                <span className="text-xs text-gray-500">Tổng tiền</span>
                                                <span className="text-orange-600 font-bold text-lg">
                                                    {formatCurrency(ticket.totalAmount)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* QR Code */}
                                        {ticket.status === 'CONFIRMED' && (
                                            <div className="p-4 bg-gray-50 border-l flex flex-col items-center justify-center min-w-[150px]">
                                                <div className="bg-white p-1 rounded shadow-sm mb-2">
                                                    {/* Dùng Booking ID làm mã QR */}
                                                    <img src={generateQrCodeUrl(ticket.id)} alt="QR" className="w-24 h-24" />
                                                </div>
                                                <span className="text-xs text-gray-500">Check-in</span>
                                                <button className="text-xs flex items-center text-blue-600 hover:underline mt-1">
                                                    <FaQrcode className="mr-1"/> Phóng to
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default MyTicketsPage;