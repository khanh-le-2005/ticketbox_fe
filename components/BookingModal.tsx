import React, { useState } from 'react';
import { TicketSelection } from '../types';
import TicketSelectionModal from './TicketSelectionModal';
import ContactInfoModal from './ContactInfoModal';
import { ContactData } from '@/type/contact.type'; // Import type ContactData từ file đúng
import EventReceiptModal from './EventReceiptModal';
import PaymentStepModal from './PaymentStepModal';
import BookingApi from '../api/bookingApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [loading, setLoading] = useState(false);

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
    // Trong BookingModal.tsx

    const handleContactAndBooking = async (contactData: ContactData & { channel?: string }) => {
        try {
            setLoading(true);

            // 👇 BƯỚC 1: Chuyển đổi tickets từ Object sang Array
            // Giả sử selectedTickets đang là: { "VIP": 2, "STD": 1 }
            // Cần chuyển thành: [{ ticketTypeCode: "VIP", quantity: 2 }, ...]

            let formattedTickets = [];
            // ticketSelection is a state variable: { "VIP": 2, "STD": 1 }
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
                showId: event.id,
                tickets: formattedTickets,
                customerName: contactData.name,
                customerPhone: contactData.phone,
                otp: contactData.otp,
                customerEmail: (contactData.channel === 'ZALO' && !contactData.email)
                    ? ""
                    : contactData.email,
                channel: contactData.channel
            };

            console.log("Payload Final:", payload);
            const response = await BookingApi.createBooking(payload);

            if (response.data) {
                setBookingResult(response.data);
                setCurrentStep(BookingStep.PAYMENT);
                toast.success("Đặt vé thành công! Vui lòng thanh toán.");
            }

        } catch (error: any) {
            console.error("Lỗi:", error);
            // ...
        } finally {
            setLoading(false);
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