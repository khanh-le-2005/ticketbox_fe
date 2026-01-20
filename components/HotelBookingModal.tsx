import React, { useState, useEffect } from 'react';
import { FaTimes, FaHotel, FaCalendarCheck, FaBed, FaUserFriends, FaArrowRight, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import roomApi, { CreateHotelBookingRequest } from '../api/room_api';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import PaymentStepModal from './PaymentStepModal';
import HotelContactModal from '../components/HotelContactModal';
import { ContactData } from '@/type/contact.type';
import { toast } from 'react-toastify';

export enum HotelBookingStep {
    DATE_SELECTION,
    PAYMENT_QR,
    SUCCESS_RECEIPT
}

export interface RoomPriceConfig {
    priceMonToThu: number;
    priceFriday: number;
    priceSaturday: number;
    priceSunday: number;
    surchargeSunToThu: number;
    surchargeFriSat: number;
}

interface HotelBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotelId: string;
    roomTypeCode: string;
    priceConfig: RoomPriceConfig;
    standardCapacity: number;
    maxCapacity: number;
    onSuccess?: () => void;
}

const HotelBookingModal: React.FC<HotelBookingModalProps> = ({
    isOpen, onClose, hotelId, roomTypeCode, priceConfig, standardCapacity, maxCapacity, onSuccess
}) => {
    const navigate = useNavigate();

    // --- STATE ---
    const [currentStep, setCurrentStep] = useState(HotelBookingStep.DATE_SELECTION);
    const [loading, setLoading] = useState(false);
    const [bookingResult, setBookingResult] = useState<any>(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const [availability, setAvailability] = useState<{
        isAvailable: boolean;
        remainingRooms: number;
        checking: boolean;
    } | null>(null);

    const [bookingConfig, setBookingConfig] = useState({
        checkInDate: '',
        checkOutDate: '',
        guests: standardCapacity,
        quantity: 1,
    });

    // --- VARIABLES (Tính toán ngay trong render để dùng chung) ---
    const currentRooms = Math.max(1, Number(bookingConfig.quantity));
    const minGuestsLimit = standardCapacity * currentRooms;
    const maxGuestsLimit = maxCapacity * currentRooms;

    // --- 🔥 AUTO UPDATE SỐ KHÁCH KHI SỐ PHÒNG THAY ĐỔI ---
    useEffect(() => {
        setBookingConfig(prev => ({
            ...prev,
            guests: prev.quantity * standardCapacity
        }));
    }, [bookingConfig.quantity, standardCapacity]);

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

    // --- LOGIC TÍNH TIỀN ---
    const calculateDynamicTotal = () => {
        if (!bookingConfig.checkInDate || !bookingConfig.checkOutDate) return 0;

        const start = new Date(bookingConfig.checkInDate);
        const end = new Date(bookingConfig.checkOutDate);
        const roomQty = Math.max(1, Number(bookingConfig.quantity));
        const totalGuests = Math.max(1, Number(bookingConfig.guests));

        const totalStandardCapacity = standardCapacity * roomQty;
        const extraPeople = Math.max(0, totalGuests - totalStandardCapacity);

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        let current = new Date(start);
        let totalAmount = 0;
        let nightCount = 0;

        while (current < end) {
            const day = current.getDay();
            let dailyRoomPrice = 0;
            let dailySurchargeUnit = 0;

            if (day === 0) { // CN
                dailyRoomPrice = priceConfig.priceSunday;
                dailySurchargeUnit = priceConfig.surchargeSunToThu;
            } else if (day === 6) { // T7
                dailyRoomPrice = priceConfig.priceSaturday;
                dailySurchargeUnit = priceConfig.surchargeFriSat;
            } else if (day === 5) { // T6
                dailyRoomPrice = priceConfig.priceFriday;
                dailySurchargeUnit = priceConfig.surchargeFriSat;
            } else { // T2-T5
                dailyRoomPrice = priceConfig.priceMonToThu;
                dailySurchargeUnit = priceConfig.surchargeSunToThu;
            }
            if (!dailyRoomPrice) dailyRoomPrice = priceConfig.priceMonToThu;

            totalAmount += (dailyRoomPrice * roomQty);

            if (extraPeople > 0) {
                totalAmount += (extraPeople * dailySurchargeUnit);
            }

            current.setDate(current.getDate() + 1);
            nightCount++;
        }

        if (nightCount === 0) {
            return (priceConfig.priceMonToThu * roomQty) + (extraPeople * priceConfig.surchargeSunToThu);
        }

        return totalAmount;
    };

    const getNightCount = () => {
        if (!bookingConfig.checkInDate || !bookingConfig.checkOutDate) return 0;
        const start = new Date(bookingConfig.checkInDate);
        const end = new Date(bookingConfig.checkOutDate);
        start.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
        const diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
        return diff > 0 ? diff : 1;
    }

    // --- CHECK AVAILABILITY ---
    useEffect(() => {
        const checkRoomAvailability = async () => {
            if (!bookingConfig.checkInDate || !bookingConfig.checkOutDate) return;
            try {
                setAvailability(prev => ({ ...prev, isAvailable: false, remainingRooms: 0, checking: true }));
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
                setAvailability({ isAvailable: false, remainingRooms: 0, checking: false });
            }
        };
        const timeoutId = setTimeout(checkRoomAvailability, 500);
        return () => clearTimeout(timeoutId);
    }, [bookingConfig.checkInDate, bookingConfig.checkOutDate, hotelId, roomTypeCode]);

    // --- HANDLERS ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBookingConfig({ ...bookingConfig, [e.target.name]: e.target.value });
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 1;
        const maxRooms = availability?.remainingRooms || 5;
        const validVal = Math.min(Math.max(1, val), maxRooms);
        setBookingConfig(prev => ({ ...prev, quantity: validVal }));
    };

    const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 1;
        // Sử dụng biến minGuestsLimit và maxGuestsLimit đã tính ở trên
        const validVal = Math.min(Math.max(minGuestsLimit, val), maxGuestsLimit);
        setBookingConfig(prev => ({ ...prev, guests: validVal }));
    };

    const handleContinueToContact = () => {
        if (!bookingConfig.checkInDate || !bookingConfig.checkOutDate) { alert("Vui lòng chọn ngày"); return; }
        if (availability && !availability.isAvailable) { alert("Đã hết phòng."); return; }
        setIsContactModalOpen(true);
    };

    // --- 🔥 HÀM XỬ LÝ ĐẶT PHÒNG (QUAN TRỌNG) ---
    const handleConfirmBooking = async (contactData: ContactData & { notificationChannel?: 'EMAIL' | 'ZALO' }) => {
        setIsContactModalOpen(false);
        try {
            setLoading(true);
            const finalTotal = calculateDynamicTotal();

            const payload: CreateHotelBookingRequest = {
                hotelId: hotelId,
                roomTypeCode: roomTypeCode,
                checkInDate: bookingConfig.checkInDate,
                checkOutDate: bookingConfig.checkOutDate,
                quantity: bookingConfig.quantity,
                numberOfGuests: bookingConfig.guests,
                customerName: contactData.name,
                customerPhone: contactData.phone,
                otp: contactData.otp,
                totalAmount: finalTotal,

                // 👇 LOGIC EMAIL (GIỐNG BookingModal)
                customerEmail: (contactData.notificationChannel === 'ZALO' && !contactData.email)
                    ? ""
                    : contactData.email || "",

                channel: contactData.notificationChannel || 'EMAIL',
                notificationChannel: contactData.notificationChannel || 'EMAIL'
            };

            const res = await roomApi.createBooking(payload);

            if (res && (res.success || res.code === 200)) {
                setBookingResult(res.data);
                setCurrentStep(HotelBookingStep.PAYMENT_QR);
                toast.success("Đặt phòng thành công!");
            } else {
                toast.error("Lỗi: " + (res.message || "Không thể tạo đơn"));
            }

        } catch (error: any) {
            console.error(error);
            toast.error("Đặt phòng thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = () => { if (onSuccess) onSuccess(); onClose(); navigate('/my-tickets'); };

    if (!isOpen) return null;

    // Biến phụ trợ hiển thị
    const extraGuests = Math.max(0, bookingConfig.guests - minGuestsLimit);

    return (
        <>
            {currentStep === HotelBookingStep.DATE_SELECTION && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-2xl relative animate-in zoom-in">
                        <div className="flex justify-between items-center mb-5 border-b pb-3">
                            <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2">
                                <FaHotel /> Đặt phòng
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
                        </div>

                        <div className="space-y-5">
                            {/* Date Picker */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Nhận phòng</label>
                                    <input type="date" name="checkInDate" min={getTomorrowDate()} value={bookingConfig.checkInDate} onChange={handleChange} className="w-full border p-2 rounded text-sm outline-none focus:border-orange-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Trả phòng</label>
                                    <input type="date" name="checkOutDate" min={getMinCheckoutDate()} value={bookingConfig.checkOutDate} onChange={handleChange} className="w-full border p-2 rounded text-sm outline-none focus:border-orange-500" />
                                </div>
                            </div>

                            {/* Availability Alert */}
                            {bookingConfig.checkInDate && bookingConfig.checkOutDate && (
                                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${availability?.checking ? 'bg-gray-100' : (availability?.remainingRooms === 0 ? 'bg-red-100 text-red-700' : 'bg-green-50 text-green-700')}`}>
                                    {availability?.checking ? "Đang kiểm tra..." : (availability?.remainingRooms === 0 ? <><FaExclamationCircle /> Hết phòng!</> : <><FaCheckCircle /> Còn {availability?.remainingRooms} phòng.</>)}
                                </div>
                            )}

                            {/* Quantity Inputs */}
                            <div className="grid grid-cols-2 gap-3 bg-orange-50 p-3 rounded-lg border border-orange-100">
                                <div>
                                    <label className="text-xs font-bold text-orange-800 block mb-1 flex items-center gap-1"><FaBed /> Số phòng</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={availability?.remainingRooms || 5}
                                        value={bookingConfig.quantity}
                                        onChange={handleQuantityChange}
                                        className="w-full border border-orange-200 p-2 rounded text-sm text-center font-bold outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-orange-800 block mb-1 flex items-center gap-1">
                                        <FaUserFriends /> Số khách
                                        <span className="ml-1 text-[10px] font-normal text-gray-500">(Max: {maxGuestsLimit})</span>
                                    </label>
                                    <input
                                        type="number"
                                        min={minGuestsLimit}
                                        max={maxGuestsLimit}
                                        value={bookingConfig.guests}
                                        onChange={handleGuestChange}
                                        className="w-full border border-orange-200 p-2 rounded text-sm text-center font-bold outline-none"
                                    />
                                    <div className="text-[10px] text-center text-gray-500 mt-1">
                                        Tiêu chuẩn: {minGuestsLimit} người
                                    </div>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="bg-gray-50 p-4 rounded border border-gray-200 mt-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-600 font-bold">Tổng tạm tính:</span>
                                    <span className="text-xl font-bold text-orange-600">
                                        {calculateDynamicTotal().toLocaleString()} ₫
                                    </span>
                                </div>
                                <div className="text-right text-xs text-gray-500">
                                    <p>{bookingConfig.quantity} phòng x {getNightCount()} đêm</p>
                                    {extraGuests > 0 ? (
                                        <p className="text-red-500 font-bold mt-1">
                                            + Phụ thu {extraGuests} người
                                        </p>
                                    ) : (
                                        <p className="text-green-600 italic mt-1">Không có phụ thu</p>
                                    )}
                                </div>
                            </div>

                            <button onClick={handleContinueToContact} disabled={loading || (availability !== null && availability.remainingRooms === 0)} className={`w-full py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${(availability !== null && availability.remainingRooms === 0) ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700'}`}>
                                {loading ? 'Đang xử lý...' : (availability?.remainingRooms === 0 ? 'Đã hết phòng' : <>Tiếp tục <FaArrowRight /></>)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <HotelContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} onConfirm={handleConfirmBooking} />
            {currentStep === HotelBookingStep.PAYMENT_QR && <PaymentStepModal isOpen={true} onClose={onClose} paymentData={bookingResult} onPaymentSuccess={() => setCurrentStep(HotelBookingStep.SUCCESS_RECEIPT)} />}
            {currentStep === HotelBookingStep.SUCCESS_RECEIPT && <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60"><div className="bg-white p-8 rounded-lg text-center max-w-sm"><FaCalendarCheck className="text-green-600 text-5xl mx-auto mb-4" /><h3 className="text-2xl font-bold text-green-700">Thành công!</h3><button onClick={handleFinish} className="mt-6 w-full bg-indigo-600 text-white py-2 rounded">Hoàn tất</button></div></div>}
        </>
    );
};

export default HotelBookingModal;