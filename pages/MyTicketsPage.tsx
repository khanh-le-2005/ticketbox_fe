// src/pages/MyTicketsPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaBed, FaMapMarkerAlt, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// Import các Type nếu bạn đã định nghĩa trong file types.ts
// import { EventBookingDetails, BookingDetails } from '../types';

// Định nghĩa lại interface nội bộ nếu cần để tránh lỗi type checker
interface DisplayTicketItem {
    uniqueId: string;
    bookingId: string;
    ticketCode: string;
    tierName: string;
    eventTitle: string;
    eventImage: string;
    eventDate: string; // Chuỗi ISO
    eventLocation: string;
    priceString: string;
}

const MyTicketsPage: React.FC = () => {
    // Dữ liệu Demo hoặc lấy từ localStorage (Bạn có thể thay bằng gọi API thật sau này)
    const [eventBookings, setEventBookings] = useState<any[]>([]);
    const [hotelBookings, setHotelBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        try {
            // Lấy dữ liệu từ localStorage (Nơi lưu tạm khi đặt vé thành công)
            const storedEventBookings = JSON.parse(localStorage.getItem('myEventBookings') || '[]');
            const storedHotelBookings = JSON.parse(localStorage.getItem('myHotelBookings') || '[]');
            
            setEventBookings(storedEventBookings);
            setHotelBookings(storedHotelBookings);
        } catch (error) {
            console.error("Failed to load bookings", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Xử lý làm phẳng danh sách vé để hiển thị từng vé một
    const allDisplayTickets = useMemo(() => {
        const tickets: DisplayTicketItem[] = [];
        
        eventBookings.forEach(booking => {
            const eventInfo = booking.event || {};
            const contact = booking.contactInfo || {};

            // Trường hợp 1: Có danh sách vé chi tiết (ticket codes)
            if (booking.tickets && booking.tickets.length > 0) {
                booking.tickets.forEach((ticket: any, index: number) => {
                    // Tìm giá tiền
                    const tier = eventInfo.ticketTiers?.find((t: any) => t.name === ticket.tierName);
                    const price = tier ? tier.price.toLocaleString('vi-VN') + ' đ' : "0 đ";

                    tickets.push({
                        uniqueId: `${booking.bookingId}-${index}`,
                        bookingId: booking.bookingId,
                        ticketCode: ticket.code,
                        tierName: ticket.tierName,
                        eventTitle: eventInfo.title,
                        eventImage: eventInfo.image || eventInfo.imageUrl || 'https://placehold.co/600x400',
                        eventDate: eventInfo.date, // ISO String hoặc object cũ
                        eventLocation: eventInfo.location || eventInfo.fullLocation,
                        priceString: price
                    });
                });
            } 
            // Trường hợp 2: Chỉ có số lượng (Fallback)
            else if (booking.ticketSelection) {
                Object.entries(booking.ticketSelection).forEach(([tierName, quantity]) => {
                    const qty = Number(quantity);
                    if (qty > 0) {
                        for(let i=0; i < qty; i++) {
                            tickets.push({
                                uniqueId: `${booking.bookingId}-${tierName}-${i}`,
                                bookingId: booking.bookingId,
                                ticketCode: `${booking.bookingId}-${i+1}`,
                                tierName: tierName,
                                eventTitle: eventInfo.title,
                                eventImage: eventInfo.image || 'https://placehold.co/600x400',
                                eventDate: eventInfo.date,
                                eventLocation: eventInfo.location,
                                priceString: "---"
                            });
                        }
                    }
                });
            }
        });

        // Sắp xếp mới nhất lên đầu
        return tickets.sort((a, b) => b.bookingId.localeCompare(a.bookingId));
    }, [eventBookings]);

    // Lọc theo từ khóa
    const filteredTickets = allDisplayTickets.filter(ticket => 
        ticket.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Hàm format ngày tháng an toàn
    const formatDateSafe = (dateInput: any) => {
        try {
            if (typeof dateInput === 'string') {
                const d = new Date(dateInput);
                return d.toLocaleDateString('vi-VN');
            }
            if (dateInput && dateInput.day) {
                return `${dateInput.day}/${dateInput.month}/${dateInput.year}`;
            }
            return "Đang cập nhật";
        } catch { return "---"; }
    };

    const generateQrCodeUrl = (data: string) => {
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}&margin=5`;
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-800">Vé Của Tôi</h1>
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm mã vé, tên sự kiện..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

                {filteredTickets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                        <FaTicketAlt className="mx-auto text-6xl text-gray-200 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-600">Bạn chưa có vé nào</h2>
                        <p className="text-gray-500 mt-2">Hãy đặt vé ngay để tham gia các sự kiện hấp dẫn!</p>
                        <Link to="/" className="mt-6 inline-block bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors">
                            Khám phá sự kiện
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <h2 className="text-xl font-bold text-gray-700 flex items-center">
                            <FaTicketAlt className="mr-2 text-orange-500" /> Vé Sự Kiện ({filteredTickets.length})
                        </h2>

                        <div className="grid grid-cols-1 gap-6">
                            {filteredTickets.map((ticket) => (
                                <div key={ticket.uniqueId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                                    
                                    {/* Ảnh sự kiện */}
                                    <div className="w-full md:w-1/4 h-48 md:h-auto relative bg-gray-100">
                                        <img 
                                            src={ticket.eventImage} 
                                            alt={ticket.eventTitle} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.currentTarget.src = 'https://placehold.co/600x400?text=No+Image'}
                                        />
                                    </div>

                                    {/* Thông tin vé */}
                                    <div className="p-5 flex-grow flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Mã đặt vé</span>
                                                <div className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded inline-block ml-2">{ticket.bookingId}</div>
                                            </div>
                                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Đã thanh toán</span>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-indigo-700 mb-2">{ticket.eventTitle}</h3>

                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p className="flex items-center"><FaCalendarAlt className="mr-2 text-gray-400"/> {formatDateSafe(ticket.eventDate)}</p>
                                            <p className="flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-400"/> {ticket.eventLocation}</p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                                            <div>
                                                <span className="block text-xs text-gray-500">Loại vé</span>
                                                <span className="font-bold text-gray-800">{ticket.tierName}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-xs text-gray-500">Giá vé</span>
                                                <span className="font-bold text-orange-600 text-lg">{ticket.priceString}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QR Code */}
                                    <div className="p-6 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col items-center justify-center min-w-[200px]">
                                        <div className="bg-white p-2 rounded shadow-sm mb-2">
                                            <img 
                                                src={generateQrCodeUrl(ticket.ticketCode)} 
                                                alt="QR Code" 
                                                className="w-32 h-32"
                                            />
                                        </div>
                                        <span className="font-mono font-bold text-sm text-gray-800 tracking-widest">{ticket.ticketCode}</span>
                                        <p className="text-[10px] text-gray-400 mt-1">Quét mã để vào cổng</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default MyTicketsPage;