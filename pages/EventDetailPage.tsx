
import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaEnvelope, FaFacebook, FaMapMarkerAlt, FaPhone, FaShareAlt, FaTwitter } from 'react-icons/fa';

import ContactInfoModal from '../components/ContactInfoModal';
import EventReceiptModal from '../components/EventReceiptModal';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import QrVerificationModal from '../components/QrVerificationModal';
import TicketSelectionModal from '../components/TicketSelectionModal';
import OtpVerificationModal from '../components/OtpVerificationModal';
import { ARTS_EVENTS, FEATURED_EVENTS_SLIDER, HIGHLIGHTED_EVENTS, MUSIC_EVENTS, TOURISM_EVENTS } from '../constants';
import { ContactInfo, EventBookingDetails, TicketSelection, TicketTier, TicketItem } from '../types';

type BookingStep = 'closed' | 'selectingTickets' | 'enteringContact' | 'verifyingOtp' | 'qrVerification' | 'receipt';

const EventDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const allEvents = [...FEATURED_EVENTS_SLIDER, ...HIGHLIGHTED_EVENTS, ...MUSIC_EVENTS, ...TOURISM_EVENTS, ...ARTS_EVENTS];
    const event = allEvents.find(e => e.id === Number(id));

    const [bookingStep, setBookingStep] = useState<BookingStep>('closed');
    const [currentSelection, setCurrentSelection] = useState<{ tickets: TicketSelection, price: number } | null>(null);
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [bookingDetails, setBookingDetails] = useState<EventBookingDetails | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    // Helper to force high resolution
    const getHighResUrl = (url: string) => {
        return url.replace(/\/\d+\/\d+$/, '/1600/900');
    };

    const effectiveTicketTiers = useMemo((): TicketTier[] => {
        if (!event) return [];
        if (event.ticketTiers && event.ticketTiers.length > 0) {
            return event.ticketTiers;
        }
        if (event.price && event.price !== 'Miễn phí') {
            return [{
                name: 'Vé tiêu chuẩn',
                price: event.price.replace('+', '') + ' VNĐ',
                type: 'Vé thường',
                description: 'Vé vào cửa sự kiện.'
            }];
        }
        return [];
    }, [event]);

    const qrCodeData = useMemo(() => {
        if (!event || !contactInfo || !currentSelection) return '';
        const ticketDetailsString = Object.entries(currentSelection.tickets)
            .filter(([, quantity]) => (quantity as number) > 0)
            .map(([tierName, quantity]) => `${quantity}x ${tierName}`)
            .join(', ');
        return `Event: ${event.title}\nTickets: ${ticketDetailsString}\nEmail: ${contactInfo.email}`;
    }, [event, contactInfo, currentSelection]);

    // Step 1: User clicks "Buy Ticket"
    const handleBuyTicketClick = () => {
        setBookingStep('selectingTickets');
    };

    // Step 2: User confirms ticket selection, proceed to contact info
    const handleProceedToContact = (selection: TicketSelection, newTotalPrice: number) => {
        setCurrentSelection({ tickets: selection, price: newTotalPrice });
        setBookingStep('enteringContact');
    };

    // Step 3: User confirms contact info, proceed to OTP verification
    const handleContactInfoConfirmed = (confirmedContactInfo: ContactInfo) => {
        setContactInfo(confirmedContactInfo);
        setBookingStep('verifyingOtp');
    };

    // Step 4: User confirms OTP, proceed to QR verification
    const handleOtpVerified = () => {
        setBookingStep('qrVerification');
    };

    // Step 5: User 'scans' QR, finalize booking and show receipt
    const handleFinalizeBooking = () => {
        if (!currentSelection || !event || !contactInfo) return;

        setIsConfirming(true);
        setTimeout(() => {
            const bookingId = `EVT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

            // Generate individual tickets
            const generatedTickets: TicketItem[] = [];
            Object.entries(currentSelection.tickets).forEach(([tierName, quantity]) => {
                for (let i = 0; i < (quantity as number); i++) {
                    // Create a unique code for each ticket: E.g., TIER-RANDOM
                    const uniqueCode = `${tierName.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
                    generatedTickets.push({
                        code: uniqueCode,
                        tierName: tierName
                    });
                }
            });

            const details: EventBookingDetails = {
                bookingId,
                event,
                ticketSelection: currentSelection.tickets,
                tickets: generatedTickets,
                totalPrice: currentSelection.price,
                contactInfo,
            };

            try {
                const existingBookings = JSON.parse(localStorage.getItem('myEventBookings') || '[]') as EventBookingDetails[];
                const newBookings = [...existingBookings, details];
                localStorage.setItem('myEventBookings', JSON.stringify(newBookings));
            } catch (error) {
                console.error("Failed to save event booking to local storage", error);
            }

            setBookingDetails(details);
            setIsConfirming(false);
            setBookingStep('receipt');
        }, 1500);
    };

    const closeAllModalsAndReset = () => {
        setBookingStep('closed');
        setCurrentSelection(null);
        setContactInfo(null);
        setBookingDetails(null);
    }

    if (!event) {
        return (
            <div className="bg-gray-50 min-h-screen flex flex-col">
                <Header />
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold text-gray-800">404 - Không tìm thấy sự kiện</h1>
                    <p className="mt-4 text-gray-600">Rất tiếc, chúng tôi không thể tìm thấy sự kiện bạn đang tìm kiếm.</p>
                    <Link to="/" className="mt-8 inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
                        Quay về trang chủ
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <Navbar />
            <main className="pb-8">
                {/* Banner Section - Static Image instead of Slider */}
                <div className="relative w-full mt-8">
                    <div className="w-full aspect-video md:aspect-[21/9] bg-gray-900 relative overflow-hidden">
                        {/* Background Layer: Scaled & Blurred to fill space */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src={getHighResUrl(event.imageUrl)}
                                alt=""
                                className="w-full h-full object-cover blur-md opacity-50 scale-110"
                            />
                        </div>

                        {/* Foreground Layer: Contained Image */}
                        <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                            <img
                                src={getHighResUrl(event.imageUrl)}
                                alt={event.title}
                                className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg relative">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-6 gap-y-2">
                                {event.time && (
                                    <div className="flex items-center">
                                        <FaClock className="mr-2" />
                                        <span>{event.time}</span>
                                    </div>
                                )}
                                {event.date && (
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-2" />
                                        <span>Ngày {event.date.day} tháng {event.date.month.replace('Thg ', '')}, {event.date.year}</span>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <FaMapMarkerAlt className="mr-2" />
                                    <span>{event.fullLocation || event.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Main Content */}
                            <div className="w-full md:w-2/3">
                                <div className="border-t border-gray-200 pt-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase">Giới thiệu về sự kiện</h2>
                                    <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-6">{event.description}</p>

                                    {/* Additional image in content */}
                                    <img
                                        src={getHighResUrl(event.imageUrl)}
                                        alt={event.title}
                                        className="w-full rounded-lg shadow-md mb-6 object-cover"
                                    />

                                    {event.lineup && event.ticketTiers && (
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase">Thông tin chi tiết</h2>
                                            <div className="space-y-4 text-gray-700">
                                                <p><strong>3. Dàn line-up chính thức:</strong> {event.lineup.join(' - ')}</p>
                                                <div>
                                                    <p><strong>4. Bảng giá vé & Sơ đồ chính thức:</strong></p>
                                                    <ul className="list-disc list-inside ml-4 mt-2">
                                                        {event.ticketTiers.map(tier => (
                                                            <li key={tier.name}>
                                                                {tier.name}: {tier.price} ({tier.type})
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {event.seatingChartUrl && (
                                        <img src={event.seatingChartUrl} alt="Sơ đồ sân khấu" className="w-full rounded-lg shadow-md mt-6" />
                                    )}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="w-full md:w-1/3">
                                <div className="border rounded-lg p-4 sticky top-24">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-gray-600">Chia sẻ</span>
                                        <div className="flex space-x-2">
                                            <a href="#" className="text-gray-500 hover:text-blue-600"><FaFacebook size={20} /></a>
                                            <a href="#" className="text-gray-500 hover:text-sky-500"><FaTwitter size={20} /></a>
                                            <a href="#" className="text-gray-500 hover:text-red-500"><FaEnvelope size={20} /></a>
                                            <a href="#" className="text-gray-500 hover:text-gray-800"><FaShareAlt size={20} /></a>
                                        </div>
                                    </div>
                                    <div className="border-t pt-4 text-sm text-gray-600 space-y-2">
                                        <p>Liên hệ bộ phận chăm sóc khách hàng</p>
                                        <p className="flex items-center"><FaEnvelope className="mr-2" /> Email: chamsockhachhang@ticketgo.vn</p>
                                        <p className="flex items-center"><FaPhone className="mr-2" /> Vui lòng gọi: <a href="tel:089980818" className="text-orange-500 font-semibold ml-1">08.99.80.818</a></p>
                                    </div>
                                    {effectiveTicketTiers.length > 0 && (
                                        <button
                                            onClick={handleBuyTicketClick}
                                            className="mt-6 w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors text-lg"
                                        >
                                            Mua vé ngay
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {/* Modals */}
            {effectiveTicketTiers.length > 0 && (
                <TicketSelectionModal
                    isOpen={bookingStep === 'selectingTickets'}
                    onClose={closeAllModalsAndReset}
                    onConfirm={handleProceedToContact}
                    ticketTiers={effectiveTicketTiers}
                    eventName={event.title}
                />
            )}
            <ContactInfoModal
                isOpen={bookingStep === 'enteringContact'}
                onClose={closeAllModalsAndReset}
                onConfirm={handleContactInfoConfirmed}
            />
            <OtpVerificationModal
                isOpen={bookingStep === 'verifyingOtp'}
                onClose={closeAllModalsAndReset}
                onConfirm={handleOtpVerified}
                contactInfo={contactInfo}
            />
            <QrVerificationModal
                isOpen={bookingStep === 'qrVerification'}
                onClose={closeAllModalsAndReset}
                onConfirm={handleFinalizeBooking}
                isConfirming={isConfirming}
                qrCodeData={qrCodeData}
            />
            <EventReceiptModal
                isOpen={bookingStep === 'receipt'}
                onClose={closeAllModalsAndReset}
                details={bookingDetails}
            />
        </div>
    );
};

export default EventDetailPage;