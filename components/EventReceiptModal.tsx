import React from 'react';
import { EventReceiptModalProps } from '../types';
import { FaTimes, FaCheckCircle, FaPrint, FaTicketAlt } from 'react-icons/fa';

const EventReceiptModal: React.FC<EventReceiptModalProps> = ({ isOpen, onClose, details }) => {
    if (!isOpen || !details) return null;

    const handlePrint = () => {
        window.print();
    };

    const ticketDetailsString = Object.entries(details.ticketSelection)
        .filter(([, quantity]) => (quantity as number) > 0)
        .map(([tierName, quantity]) => `${quantity}x ${tierName}`)
        .join(', ');

    const qrData = encodeURIComponent(
        `Booking ID: ${details.bookingId}\n` +
        `Event: ${details.event.title}\n` +
        `Tickets: ${ticketDetailsString}\n` +
        `Email: ${details.contactInfo.email}`
    );
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}&margin=10`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 print:bg-gray-100 print:block print:p-8 print-container py-10">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all animate-fade-in-up relative receipt-content max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 print:hidden">
                    <FaTimes size={20} />
                </button>
                
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col-reverse items-center text-center sm:flex-row sm:text-left sm:justify-between sm:items-start">
                         <div className='mt-4 sm:mt-0'>
                            <h2 className="text-2xl font-bold text-gray-800">Hóa đơn đặt vé</h2>
                            <p className="text-sm text-gray-500">Mã đặt vé: <span className="font-mono text-gray-700">{details.bookingId}</span></p>
                        </div>
                        <img src={qrCodeUrl} alt="Booking QR Code" className="w-28 h-28 border p-1 bg-white flex-shrink-0" />
                    </div>
                    <div className="mt-4 flex items-center justify-center sm:justify-start space-x-2 text-green-600">
                        <FaCheckCircle size={24} />
                        <span className="text-lg font-semibold">Đặt vé thành công!</span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">Thông tin sự kiện</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-lg font-bold text-indigo-700">{details.event.title}</p>
                            <p className="text-sm text-gray-600">{details.event.fullLocation || details.event.location}</p>
                             {details.event.date && <p className="text-sm text-gray-600">Ngày {details.event.date.day}/{details.event.date.month.replace('Thg ', '')}/{details.event.date.year} {details.event.time ? `lúc ${details.event.time}` : ''}</p>}
                        </div>
                    </div>

                    <div className="mb-6">
                         <h3 className="font-semibold text-gray-700 mb-2">Chi tiết mã vé</h3>
                         {details.tickets && details.tickets.length > 0 ? (
                            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-48 overflow-y-auto">
                                {details.tickets.map((ticket, index) => (
                                    <div key={index} className="p-3 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <FaTicketAlt className="text-orange-500 mr-2" />
                                            <span className="font-medium text-gray-800">{ticket.tierName}</span>
                                        </div>
                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">{ticket.code}</span>
                                    </div>
                                ))}
                            </div>
                         ) : (
                            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                {Object.entries(details.ticketSelection).filter(([, quantity]) => (quantity as number) > 0).map(([tierName, quantity]) => (
                                    <div key={tierName} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">{quantity} x {tierName}</span>
                                    </div>
                                ))}
                            </div>
                         )}
                    </div>
                     
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Thông tin liên hệ</h3>
                        <p className="text-sm text-gray-600">Email: {details.contactInfo.email}</p>
                        <p className="text-sm text-gray-600">SĐT: {details.contactInfo.phone}</p>
                    </div>

                     <div className="flex justify-between items-center text-lg font-bold pt-4 border-t mt-4">
                        <span className="text-gray-800">TỔNG CỘNG:</span>
                        <span className="text-orange-500 text-2xl">
                            {details.totalPrice.toLocaleString('vi-VN')} ₫
                        </span>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-b-lg flex justify-end space-x-3 print:hidden">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300">
                        Đóng
                    </button>
                    <button 
                        onClick={handlePrint} 
                        className="px-6 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center space-x-2"
                    >
                        <FaPrint/>
                        <span>In hóa đơn</span>
                    </button>
                </div>
            </div>
            
            <style>{`
                @media print {
                    body {
                        background-color: #f3f4f6 !important;
                    }
                    body > *:not(.print-container) {
                        display: none;
                    }
                    .print-container { padding: 0 !important; }
                    .receipt-content {
                        margin: 0 auto;
                        box-shadow: none !important;
                        border: 1px solid #ddd;
                        max-width: 8.5in;
                        border-radius: 0 !important;
                        max-height: none !important;
                        overflow: visible !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default EventReceiptModal;