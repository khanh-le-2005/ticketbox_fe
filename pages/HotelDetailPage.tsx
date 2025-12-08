
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaCheckCircle, FaWifi, FaSwimmingPool, FaUtensils, FaSpa, FaParking, FaSnowflake, FaBed } from 'react-icons/fa';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import BookingReceiptModal from '../components/BookingReceiptModal';
import QrVerificationModal from '../components/QrVerificationModal';
import { HOTEL_DATA } from '../constants';
import { BookingDetails, Hotel } from '../types';

const HotelDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    
    // State for the current hotel (with dynamic inventory)
    const [hotel, setHotel] = useState<Hotel | null>(null);

    const [activeImage, setActiveImage] = useState<string>('');
    
    // Booking Logic States
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    
    // Payment Flow States
    const [showQrModal, setShowQrModal] = useState(false);
    const [pendingBooking, setPendingBooking] = useState<BookingDetails | null>(null);
    const [isConfirmingQr, setIsConfirmingQr] = useState(false);

    const [showReceipt, setShowReceipt] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Load initial data + inventory
        const foundHotel = HOTEL_DATA.find(h => h.id === Number(id));
        if (foundHotel) {
             const inventory = JSON.parse(localStorage.getItem('hotel_inventory') || '{}');
             const currentAvailable = inventory[foundHotel.id] !== undefined ? inventory[foundHotel.id] : 10;
             setHotel({ ...foundHotel, availableRooms: currentAvailable });
             setActiveImage(foundHotel.imageUrl);
        }
        window.scrollTo(0, 0);
    }, [id]);

    // Helper to force high resolution for large display
    const getHighResUrl = (url: string) => {
        // Replace dimensions like /400/300 with /1200/800 for better detail quality
        return url.replace(/\/\d+\/\d+$/, '/1200/800'); 
    };

    if (!hotel) {
        return (
            <div className="bg-gray-50 min-h-screen flex flex-col">
                <Header />
                <Navbar />
                <main className="flex-grow text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy khách sạn</h2>
                    <Link to="/booking" className="text-indigo-600 hover:underline mt-4 inline-block">Quay lại trang đặt phòng</Link>
                </main>
                <Footer />
            </div>
        );
    }

    // Icons mapping for amenities
    const getAmenityIcon = (amenity: string) => {
        const lower = amenity.toLowerCase();
        if (lower.includes('wifi')) return <FaWifi />;
        if (lower.includes('hồ bơi') || lower.includes('pool')) return <FaSwimmingPool />;
        if (lower.includes('nhà hàng') || lower.includes('bar') || lower.includes('ẩm thực')) return <FaUtensils />;
        if (lower.includes('spa') || lower.includes('gym')) return <FaSpa />;
        if (lower.includes('xe') || lower.includes('parking')) return <FaParking />;
        if (lower.includes('lạnh') || lower.includes('mát')) return <FaSnowflake />;
        return <FaCheckCircle />;
    };

    const handleBookClick = () => {
        if (!checkInDate || !checkOutDate) {
            setError('Vui lòng chọn ngày nhận phòng và trả phòng.');
            return;
        }
        if (new Date(checkOutDate) <= new Date(checkInDate)) {
            setError('Ngày trả phòng phải sau ngày nhận phòng.');
            return;
        }
        setError('');
        setIsModalOpen(true);
    };

    // Step 1: Proceed to Payment (Show QR)
    const handleConfirmBooking = () => {
        setIsBooking(true);
        
        // Prepare booking details
        const nights = Math.max(1, Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)));
        const totalPrice = nights * hotel.pricePerNight;
        const bookingId = `TG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const details: BookingDetails = {
            bookingId,
            hotel: hotel, // Note: This passes the hotel obj snapshot at booking time
            checkInDate,
            checkOutDate,
            guests,
            nights,
            totalPrice,
        };

        setTimeout(() => {
            setPendingBooking(details);
            setIsBooking(false);
            setIsModalOpen(false);
            setShowQrModal(true); // Open QR Payment Modal
        }, 1000);
    };

    // Step 2: Finalize after QR Scan
    const handleFinalizeBooking = () => {
        if (!pendingBooking) return;
        
        setIsConfirmingQr(true);
        setTimeout(() => {
            // 1. Save Booking History
            try {
                const existingBookings = JSON.parse(localStorage.getItem('myHotelBookings') || '[]') as BookingDetails[];
                const newBookings = [...existingBookings, pendingBooking];
                localStorage.setItem('myHotelBookings', JSON.stringify(newBookings));
            } catch (error) {
                console.error("Failed to save hotel booking to local storage", error);
            }

            // 2. Decrement Inventory
             try {
                const currentInventory = JSON.parse(localStorage.getItem('hotel_inventory') || '{}');
                const hotelId = pendingBooking.hotel.id;
                // Default to 10 if not in storage yet, then subtract 1
                const currentCount = currentInventory[hotelId] !== undefined ? currentInventory[hotelId] : 10;
                const newCount = Math.max(0, currentCount - 1);
                
                currentInventory[hotelId] = newCount;
                localStorage.setItem('hotel_inventory', JSON.stringify(currentInventory));

                // Update local state to reflect change immediately
                setHotel(prev => prev ? ({ ...prev, availableRooms: newCount }) : null);
            } catch (error) {
                console.error("Failed to update inventory", error);
            }
            
            setBookingDetails(pendingBooking);
            setIsConfirmingQr(false);
            setShowQrModal(false);
            setPendingBooking(null);
            setShowReceipt(true); // Show final receipt
        }, 1500);
    }

    const qrData = pendingBooking 
        ? `PAYMENT|${pendingBooking.hotel.name}|${pendingBooking.totalPrice}|${pendingBooking.bookingId}`
        : '';

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-indigo-600">Trang chủ</Link> &gt; 
                    <Link to="/booking" className="hover:text-indigo-600 mx-1">Đặt phòng</Link> &gt; 
                    <span className="text-gray-800 font-medium mx-1">{hotel.name}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Content: Images & Info */}
                    <div className="lg:w-2/3">
                        {/* Image Gallery */}
                        <div className="bg-white p-2 rounded-lg shadow-sm mb-8">
                            <div className="h-[300px] md:h-[450px] w-full mb-2 overflow-hidden rounded-lg">
                                {/* Use getHighResUrl here to ensure clear image */}
                                <img src={getHighResUrl(activeImage)} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                <div 
                                    onClick={() => setActiveImage(hotel.imageUrl)} 
                                    className={`cursor-pointer h-20 rounded-md overflow-hidden border-2 ${activeImage === hotel.imageUrl ? 'border-orange-500' : 'border-transparent'}`}
                                >
                                    <img src={hotel.imageUrl} alt="Main" className="w-full h-full object-cover" />
                                </div>
                                {hotel.images?.map((img, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => setActiveImage(img)} 
                                        className={`cursor-pointer h-20 rounded-md overflow-hidden border-2 ${activeImage === img ? 'border-orange-500' : 'border-transparent'}`}
                                    >
                                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hotel Info */}
                        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <FaMapMarkerAlt className="mr-2 text-orange-500" />
                                        <span>{hotel.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={i < hotel.rating ? 'text-yellow-400' : 'text-gray-300'} size={18} />
                                        ))}
                                        <span className="ml-2 text-sm text-gray-500">(Tuyệt vời)</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-6 border-gray-100" />

                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-3">Giới thiệu</h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {hotel.description || `Tận hưởng kỳ nghỉ tuyệt vời tại ${hotel.name}. Với vị trí đắc địa tại ${hotel.location}, chúng tôi mang đến dịch vụ đẳng cấp và tiện nghi hiện đại để bạn có những giây phút thư giãn trọn vẹn.`}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Tiện nghi nổi bật</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {hotel.amenities?.map((amenity, idx) => (
                                        <div key={idx} className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                                            <span className="text-indigo-500 mr-3 text-lg">{getAmenityIcon(amenity)}</span>
                                            <span className="text-sm font-medium">{amenity}</span>
                                        </div>
                                    ))}
                                    {!hotel.amenities && (
                                        <p className="text-gray-500 col-span-3 italic">Đang cập nhật tiện nghi...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar: Booking Form */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-6 rounded-lg shadow-lg sticky top-6 border border-indigo-50">
                             <div className="mb-4 flex items-center justify-between">
                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                                    <FaBed className="mr-1"/> Còn {hotel.availableRooms} phòng
                                </span>
                            </div>

                            <div className="mb-6">
                                <span className="text-gray-500 text-sm">Giá mỗi đêm từ</span>
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-orange-500">{hotel.pricePerNight.toLocaleString('vi-VN')} ₫</span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nhận phòng</label>
                                    <input 
                                        type="date" 
                                        value={checkInDate}
                                        onChange={(e) => { setCheckInDate(e.target.value); setError(''); }}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày trả phòng</label>
                                    <input 
                                        type="date" 
                                        value={checkOutDate}
                                        onChange={(e) => { setCheckOutDate(e.target.value); setError(''); }}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số khách</label>
                                    <select 
                                        value={guests}
                                        onChange={(e) => setGuests(Number(e.target.value))}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                            <option key={n} value={n}>{n} Khách</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button 
                                onClick={handleBookClick}
                                disabled={hotel.availableRooms === 0}
                                className={`w-full font-bold py-3 px-4 rounded-lg transition-all transform hover:-translate-y-1 shadow-md ${hotel.availableRooms > 0 ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:none'}`}
                            >
                                {hotel.availableRooms > 0 ? 'Đặt Phòng Ngay' : 'Đã Hết Phòng'}
                            </button>
                            
                            <p className="text-xs text-center text-gray-400 mt-4">
                                Bạn sẽ không bị trừ tiền ngay. Xác nhận chi tiết ở bước tiếp theo.
                            </p>
                        </div>

                        {/* Help Card */}
                        <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                            <h3 className="font-bold text-indigo-800 mb-2">Cần hỗ trợ?</h3>
                            <p className="text-sm text-indigo-700 mb-1">Gọi ngay cho chúng tôi</p>
                            <p className="text-lg font-bold text-orange-500">1900 232323</p>
                        </div>
                    </div>
                </div>
                
                {/* Similar Hotels */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Khách sạn tương tự</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {HOTEL_DATA.filter(h => h.id !== hotel.id).slice(0, 4).map(otherHotel => (
                            <div key={otherHotel.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                                <Link to={`/hotel/${otherHotel.id}`}>
                                    <img src={otherHotel.imageUrl} alt={otherHotel.name} className="w-full h-40 object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-800 truncate">{otherHotel.name}</h3>
                                        <p className="text-sm text-gray-500 mb-2">{otherHotel.location}</p>
                                        <p className="text-orange-500 font-bold">{otherHotel.pricePerNight.toLocaleString('vi-VN')} ₫</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
            
            <Footer />

            <BookingModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmBooking}
                hotel={hotel}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                guests={guests}
                isBooking={isBooking}
            />

            {/* Payment QR Modal */}
            <QrVerificationModal
                isOpen={showQrModal}
                onClose={() => setShowQrModal(false)}
                onConfirm={handleFinalizeBooking}
                isConfirming={isConfirmingQr}
                qrCodeData={qrData}
            />
            
            <BookingReceiptModal
                isOpen={showReceipt}
                onClose={() => setShowReceipt(false)}
                details={bookingDetails}
            />
        </div>
    );
};

export default HotelDetailPage;