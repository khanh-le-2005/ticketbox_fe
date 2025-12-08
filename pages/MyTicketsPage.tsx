
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaBed, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaSearch } from 'react-icons/fa';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { EventBookingDetails, BookingDetails, TicketItem } from '../types';

// Helper interface for flattened display items
interface DisplayTicketItem {
    uniqueId: string; // Combination of bookingId + ticketIndex
    bookingId: string;
    ticketCode: string;
    tierName: string;
    event: EventBookingDetails['event'];
    contactInfo: EventBookingDetails['contactInfo'];
    priceString: string;
}

const MyTicketsPage: React.FC = () => {
    const [eventBookings, setEventBookings] = useState<EventBookingDetails[]>([]);
    const [hotelBookings, setHotelBookings] = useState<BookingDetails[]>([]);
    const [loading, setLoading] = useState(true);

    // State cho tìm kiếm
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        try {
            const storedEventBookings = JSON.parse(localStorage.getItem('myEventBookings') || '[]') as EventBookingDetails[];
            const storedHotelBookings = JSON.parse(localStorage.getItem('myHotelBookings') || '[]') as BookingDetails[];
            setEventBookings(storedEventBookings);
            setHotelBookings(storedHotelBookings);
        } catch (error) {
            console.error("Failed to load bookings from local storage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Flatten event bookings into individual tickets for display
 const allDisplayTickets = useMemo(() => {
    const tickets: DisplayTicketItem[] = [];
    
    eventBookings.forEach(booking => {
        if (booking.tickets && booking.tickets.length > 0) {
            booking.tickets.forEach((ticket, index) => {
                const tier = booking.event.ticketTiers?.find(t => t.name === ticket.tierName);
                let priceDisplay = tier ? tier.price : (booking.event.price || "0 đ");

                tickets.push({
                    uniqueId: `${booking.bookingId}-${index}`,
                    bookingId: booking.bookingId,
                    ticketCode: ticket.code,
                    tierName: ticket.tierName,
                    event: booking.event,
                    contactInfo: booking.contactInfo,
                    priceString: priceDisplay
                });
            });
        } else {
            Object.entries(booking.ticketSelection).forEach(([tierName, quantity]) => {
                const tier = booking.event.ticketTiers?.find(t => t.name === tierName);
                const priceDisplay = tier ? tier.price : (booking.event.price || "0 đ");

                for(let i=0; i < (quantity as number); i++) {
                    tickets.push({
                        uniqueId: `${booking.bookingId}-${tierName}-${i}`,
                        bookingId: booking.bookingId,
                        ticketCode: `${booking.bookingId}-${i+1}`,
                        tierName,
                        event: booking.event,
                        contactInfo: booking.contactInfo,
                        priceString: priceDisplay
                    });
                }
            });
        }
    });

    // 🎉 Sort new → old
    return tickets.sort((a, b) => b.bookingId.localeCompare(a.bookingId));
}, [eventBookings]);


    // Filter based on search query
    const filteredTickets = allDisplayTickets.filter(ticket => 
        ticket.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredHotelBookings = hotelBookings.filter((booking) =>
        booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.hotel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const generateQrCodeUrl = (data: string) => {
        const qrData = encodeURIComponent(data);
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&margin=5`;
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <Header />
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                    <p>Đang tải vé của bạn...</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">Vé Của Tôi</h1>
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm vé, sự kiện, khách sạn..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

                {filteredTickets.length === 0 && filteredHotelBookings.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow">
                        <FaTicketAlt className="mx-auto text-5xl text-gray-300" />
                        <h2 className="mt-4 text-xl font-semibold text-gray-700">Không tìm thấy vé nào</h2>
                        <p className="mt-2 text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc đặt vé mới.</p>
                        <Link to="/" className="mt-6 inline-block bg-orange-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-orange-600 transition-colors">
                            Khám phá sự kiện
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* EVENT TICKETS SECTION */}
                        {filteredTickets.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center">
                                    <FaTicketAlt className="mr-3 text-orange-500" /> Vé Sự Kiện ({filteredTickets.length})
                                </h2>

                                <div className="grid grid-cols-1 gap-6">
                                    {filteredTickets.map((ticket) => (
                                        <div key={ticket.uniqueId} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row border border-gray-200 hover:shadow-lg transition-shadow">
                                            
                                            {/* Left: Image */}
                                            <div className="w-full md:w-1/3 lg:w-1/4 h-48 md:h-auto relative">
                                                <img 
                                                    src={ticket.event.imageUrl} 
                                                    alt={ticket.event.title} 
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent md:hidden"></div>
                                            </div>

                                            {/* Middle: Details */}
                                            <div className="p-5 flex-grow flex flex-col justify-center">
                                                <div className="mb-1">
                                                    <span className="text-xs text-gray-500 uppercase font-semibold">Mã đặt vé: </span>
                                                    <span className="text-xs font-mono text-gray-600">{ticket.ticketCode}</span>
                                                </div>
                                                
                                                <h3 className="text-xl md:text-2xl font-bold text-indigo-700 mb-2 leading-tight">
                                                    {ticket.event.title}
                                                </h3>

                                                <div className="text-sm text-gray-600 space-y-1 mb-4">
                                                    {ticket.event.date && (
                                                        <p className="flex items-center">
                                                            <span>Ngày {ticket.event.date.day}/{ticket.event.date.month.replace('Thg ', '')}/{ticket.event.date.year}</span>
                                                        </p>
                                                    )}
                                                    <p className="flex items-center">
                                                        <span>{ticket.event.location}</span>
                                                    </p>
                                                </div>

                                                <div className="border-t pt-3 mt-auto">
                                                    <div className="mb-1">
                                                        <span className="font-bold text-gray-800">Vé đã mua:</span>
                                                        <ul className="list-disc list-inside text-gray-700 ml-1">
                                                            <li>1 x {ticket.tierName}</li>
                                                        </ul>
                                                    </div>
                                                    <div className="flex items-baseline mt-2">
                                                        <span className="font-bold text-gray-900 mr-2 text-lg">Tổng cộng:</span>
                                                        <span className="font-bold text-xl text-black">{ticket.priceString}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: QR Code */}
                                            <div className="p-6 bg-white border-t md:border-t-0 md:border-l border-gray-100 flex flex-col items-center justify-center min-w-[200px]">
                                                <img 
                                                    src={generateQrCodeUrl(`CODE:${ticket.ticketCode}`)} 
                                                    alt="QR Code" 
                                                    className="w-32 h-32 mb-3"
                                                />
                                                <p className="text-xs text-gray-500 text-center">
                                                    Sử dụng mã này để check-in
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* HOTEL BOOKINGS SECTION */}
                        {filteredHotelBookings.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center border-t pt-8">
                                    <FaBed className="mr-3 text-orange-500" /> Đặt Phòng Khách Sạn ({filteredHotelBookings.length})
                                </h2>

                                <div className="grid grid-cols-1 gap-6">
                                    {filteredHotelBookings.map((booking) => (
                                        <div key={booking.bookingId} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row border border-gray-200">
                                            <div className="w-full md:w-1/3 lg:w-1/4 h-48 md:h-auto">
                                                <img src={booking.hotel.imageUrl} alt={booking.hotel.name} className="w-full h-full object-cover"/>
                                            </div>
                                            
                                            <div className="p-5 flex-grow flex flex-col justify-center">
                                                <div className="mb-1">
                                                    <span className="text-xs text-gray-500 uppercase font-semibold">Mã đặt phòng: </span>
                                                    <span className="text-xs font-mono text-gray-600">{booking.bookingId}</span>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-bold text-indigo-700 mt-1 mb-2">{booking.hotel.name}</h3>
                                                <p className="text-sm text-gray-600 mb-3 flex items-center"><FaMapMarkerAlt className="mr-1"/> {booking.hotel.location}</p>
                                                
                                                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded-lg mb-3">
                                                    <div>
                                                        <span className="block text-gray-500 text-xs">Nhận phòng</span>
                                                        <span className="font-semibold">{new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 text-xs">Trả phòng</span>
                                                        <span className="font-semibold">{new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 text-xs">Số đêm</span>
                                                        <span className="font-semibold">{booking.nights}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 text-xs">Số khách</span>
                                                        <span className="font-semibold">{booking.guests}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-auto pt-2 border-t">
                                                     <span className="font-bold text-gray-900 mr-2 text-lg">Tổng cộng:</span>
                                                     <span className="font-bold text-xl text-orange-600">{booking.totalPrice.toLocaleString('vi-VN')} ₫</span>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-white border-t md:border-t-0 md:border-l border-gray-100 flex flex-col items-center justify-center min-w-[200px]">
                                                <img src={generateQrCodeUrl(`HOTEL:${booking.bookingId}`)} alt="QR Code" className="w-32 h-32 mb-3" />
                                                <p className="text-xs text-gray-500 text-center">Sử dụng mã này để check-in</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default MyTicketsPage;