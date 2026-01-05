import React, { useState, useEffect } from 'react';
import { FaTimes, FaHotel, FaCalendarCheck, FaBed, FaUserFriends, FaArrowRight, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import roomApi, { CreateHotelBookingRequest } from '../api/room_api';
import axiosClient from '../api/axiosClient'; // Import axiosClient để gọi API check availability
import { useNavigate } from 'react-router-dom';
import PaymentStepModal from './PaymentStepModal';
import HotelContactModal from '../components/HotelContactModal';

export enum HotelBookingStep {
    DATE_SELECTION,
    PAYMENT_QR,
    SUCCESS_RECEIPT
}

interface HotelBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotelId: string;
    roomTypeCode: string;
    pricePerNight: number;
    onSuccess?: () => void; 
}

const HotelBookingModal: React.FC<HotelBookingModalProps> = ({ 
    isOpen, onClose, hotelId, roomTypeCode, pricePerNight, onSuccess 
}) => {
    const navigate = useNavigate();

    // --- STATE ---
    const [currentStep, setCurrentStep] = useState(HotelBookingStep.DATE_SELECTION);
    const [loading, setLoading] = useState(false);
    const [bookingResult, setBookingResult] = useState<any>(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    // 👇 STATE MỚI: LƯU TÌNH TRẠNG PHÒNG
    const [availability, setAvailability] = useState<{
        isAvailable: boolean;
        remainingRooms: number;
        checking: boolean; // Đang check API hay không
    } | null>(null);

    const [bookingConfig, setBookingConfig] = useState({
        checkInDate: '',
        checkOutDate: '',
        guests: 1,    
        quantity: 1,  
    });

    // --- HELPER NGÀY ---
    const getTomorrowDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 1); 
        return today.toISOString().split('T')[0];
    };

    const getMinCheckoutDate = () => {
        if (bookingConfig.checkInDate) {
            const checkIn = new Date(bookingConfig.checkInDate);
            checkIn.setDate(checkIn.getDate() + 1);
            return checkIn.toISOString().split('T')[0];
        }
        return getTomorrowDate();
    };

    // --- 🔥 CHECK AVAILABILITY (GỌI API KIỂM TRA PHÒNG TRỐNG) ---
    // Gọi mỗi khi checkIn hoặc checkOut thay đổi
    useEffect(() => {
        const checkRoomAvailability = async () => {
            // Chỉ gọi khi đã có đủ 2 ngày
            if (!bookingConfig.checkInDate || !bookingConfig.checkOutDate) return;

            try {
                setAvailability(prev => ({ ...prev, isAvailable: false, remainingRooms: 0, checking: true }));
                
                // Gọi API theo tài liệu: GET /api/hotels/{hotelId}/availability
                const res: any = await axiosClient.get(`/hotels/${hotelId}/availability`, {
                    params: {
                        roomTypeCode: roomTypeCode,
                        checkIn: bookingConfig.checkInDate,
                        checkOut: bookingConfig.checkOutDate
                    }
                });

                if (res.data) {
                    setAvailability({
                        isAvailable: res.data.isAvailable,
                        remainingRooms: res.data.remainingRooms,
                        checking: false
                    });
                }
            } catch (error) {
                console.error("Lỗi check phòng:", error);
                // Nếu lỗi API thì tạm thời cho là hết phòng để an toàn
                setAvailability({ isAvailable: false, remainingRooms: 0, checking: false });
            }
        };

        // Debounce: Chờ 500ms sau khi người dùng chọn xong mới gọi API
        const timeoutId = setTimeout(() => {
            checkRoomAvailability();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [bookingConfig.checkInDate, bookingConfig.checkOutDate, hotelId, roomTypeCode]);


    // --- HANDLERS ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBookingConfig({ ...bookingConfig, [e.target.name]: e.target.value });
    };

    const calculateTotal = () => {
        const rooms = Math.max(1, Number(bookingConfig.quantity));
        if (!bookingConfig.checkInDate || !bookingConfig.checkOutDate) return pricePerNight * rooms;
        const start = new Date(bookingConfig.checkInDate);
        const end = new Date(bookingConfig.checkOutDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        const nights = diffDays > 0 ? diffDays : 1;
        return nights * pricePerNight * rooms;
    };

    const handleContinueToContact = () => {
        if (!bookingConfig.checkInDate || !bookingConfig.checkOutDate) {
            alert("Vui lòng chọn ngày nhận và trả phòng"); return;
        }
        // Check kỹ lại lần nữa
        if (availability && !availability.isAvailable) {
            alert("Đã hết phòng vào ngày này, vui lòng chọn ngày khác."); return;
        }
        if (availability && bookingConfig.quantity > availability.remainingRooms) {
            alert(`Chỉ còn ${availability.remainingRooms} phòng trống. Vui lòng giảm số lượng.`); return;
        }
        setIsContactModalOpen(true);
    };

    const handleConfirmBooking = async (contactData: { name: string, email: string, phone: string, otp: string }) => {
        setIsContactModalOpen(false);
        try {
            setLoading(true);
            const payload: CreateHotelBookingRequest = {
                hotelId,
                roomTypeCode,
                checkInDate: bookingConfig.checkInDate,
                checkOutDate: bookingConfig.checkOutDate,
                quantity: Math.max(1, Number(bookingConfig.quantity)), 
                numberOfGuests: Math.max(1, Number(bookingConfig.guests)), 
                customerName: contactData.name,
                customerEmail: contactData.email,
                customerPhone: contactData.phone,
                otp: contactData.otp, 
                totalAmount: calculateTotal()
            };

            const res = await roomApi.createBooking(payload);
            if (res.success) {
                setBookingResult(res.data);
                setCurrentStep(HotelBookingStep.PAYMENT_QR);
            } else {
                // Xử lý thông báo lỗi từ Backend (như lỗi "Hết phòng" bạn gặp)
                alert("⚠️ Không thể đặt phòng:\n" + res.message);
            }
        } catch (error: any) {
            console.error("Lỗi đặt phòng:", error);
            const serverMsg = error.response?.data?.message || "Lỗi kết nối server";
            alert(`❌ Đặt phòng thất bại: ${serverMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = () => setCurrentStep(HotelBookingStep.SUCCESS_RECEIPT);
    const handleFinish = () => { if (onSuccess) onSuccess(); onClose(); navigate('/my-tickets'); };

    if (!isOpen) return null;

    return (
        <>
            {currentStep === HotelBookingStep.DATE_SELECTION && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        
                        <div className="flex justify-between items-center mb-5 border-b pb-3">
                            <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2">
                                <FaHotel /> Cấu hình đặt phòng
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
                        </div>
                        
                        <div className="space-y-5">
                            {/* Chọn Ngày */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Nhận phòng</label>
                                    <input 
                                        type="date" name="checkInDate" 
                                        min={getTomorrowDate()} 
                                        value={bookingConfig.checkInDate} onChange={handleChange} 
                                        className="w-full border border-gray-300 p-2 rounded text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Trả phòng</label>
                                    <input 
                                        type="date" name="checkOutDate" 
                                        min={getMinCheckoutDate()} 
                                        value={bookingConfig.checkOutDate} onChange={handleChange} 
                                        className="w-full border border-gray-300 p-2 rounded text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
                                    />
                                </div>
                            </div>

                            {/* 🔥 HIỂN THỊ TRẠNG THÁI PHÒNG (AVAILABILITY STATUS) 🔥 */}
                            {bookingConfig.checkInDate && bookingConfig.checkOutDate && (
                                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                                    availability?.checking ? 'bg-gray-100 text-gray-500' :
                                    (availability?.remainingRooms === 0 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200')
                                }`}>
                                    {availability?.checking ? (
                                        <>Checking...</>
                                    ) : availability?.remainingRooms === 0 ? (
                                        <><FaExclamationCircle className="text-lg"/> <b>Hết phòng!</b> Vui lòng chọn ngày khác.</>
                                    ) : (
                                        <><FaCheckCircle className="text-lg"/> Còn <b>{availability?.remainingRooms}</b> phòng trống.</>
                                    )}
                                </div>
                            )}

                            {/* Số lượng */}
                            <div className="grid grid-cols-2 gap-3 bg-orange-50 p-3 rounded-lg border border-orange-100">
                                <div>
                                    <label className="text-xs font-bold text-orange-800 block mb-1 flex items-center gap-1"><FaBed/> Số phòng</label>
                                    <input 
                                        type="number" name="quantity" min="1" 
                                        // Max không được vượt quá số phòng còn lại
                                        max={availability?.remainingRooms || 5} 
                                        value={bookingConfig.quantity} onChange={handleChange} 
                                        className="w-full border border-orange-200 p-2 rounded text-sm text-center font-bold outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-orange-800 block mb-1 flex items-center gap-1"><FaUserFriends/> Số khách</label>
                                    <input 
                                        type="number" name="guests" min="1" max="10" 
                                        value={bookingConfig.guests} onChange={handleChange} 
                                        className="w-full border border-orange-200 p-2 rounded text-sm text-center font-bold outline-none" 
                                    />
                                </div>
                            </div>

                            {/* Tổng tiền */}
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200 mt-2">
                                <div className="text-sm text-gray-600">
                                    Tạm tính: <span className="text-xs text-gray-400">({bookingConfig.quantity} phòng)</span>
                                </div>
                                <span className="text-xl font-bold text-orange-600">{calculateTotal().toLocaleString()} ₫</span>
                            </div>

                            {/* Nút Tiếp tục - BỊ DISABLE NẾU HẾT PHÒNG */}
                            <button 
                                onClick={handleContinueToContact} 
                                disabled={loading || (availability !== null && availability.remainingRooms === 0) || availability?.checking}
                                className={`w-full py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all
                                    ${(availability !== null && availability.remainingRooms === 0) 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg'}`}
                            >
                                {loading ? 'Đang xử lý...' : 
                                 (availability?.remainingRooms === 0 ? 'Đã hết phòng' : <>Tiếp tục <FaArrowRight/></>)}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <HotelContactModal 
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                onConfirm={handleConfirmBooking}
            />

            {currentStep === HotelBookingStep.PAYMENT_QR && (
                <PaymentStepModal 
                    isOpen={true}
                    onClose={onClose}
                    paymentData={bookingResult} 
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}

            {currentStep === HotelBookingStep.SUCCESS_RECEIPT && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white p-8 rounded-lg text-center max-w-sm animate-in zoom-in">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCalendarCheck className="text-green-600 text-3xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-green-700">Đặt phòng thành công!</h3>
                        <p className="text-gray-600 mt-2">Mã đặt phòng: <b>#{bookingResult?.user_id?.slice(-8).toUpperCase()}</b></p>
                        <p className="text-sm text-gray-500 mt-4">Thông tin chi tiết đã được gửi tới email.</p>
                        <button onClick={handleFinish} className="mt-6 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Hoàn tất</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default HotelBookingModal;