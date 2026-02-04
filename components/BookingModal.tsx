import React, { useState } from 'react';
import { TicketSelection } from '../types';
import TicketSelectionModal from './TicketSelectionModal';
import ContactInfoModal from './ContactInfoModal';
import { ContactData } from '@/type/contact.type';
import EventReceiptModal from './EventReceiptModal';
import PaymentStepModal from './PaymentStepModal';
import BookingApi from '../api/bookingApi';
import { toast } from 'react-toastify';

enum BookingStep {
    TICKET_SELECTION,
    CONTACT_INFO,
    PAYMENT,
    RECEIPT
}

const BookingModal: React.FC<{ isOpen: boolean; onClose: () => void; event: any }> = ({ isOpen, onClose, event }) => {
    const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.TICKET_SELECTION);
    const [ticketSelection, setTicketSelection] = useState<TicketSelection>({});
    const [bookingResult, setBookingResult] = useState<any>(null);
    const [lastPayload, setLastPayload] = useState<any>(null);

    // Helper tạo Request ID
    const generateRequestId = () => {
        const timestamp = Date.now().toString().slice(-6); // Lấy 6 số cuối của thời gian
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3 số ngẫu nhiên
        return `MM${timestamp}${random}`;
    };
    // console.log("🚀 ~ BookingModal ~ generateRequestId:", generateRequestId())
    const handleTicketConfirm = (selection: TicketSelection) => {
        setTicketSelection(selection);
        setCurrentStep(BookingStep.CONTACT_INFO);
    };

    const handleContactAndBooking = async (contactData: ContactData) => {
        try {

            // 1. Chuẩn hóa danh sách vé
            let formattedTickets = [];
            if (Array.isArray(ticketSelection)) {
                formattedTickets = ticketSelection;
            } else {
                formattedTickets = Object.entries(ticketSelection)
                    .map(([code, qty]) => ({
                        ticketTypeCode: code,
                        quantity: Number(qty)
                    }))
                    .filter((t) => t.quantity > 0);
            }
            const payload = {
                ...contactData,
                showId: event.id,
                requestId: generateRequestId(),
                tickets: formattedTickets,
            };

            setLastPayload(payload);

            console.log("🔥 PAYLOAD GỬI ĐI:", payload);

            const response = await BookingApi.createBooking(payload);

            if (response.data) {
                console.log("KẾT QUẢ TẠO ĐƠN:", response.data);

                setBookingResult(response.data);
                setCurrentStep(BookingStep.PAYMENT);
                toast.success("Đặt vé thành công! Vui lòng thanh toán.");
            }

        } catch (error: any) {
            console.error("Lỗi tạo booking:", error);
            const backendMsg = error?.response?.data?.message || error?.response?.data?.error;
            if (backendMsg) {
                toast.error(`Lỗi tạo booking: ${backendMsg}`);
            } else {
                toast.error("Có lỗi khi tạo đơn hàng. Vui lòng thử lại.");
            }
        }
    };


    const handlePaymentSuccess = async () => {
        setCurrentStep(BookingStep.RECEIPT);
    }

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
                    details={{ ...bookingResult, channel: lastPayload?.channel }}


                />
            )}
        </>
    );
};

export default BookingModal;