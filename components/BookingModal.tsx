// src/components/BookingModal.tsx

import React, { useState } from 'react';
import { Event, BookingDetails, ContactInfo, TicketSelection } from '../types';
import TicketSelectionModal from './TicketSelectionModal';
import ContactInfoModal from './ContactInfoModal';
import OtpVerificationModal from './OtpVerificationModal';
// Đã XÓA import QrVerificationModal để hết lỗi
import EventReceiptModal from './EventReceiptModal';
import BookingSuccessToast from './BookingSuccessToast';

import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { BookingAPI } from '../api/bookingApi'; 

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event;
}

// Các bước đặt vé
enum BookingStep {
    TICKET_SELECTION,
    CONTACT_INFO,
    OTP_VERIFICATION,
    RECEIPT
    // Đã XÓA bước QR_VERIFICATION
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, event }) => {
    const { user } = useAuth();
    // const navigate = useNavigate(); // Nếu không dùng navigate trong file này thì có thể xóa luôn

    const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.TICKET_SELECTION);
    const [ticketSelection, setTicketSelection] = useState<TicketSelection>({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [contactInfo, setContactInfo] = useState<ContactInfo>({ phone: '', email: '' });
    const [bookingResult, setBookingResult] = useState<BookingDetails | null>(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    // --- 1. CHỌN VÉ XONG ---
    const handleTicketConfirm = (selection: TicketSelection, price: number) => {
        setTicketSelection(selection);
        setTotalPrice(price);
        setCurrentStep(BookingStep.CONTACT_INFO);
    };

    // --- 2. NHẬP THÔNG TIN XONG ---
    const handleContactConfirm = (info: ContactInfo) => {
        setContactInfo(info);
        setCurrentStep(BookingStep.OTP_VERIFICATION);
    };

    // --- 3. XÁC THỰC OTP XONG -> GỌI API ĐẶT VÉ ---
    const handleOtpConfirm = async () => {
        setIsConfirming(true);
        try {
            // Chuẩn bị dữ liệu
            const ticketOrders = Object.entries(ticketSelection)
                .filter(([, qty]) => (qty as number) > 0)
                .map(([tierName, qty]) => ({
                    ticketTypeName: tierName, 
                    quantity: Number(qty)
                }));

            const bookingPayload = {
                showId: event.id,
                customerName: user?.email || "Khách hàng",
                customerEmail: contactInfo.email,
                customerPhone: contactInfo.phone,
                ticketOrders: ticketOrders
            };

            // Gọi API
            const res = await BookingAPI.createBooking(bookingPayload);
            const newBooking = res.data;

            // Map kết quả
            const finalDetails: BookingDetails = {
                bookingId: newBooking.bookingCode || "BK-" + Date.now(),
                event: event,
                ticketSelection: ticketSelection,
                tickets: newBooking.tickets?.map((t: any) => ({
                    code: t.ticketCode,
                    tierName: t.ticketTypeName
                })) || [],
                totalPrice: newBooking.totalAmount || totalPrice,
                contactInfo: contactInfo,
                timestamp: new Date().toISOString()
            };

            setBookingResult(finalDetails);
            
            // Lưu local storage (tùy chọn)
            const currentBookings = JSON.parse(localStorage.getItem('myEventBookings') || '[]');
            localStorage.setItem('myEventBookings', JSON.stringify([finalDetails, ...currentBookings]));

            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
            setCurrentStep(BookingStep.RECEIPT);

        } catch (error) {
            console.error("Lỗi đặt vé:", error);
            alert("Đặt vé thất bại. Vui lòng thử lại.");
        } finally {
            setIsConfirming(false);
        }
    };

    // --- 4. ĐÓNG MODAL ---
    const handleCloseAll = () => {
        setCurrentStep(BookingStep.TICKET_SELECTION);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <BookingSuccessToast 
                message="Đặt vé thành công! Vui lòng kiểm tra email." 
                isVisible={showSuccessToast} 
            />

            {currentStep === BookingStep.TICKET_SELECTION && (
                <TicketSelectionModal
                    isOpen={true}
                    onClose={onClose}
                    onConfirm={handleTicketConfirm}
                    ticketTiers={event.ticketTiers || []}
                    eventName={event.title}
                />
            )}

            {currentStep === BookingStep.CONTACT_INFO && (
                <ContactInfoModal
                    isOpen={true}
                    onClose={onClose}
                    onConfirm={handleContactConfirm}
                />
            )}

            {currentStep === BookingStep.OTP_VERIFICATION && (
                <OtpVerificationModal
                    isOpen={true}
                    onClose={onClose}
                    onConfirm={handleOtpConfirm}
                    contactInfo={contactInfo}
                />
            )}
            
            {/* Bước RECEIPT: Hiển thị hóa đơn cuối cùng */}
            {currentStep === BookingStep.RECEIPT && bookingResult && (
                <EventReceiptModal
                    isOpen={true}
                    onClose={handleCloseAll}
                    details={bookingResult}
                />
            )}
        </>
    );
};

export default BookingModal;