import React, { useState, useEffect } from 'react';
import { FaTimes, FaHotel, FaCalendarCheck, FaBed, FaUserFriends, FaArrowRight, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import roomApi from '../api/room_api';
import hotelApi from '../api/hotelApi';
import type { CreateHotelBookingRequest, SpecialPriceItem } from '@/type/room.types';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import PaymentStepModal from './PaymentStepModal';
import HotelContactModal from '../components/HotelContactModal';
import { ContactData } from '@/type/contact.type';
import { toast } from 'react-toastify';
import BookingSuccessModal from './BookingSuccessModal';
import { HotelBookingStep, HotelBookingModalProps } from '@/type/hotel.type';

const HotelBookingModal: React.FC<HotelBookingModalProps> = ({
    isOpen, onClose, hotelId, roomTypeCode, priceConfig, standardCapacity, maxCapacity, onSuccess, initialCheckIn, initialCheckOut
}) => {
    const navigate = useNavigate();

    // --- HELPER FUNCTIONS FOR DATE (FIX TIMEZONE) ---
    const getLocalDateString = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0];
    };

    const getTodayDate = () => getLocalDateString(new Date());

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return getLocalDateString(tomorrow);
    };

    // --- STATE ---
    const [currentStep, setCurrentStep] = useState(HotelBookingStep.DATE_SELECTION);
    const [loading, setLoading] = useState(false);
    const [bookingResult, setBookingResult] = useState<any>(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const [availability, setAvailability] = useState<{
        isAvailable: boolean;
        remainingRooms: number;
        checking: boolean;
    } | null>(null);

    const [specialPrices, setSpecialPrices] = useState<SpecialPriceItem[]>([]);

    const [bookingConfig, setBookingConfig] = useState({
        checkInDate: '',
        checkOutDate: '',
        guests: standardCapacity,
        quantity: 1,
    });

    // --- INITIALIZATION ---
    useEffect(() => {
        if (isOpen) {
            const today = getTodayDate();
            const tomorrow = getTomorrowDate();

            // Bắt buộc ngày nhận phòng phải sau ngày đặt ít nhất 1 ngày
            let finalCheckIn = initialCheckIn || tomorrow;
            if (finalCheckIn < tomorrow) finalCheckIn = tomorrow;

            // Tính checkOut tối thiểu (CheckIn + 1)
            const checkInObj = new Date(finalCheckIn);
            const minOutObj = new Date(checkInObj);
            minOutObj.setDate(minOutObj.getDate() + 1);
            const minCheckOut = getLocalDateString(minOutObj);

            let finalCheckOut = initialCheckOut || minCheckOut;
            if (finalCheckOut <= finalCheckIn) finalCheckOut = minCheckOut;

            setBookingConfig(prev => ({
                ...prev,
                checkInDate: finalCheckIn,
                checkOutDate: finalCheckOut,
            }));
            // Đảm bảo reset về step đầu khi mở modal
            setCurrentStep(HotelBookingStep.DATE_SELECTION);
        }
    }, [isOpen, initialCheckIn, initialCheckOut]);

    // --- FETCH SPECIAL PRICES ---
    useEffect(() => {
        if (hotelId) {
            hotelApi.getSpecialPrices(hotelId)
                .then((res: any) => {
                    if (res.success || res.code === 200) {
                        setSpecialPrices(res.data);
                    }
                })
                .catch(err => console.error("Failed to load special prices", err));
        }
    }, [hotelId]);

    // --- VARIABLES ---
    const currentRooms = Math.max(1, Number(bookingConfig.quantity));
    const minGuestsLimit = standardCapacity * currentRooms;
    const maxGuestsLimit = maxCapacity * currentRooms;

    useEffect(() => {
        setBookingConfig(prev => ({
            ...prev,
            guests: prev.quantity * standardCapacity
        }));
    }, [bookingConfig.quantity, standardCapacity]);

    const getMinCheckoutDate = () => {
        if (bookingConfig.checkInDate) {
            const checkIn = new Date(bookingConfig.checkInDate);
            checkIn.setDate(checkIn.getDate() + 1);
            return getLocalDateString(checkIn);
        }
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 2);
        return getLocalDateString(tomorrow);
    };

    const [apiPriceData, setApiPriceData] = useState<any>(null);
    const [modalRealtimePrice, setModalRealtimePrice] = useState<number>(0);

    const fetchModalRoomPrice = async () => {
        if (!hotelId || !roomTypeCode || !bookingConfig.checkInDate) return;

        // 1. Check if date has special price locally
        const specialEntry = specialPrices.find(sp =>
            sp.date === bookingConfig.checkInDate &&
            sp.roomTypeCode === roomTypeCode
        );

        if (specialEntry) {
            setModalRealtimePrice(specialEntry.price);
            return;
        }

        try {
            const res: any = await hotelApi.getRoomPrice(hotelId, roomTypeCode, bookingConfig.checkInDate);
            const priceData = res.data?.data || res.data;
            if (priceData && typeof priceData.price === 'number' && priceData.price > 0) {
                setModalRealtimePrice(priceData.price);
            }
        } catch (error) {
            console.error("Lỗi lấy giá phòng theo ngày trong modal:", error);
        }
    };

    useEffect(() => {
        fetchModalRoomPrice();
    }, [bookingConfig.checkInDate, hotelId, roomTypeCode, specialPrices]);

    const fetchCalculatedPrice = async () => {
        if (!bookingConfig.checkInDate || !bookingConfig.checkOutDate) return;
        try {
            const payload = {
                hotelId: hotelId,
                roomTypeCode: roomTypeCode,
                checkIn: bookingConfig.checkInDate,
                checkOut: bookingConfig.checkOutDate,
                checkInDate: bookingConfig.checkInDate,
                checkOutDate: bookingConfig.checkOutDate,
                quantity: Number(bookingConfig.quantity),
                numberOfGuests: Number(bookingConfig.guests),
                // Add numberOfRooms as requested by user
                numberOfRooms: Number(bookingConfig.quantity),
            };
            const res: any = await hotelApi.calculatePrice(payload);
            if (res.success || res.code === 200) {
                // Backend may return totalAmount, totalPrice, or currentPrice
                const data = res.data;
                // Normalize the total price
                const finalTotal = data.totalAmount || data.totalPrice || data.currentPrice;

                setApiPriceData({
                    ...data,
                    totalPrice: finalTotal, // Ensure we always have a totalPrice property to rely on
                    dailyBreakdown: data.dailyBreakdown || []
                });
            }
        } catch (error) {
            console.error("Lỗi tính giá từ API:", error);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(fetchCalculatedPrice, 500);
        return () => clearTimeout(timeoutId);
    }, [bookingConfig.checkInDate, bookingConfig.checkOutDate, bookingConfig.quantity, bookingConfig.guests]);

    const calculateDynamicTotal = () => {
        const apiTotal = apiPriceData?.currentPrice || apiPriceData?.totalPrice;

        // Use API total if available (handles mixed rates: standard + special days)
        if (apiTotal && apiTotal > 0) {
            return apiTotal;
        }

        // Fallback: Estimate based on first night's price + surcharge
        const currentRefPrice = modalRealtimePrice || priceConfig.currentPrice || 0;
        if (currentRefPrice > 0) {
            const nights = getNightCount();
            return (currentRefPrice * bookingConfig.quantity * nights) + (apiPriceData?.surchargeTotal || 0);
        }

        return 0;
    };

    const getNightCount = () => {
        if (!bookingConfig.checkInDate || !bookingConfig.checkOutDate) return 0;
        const start = new Date(bookingConfig.checkInDate);
        const end = new Date(bookingConfig.checkOutDate);
        const diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
        return diff > 0 ? Math.round(diff) : 1;
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
                        checkOut: bookingConfig.checkOutDate,
                        _t: new Date().getTime()
                    }
                });

                if (res.data) {
                    setAvailability({
                        isAvailable: res.data.isAvailable,
                        remainingRooms: res.data.remainingRooms,
                        checking: false
                    });
                    if (bookingConfig.quantity > res.data.remainingRooms) {
                        setBookingConfig(prev => ({ ...prev, quantity: Math.max(1, res.data.remainingRooms) }));
                    }
                }
            } catch (error) {
                setAvailability({ isAvailable: false, remainingRooms: 0, checking: false });
            }
        };
        const timeoutId = setTimeout(checkRoomAvailability, 500);
        return () => clearTimeout(timeoutId);
    }, [bookingConfig.checkInDate, bookingConfig.checkOutDate, hotelId, roomTypeCode, refreshKey]);

    // --- HANDLERS ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBookingConfig(prev => {
            const newState = { ...prev, [name]: value };

            // Auto-set checkOutDate to the next day when checkInDate changes
            if (name === 'checkInDate' && value) {
                const checkIn = new Date(value);
                const nextDay = new Date(checkIn);
                nextDay.setDate(nextDay.getDate() + 1);
                newState.checkOutDate = getLocalDateString(nextDay);
            }

            return newState;
        });
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 1;
        const maxRooms = availability?.remainingRooms || 5;
        const validVal = Math.min(Math.max(1, val), maxRooms);
        setBookingConfig(prev => ({ ...prev, quantity: validVal }));
    };

    const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 1;
        const validVal = Math.min(Math.max(minGuestsLimit, val), maxGuestsLimit);
        setBookingConfig(prev => ({ ...prev, guests: validVal }));
    };

    const handleContinueToContact = () => {
        const tomorrow = getTomorrowDate();
        if (!bookingConfig.checkInDate || bookingConfig.checkInDate < tomorrow) {
            toast.error("Ngày nhận phòng phải sau ngày đặt phòng ít nhất 1 ngày.");
            return;
        }
        if (!bookingConfig.checkOutDate || bookingConfig.checkOutDate <= bookingConfig.checkInDate) {
            toast.error("Ngày trả phòng không hợp lệ.");
            return;
        }
        if (availability && !availability.isAvailable) {
            toast.error("Rất tiếc, loại phòng này hiện không còn trống.");
            return;
        }
        setIsContactModalOpen(true);
    };

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
                quantity: Number(bookingConfig.quantity),
                numberOfGuests: Number(bookingConfig.guests),
                customerName: contactData.name,
                customerPhone: contactData.phone,
                otp: contactData.otp,
                totalAmount: Number(finalTotal),
                currentPrice: Number(finalTotal),
                customerEmail: contactData.email || "",
                channel: contactData.notificationChannel || 'EMAIL',
                notificationChannel: contactData.notificationChannel || 'EMAIL'
            };

            const res = await roomApi.createBooking(payload);

            if (res && (res.success || res.code === 200)) {
                setBookingResult(res.data);
                setCurrentStep(HotelBookingStep.PAYMENT_QR);
                toast.success("Đơn hàng đã được tạo!");
            } else {
                toast.error("Lỗi: " + (res.message || "Không thể tạo đơn"));
            }

        } catch (error: any) {
            console.error("Lỗi tạo booking:", error);
            const backendMsg = error?.response?.data?.message || error?.response?.data?.error;
            if (backendMsg && (backendMsg.includes("future date") || backendMsg.includes("tương lai"))) {
                toast.error("Ngày nhận phòng phải là ngày trong tương lai.");
            } else if (backendMsg) {
                toast.error(`Đặt phòng thất bại: ${backendMsg}`);
            } else {
                toast.error("Đặt phòng thất bại. Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = () => {
        onClose();
        navigate('/my-tickets');
    };

    if (!isOpen) return null;
    const extraGuests = Math.max(0, bookingConfig.guests - minGuestsLimit);

    return (
        <div translate="no" className="notranslate">
            {currentStep === HotelBookingStep.DATE_SELECTION && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-2xl relative animate-in zoom-in">
                        <div className="flex justify-between items-center mb-5 border-b pb-3">
                            <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2">
                                <FaHotel /> <span>Đặt phòng</span>
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1"><span>Nhận phòng</span></label>
                                    <input
                                        type="date"
                                        name="checkInDate"
                                        min={getTomorrowDate()}
                                        value={bookingConfig.checkInDate}
                                        onChange={handleChange}
                                        className="block w-full bg-white text-gray-900 border border-gray-300 rounded-lg h-12 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1"><span>Trả phòng</span></label>
                                    <input
                                        type="date"
                                        name="checkOutDate"
                                        min={getMinCheckoutDate()}
                                        value={bookingConfig.checkOutDate}
                                        onChange={handleChange}
                                        className="block w-full bg-white text-gray-900 border border-gray-300 rounded-lg h-12 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>

                            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${availability?.checking ? 'bg-gray-100' : (availability?.remainingRooms === 0 ? 'bg-red-100 text-red-700' : 'bg-green-50 text-green-700')}`}>
                                {availability?.checking ? <span>Đang kiểm tra...</span> : (availability?.remainingRooms === 0 ? <><FaExclamationCircle /> <span>Hết phòng!</span></> : <><FaCheckCircle /> <span>Còn {availability?.remainingRooms} phòng.</span></>)}
                            </div>

                            <div className="grid grid-cols-2 gap-3 bg-orange-50 p-3 rounded-lg border border-orange-100">
                                <div>
                                    <label className="text-xs font-bold text-orange-800 block mb-1 flex items-center gap-1"><FaBed /> <span>Số phòng</span></label>
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
                                        <FaUserFriends /> <span>Số khách (Max: {maxGuestsLimit})</span>
                                    </label>
                                    <input
                                        type="number"
                                        min={minGuestsLimit}
                                        max={maxGuestsLimit}
                                        value={bookingConfig.guests}
                                        onChange={handleGuestChange}
                                        className="w-full border border-orange-200 p-2 rounded text-sm text-center font-bold outline-none"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded border border-gray-200 mt-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-600 font-bold"><span>Tổng tạm tính:</span></span>
                                    <span className="text-xl font-bold text-orange-600">
                                        <span>{calculateDynamicTotal().toLocaleString()} ₫</span>
                                    </span>
                                </div>
                                <div className="text-right text-xs text-gray-500">
                                    <p><span>{bookingConfig.quantity} phòng x {getNightCount()} đêm</span></p>
                                    {apiPriceData?.surchargeTotal > 0 && (
                                        <p className="text-red-500 font-bold mt-1">
                                            <span>+ Phụ thu {apiPriceData.surchargeTotal.toLocaleString()} ₫</span>
                                        </p>
                                    )}

                                    {/* Daily Breakdown Details */}
                                    {apiPriceData?.dailyBreakdown?.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <details className="group">
                                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-orange-600 text-xs">
                                                    <span>Chi tiết giá theo ngày</span>
                                                    <span className="transition group-open:rotate-180 inline-block transform rotate-90">
                                                        <FaArrowRight size={10} />
                                                    </span>
                                                </summary>
                                                <div className="text-gray-600 mt-2 space-y-1 text-xs">
                                                    {apiPriceData.dailyBreakdown.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between">
                                                            <span className="text-gray-500">{item.date} ({item.note || 'Ngày thường'})</span>
                                                            <span className="font-medium">
                                                                {(item.price + (item.surcharge || 0)).toLocaleString()} ₫
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </details>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleContinueToContact}
                                disabled={loading || (availability !== null && availability.remainingRooms === 0)}
                                className={`w-full py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${(availability !== null && availability.remainingRooms === 0) ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                            >
                                {loading ? <span>Đang xử lý...</span> : (availability?.remainingRooms === 0 ? <span>Đã hết phòng</span> : <><span>Tiếp tục</span> <FaArrowRight /></>)}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <HotelContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} onConfirm={handleConfirmBooking} />

            <PaymentStepModal
                isOpen={currentStep === HotelBookingStep.PAYMENT_QR}
                onClose={onClose}
                paymentData={bookingResult}
                onPaymentSuccess={() => {
                    if (onSuccess) onSuccess();
                    setRefreshKey(prev => prev + 1);
                    setCurrentStep(HotelBookingStep.SUCCESS_RECEIPT);
                    toast.success("Thanh toán thành công!");
                }}
            />

            <BookingSuccessModal
                isOpen={currentStep === HotelBookingStep.SUCCESS_RECEIPT}
                onFinish={handleFinish}
            />
        </div>
    );
};

export default HotelBookingModal;