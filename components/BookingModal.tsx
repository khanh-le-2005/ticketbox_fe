import React, { useState } from 'react';
import { TicketSelection } from '../types';
import TicketSelectionModal from './TicketSelectionModal';
import ContactInfoModal, { ContactData } from './ContactInfoModal'; // Import type ContactData từ file mới
import EventReceiptModal from './EventReceiptModal';
import PaymentStepModal from './PaymentStepModal';
import BookingApi, { CreateBookingRequest } from '../api/bookingApi';

enum BookingStep {
    TICKET_SELECTION,
    CONTACT_INFO,
    PAYMENT,
    RECEIPT
}

const BookingModal: React.FC<{isOpen: boolean; onClose: () => void; event: any}> = ({ isOpen, onClose, event }) => {
    const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.TICKET_SELECTION);
    const [ticketSelection, setTicketSelection] = useState<TicketSelection>({});
    const [bookingResult, setBookingResult] = useState<any>(null);

    // Helper tạo Request ID
    const generateRequestId = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const handleTicketConfirm = (selection: TicketSelection) => {
        setTicketSelection(selection);
        setCurrentStep(BookingStep.CONTACT_INFO);
    };

    // --- SỬA LOGIC: KHÔNG CÒN OTP ---
    const handleContactAndBooking = async (data: ContactData) => {
        try {
            const cleanShowId = String(event.id);
            if (!cleanShowId || cleanShowId === "NaN") { alert("Lỗi ID sự kiện"); return; }

            const payload: CreateBookingRequest = {
                showId: cleanShowId,
                customerName: data.name,
                customerEmail: data.email,
                customerPhone: data.phone,
                otp: data.otp, // Gửi OTP từ form
                requestId: generateRequestId(),
                tickets: Object.entries(ticketSelection).map(([code, qty]) => ({
                    ticketTypeCode: code,
                    quantity: Number(qty)
                })).filter(t => t.quantity > 0)
            };

            // Gọi API
            const res = await BookingApi.createBooking(payload);

            if (res && res.success) {
                setBookingResult(res.data);
                setCurrentStep(BookingStep.PAYMENT); // Chuyển sang thanh toán QR luôn
            } else {
                alert(res.message || "Đặt vé thất bại");
            }

        } catch (error: any) {
            console.error("Lỗi đặt vé:", error);
            const msg = error.response?.data?.message || "Lỗi kết nối server";
            alert(`❌ ${msg}`);
        }
    };

    const handlePaymentSuccess = () => {
        setCurrentStep(BookingStep.RECEIPT);
    };

    if (!isOpen) return null;

    return (
        <>
            {currentStep === BookingStep.TICKET_SELECTION && (
                <TicketSelectionModal
                    isOpen={true}
                    onClose={onClose}
                    onConfirm={handleTicketConfirm}
                    ticketTiers={event.ticketTiers}
                    eventName={event.title}
                />
            )}

            {currentStep === BookingStep.CONTACT_INFO && (
                <ContactInfoModal
                    isOpen={true}
                    onClose={() => setCurrentStep(BookingStep.TICKET_SELECTION)}
                    onConfirm={handleContactAndBooking} // Gọi API luôn, không qua bước OTP
                />
            )}

            {currentStep === BookingStep.PAYMENT && (
                <PaymentStepModal
                    isOpen={true}
                    onClose={onClose}
                    paymentData={bookingResult}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
            
            {currentStep === BookingStep.RECEIPT && (
                <EventReceiptModal
                    isOpen={true}
                    onClose={onClose}
                    details={bookingResult}
                />
            )}
        </>
    );
};

export default BookingModal;