
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HotelCard from '../components/HotelCard';
import BookingModal from '../components/BookingModal';
import BookingReceiptModal from '../components/BookingReceiptModal';
import QrVerificationModal from '../components/QrVerificationModal';
import ErrorToast from '../components/ErrorToast';
import { HOTEL_DATA } from '../constants';
import { Hotel, BookingDetails } from '../types';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';

const locations = ['Tất cả', 'Hà Nội', 'TP. Hồ Chí Minh', 'Phú Quốc', 'Hội An', 'Sa Pa', 'Nha Trang', 'Huế', 'Hạ Long', 'Đà Nẵng'];

const BookingPage: React.FC = () => {
    const [destination, setDestination] = useState('Tất cả');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [toastError, setToastError] = useState('');
    
    // Manage hotels state to handle inventory updates
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    
    // New states for QR Payment flow
    const [showQrModal, setShowQrModal] = useState(false);
    const [pendingBooking, setPendingBooking] = useState<BookingDetails | null>(null);
    const [isConfirmingQr, setIsConfirmingQr] = useState(false);

    const [showReceipt, setShowReceipt] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

    const resultsRef = useRef<HTMLDivElement>(null);

    // Initial Load of Inventory
    useEffect(() => {
        const inventory = JSON.parse(localStorage.getItem('hotel_inventory') || '{}');
        const initialHotels = HOTEL_DATA.map(h => ({
            ...h,
            availableRooms: inventory[h.id] !== undefined ? inventory[h.id] : 10 
        }));
        setHotels(initialHotels);
    }, []);

    useEffect(() => {
        if (toastError) {
            const timer = setTimeout(() => setToastError(''), 4000); // Auto-hide after 4s
            return () => clearTimeout(timer);
        }
    }, [toastError]);

    useEffect(() => {
        const results = destination === 'Tất cả'
            ? hotels
            : hotels.filter(hotel =>
                hotel.location.toLowerCase() === destination.toLowerCase()
            );
        setFilteredHotels(results);
    }, [destination, hotels]);

    const handleBookNow = (hotel: Hotel) => {
        if (!checkInDate || !checkOutDate) {
            setToastError('Vui lòng chọn ngày nhận phòng và trả phòng.');
            return;
        }

        if (new Date(checkOutDate) <= new Date(checkInDate)) {
            setToastError('Ngày trả phòng phải sau ngày nhận phòng.');
            return;
        }
        
        if (hotel.availableRooms <= 0) {
             setToastError('Khách sạn này đã hết phòng.');
             return;
        }

        setSelectedHotel(hotel);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedHotel(null);
    };

    // Step 1: Create Pending Booking and Show QR
    const handleConfirmBooking = () => {
        if (!selectedHotel) return;

        setIsBooking(true);
        
        // Calculate details immediately
        const nights = Math.max(1, Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)));
        const totalPrice = nights * selectedHotel.pricePerNight;
        const bookingId = `TG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const details: BookingDetails = {
            bookingId,
            hotel: selectedHotel,
            checkInDate,
            checkOutDate,
            guests,
            nights,
            totalPrice,
        };

        // Simulate short processing then open QR modal
        setTimeout(() => {
            setPendingBooking(details); // Store data temporarily
            setIsBooking(false);
            handleCloseModal(); // Close booking form
            setShowQrModal(true); // Open QR Payment
        }, 1000);
    };

    // Step 2: Finalize Booking after QR Scan
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
                setHotels(prevHotels => prevHotels.map(h => 
                    h.id === hotelId ? { ...h, availableRooms: newCount } : h
                ));
            } catch (error) {
                console.error("Failed to update inventory", error);
            }

            setBookingDetails(pendingBooking);
            setIsConfirmingQr(false);
            setShowQrModal(false);
            setPendingBooking(null);
            setShowReceipt(true);
        }, 1500);
    };

    const handleCloseReceipt = () => {
        setShowReceipt(false);
        setBookingDetails(null);
    };
    
    const handleScrollToResults = () => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Generate QR Data string
    const qrData = pendingBooking 
        ? `PAYMENT|${pendingBooking.hotel.name}|${pendingBooking.totalPrice}|${pendingBooking.bookingId}`
        : '';

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <Navbar />
            <ErrorToast message={toastError} isVisible={!!toastError} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Tìm & đặt phòng khách sạn</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        
                        <div className="lg:col-span-1">
                            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                                <FaMapMarkerAlt className="inline mr-2 text-gray-400" />
                                Chọn địa điểm
                            </label>
                            <select 
                                id="destination" 
                                value={destination} 
                                onChange={e => setDestination(e.target.value)} 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            >
                                {locations.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="checkin" className="block text-sm font-medium text-gray-700 mb-1">
                                <FaCalendarAlt className="inline mr-2 text-gray-400" />
                                Nhận phòng
                            </label>
                            <input type="date" id="checkin" value={checkInDate} onChange={e => { setCheckInDate(e.target.value); setToastError(''); }} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>

                        <div>
                            <label htmlFor="checkout" className="block text-sm font-medium text-gray-700 mb-1">
                                <FaCalendarAlt className="inline mr-2 text-gray-400" />
                                Trả phòng
                            </label>
                            <input type="date" id="checkout" value={checkOutDate} onChange={e => { setCheckOutDate(e.target.value); setToastError(''); }} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>

                        <div>
                            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                                <FaUsers className ="inline mr-2 text-gray-400" />
                                Số khách
                            </label>
                            <input type="number" id="guests" value={guests} onChange={e => setGuests(parseInt(e.target.value, 10) || 1)} min="1" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                       
                        <button onClick={handleScrollToResults} className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center text-lg">
                            <FaSearch className="mr-2"/>
                            Tìm
                        </button>
                    </div>
                </div>

                <div ref={resultsRef}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Kết quả tìm kiếm</h2>
                    {filteredHotels.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredHotels.map(hotel => (
                                <HotelCard key={hotel.id} hotel={hotel} onBookNow={handleBookNow} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white rounded-lg shadow">
                            <p className="text-gray-500">Không tìm thấy khách sạn phù hợp. Vui lòng thử lại.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
            
            {/* Initial Booking Form Modal */}
            <BookingModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmBooking}
                hotel={selectedHotel}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                guests={guests}
                isBooking={isBooking}
            />

            {/* Payment QR Code Modal */}
            <QrVerificationModal
                isOpen={showQrModal}
                onClose={() => setShowQrModal(false)}
                onConfirm={handleFinalizeBooking}
                isConfirming={isConfirmingQr}
                qrCodeData={qrData}
            />

            {/* Final Receipt Modal */}
            <BookingReceiptModal
                isOpen={showReceipt}
                onClose={handleCloseReceipt}
                details={bookingDetails}
            />
        </div>
    );
};

export default BookingPage;