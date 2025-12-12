// src/components/EventReceiptModal.tsx

import React from 'react';
import { EventReceiptModalProps } from '../types';
import { FaTimes, FaCheckCircle, FaPrint, FaTicketAlt } from 'react-icons/fa';

const EventReceiptModal: React.FC<EventReceiptModalProps> = ({ isOpen, onClose, details }) => {
    if (!isOpen || !details) return null;

    const handlePrint = () => {
        window.print();
    };

    // --- 1. HÀM FORMAT NGÀY GIỜ CHUẨN (Xử lý chuỗi ISO từ Backend) ---
    const getFormattedDate = (dateInput: any) => {
        try {
            // Nếu là chuỗi ISO (VD: 2025-12-25T20:00:00)
            if (typeof dateInput === 'string') {
                const dateObj = new Date(dateInput);
                return dateObj.toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            }
            // Fallback: Nếu là object kiểu cũ (dự phòng)
            if (dateInput && typeof dateInput === 'object' && dateInput.day) {
                return `${dateInput.day}/${dateInput.month}/${dateInput.year}`;
            }
            return "Đang cập nhật";
        } catch (e) {
            return "Đang cập nhật";
        }
    };

    const eventTimeDisplay = getFormattedDate(details.event.date);

    // --- 2. TẠO CHUỖI QR CODE ---
    const ticketDetailsString = Object.entries(details.ticketSelection)
        .filter(([, quantity]) => (quantity as number) > 0)
        .map(([tierName, quantity]) => `${quantity}x ${tierName}`)
        .join(', ');

    const qrData = encodeURIComponent(
        `Mã đơn: ${details.bookingId}\n` +
        `Show: ${details.event.title}\n` +
        `Thời gian: ${eventTimeDisplay}\n` +
        `Vé: ${ticketDetailsString}\n` +
        `KH: ${details.contactInfo.email}`
    );
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&margin=10`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 print:bg-white print:block print:p-0 z-[9999]">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all animate-fade-in-up relative receipt-content max-h-[90vh] overflow-y-auto print:shadow-none print:w-full print:max-w-none print:h-auto print:overflow-visible">
                {/* Nút đóng (Ẩn khi in) */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 print:hidden z-10">
                    <FaTimes size={20} />
                </button>
                
                {/* Header Hóa Đơn */}
                <div className="p-6 border-b border-gray-200 bg-gray-50 print:bg-white">
                    <div className="flex flex-col-reverse items-center text-center sm:flex-row sm:text-left sm:justify-between sm:items-start">
                         <div className='mt-4 sm:mt-0'>
                            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Hóa đơn đặt vé</h2>
                            <p className="text-sm text-gray-500 mt-1">Mã đặt vé: <span className="font-mono font-bold text-indigo-600 text-lg">{details.bookingId}</span></p>
                            <p className="text-xs text-gray-400 mt-1">Ngày đặt: {new Date().toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <img src={qrCodeUrl} alt="Booking QR Code" className="w-28 h-28 border p-1 bg-white shadow-sm" />
                            <span className="text-[10px] text-gray-400 mt-1">Quét mã để check-in</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center sm:justify-start space-x-2 text-green-600 bg-green-50 p-2 rounded-lg border border-green-200 print:border-none print:bg-transparent print:p-0">
                        <FaCheckCircle size={20} />
                        <span className="font-bold">Đặt vé thành công!</span>
                    </div>
                </div>

                <div className="p-6">
                    {/* Thông tin sự kiện */}
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-700 mb-2 border-l-4 border-indigo-500 pl-2">THÔNG TIN SỰ KIỆN</h3>
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 print:border-gray-300 print:bg-transparent">
                            <p className="text-xl font-bold text-indigo-900 leading-tight mb-1">{details.event.title}</p>
                            <p className="text-sm text-gray-700 font-medium mb-1">{details.event.fullLocation || details.event.location}</p>
                            <p className="text-sm text-gray-600">
                                📅 {eventTimeDisplay}
                            </p>
                        </div>
                    </div>

                    {/* Chi tiết vé */}
                    <div className="mb-6">
                         <h3 className="font-bold text-gray-700 mb-2 border-l-4 border-orange-500 pl-2">CHI TIẾT VÉ</h3>
                         {details.tickets && details.tickets.length > 0 ? (
                            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-48 overflow-y-auto print:max-h-none print:overflow-visible">
                                {details.tickets.map((ticket, index) => (
                                    <div key={index} className="p-3 flex justify-between items-center hover:bg-gray-50">
                                        <div className="flex items-center">
                                            <FaTicketAlt className="text-orange-500 mr-2" />
                                            <div>
                                                <span className="font-bold text-gray-800">{ticket.tierName}</span>
                                                <span className="text-xs text-gray-500 block">Vé vào cổng</span>
                                            </div>
                                        </div>
                                        <span className="font-mono font-bold text-sm bg-gray-100 px-3 py-1 rounded text-gray-700 border border-gray-300">
                                            {ticket.code}
                                        </span>
                                    </div>
                                ))}
                            </div>
                         ) : (
                            <div className="border border-gray-200 rounded-lg p-4 space-y-2 bg-gray-50 print:bg-transparent">
                                {Object.entries(details.ticketSelection).filter(([, quantity]) => (quantity as number) > 0).map(([tierName, quantity]) => (
                                    <div key={tierName} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700 font-medium">{tierName}</span>
                                        <span className="text-gray-900 font-bold">x {quantity}</span>
                                    </div>
                                ))}
                            </div>
                         )}
                    </div>
                     
                    {/* Thông tin liên hệ & Tổng tiền */}
                    <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t border-dashed border-gray-300">
                        <div className="mb-4 sm:mb-0">
                            <h3 className="font-bold text-gray-700 mb-1 text-sm">THÔNG TIN KHÁCH HÀNG</h3>
                            <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {details.contactInfo.email}</p>
                            <p className="text-sm text-gray-600"><span className="font-medium">SĐT:</span> {details.contactInfo.phone}</p>
                        </div>

                        <div className="text-right">
                             <span className="block text-sm text-gray-500 mb-1">TỔNG THANH TOÁN</span>
                             <span className="block text-3xl font-bold text-orange-600 leading-none">
                                {details.totalPrice.toLocaleString('vi-VN')} ₫
                            </span>
                             <span className="text-xs text-gray-400 italic">(Đã bao gồm VAT)</span>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="bg-gray-50 p-4 rounded-b-lg flex justify-end space-x-3 print:hidden border-t border-gray-200">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        Đóng lại
                    </button>
                    <button 
                        onClick={handlePrint} 
                        className="px-6 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center space-x-2 shadow-md transition-all transform hover:translate-y-[-1px]"
                    >
                        <FaPrint/>
                        <span>In vé / Lưu PDF</span>
                    </button>
                </div>
            </div>
            
            {/* CSS cho lúc in ấn */}
            <style>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { background-color: white !important; }
                    body > *:not(.print-container) { display: none !important; }
                    .print-container { 
                        position: absolute !important; 
                        top: 0 !important; 
                        left: 0 !important; 
                        width: 100% !important; 
                        height: 100% !important; 
                        background: white !important; 
                        padding: 0 !important;
                        display: block !important;
                        z-index: 99999 !important;
                    }
                    .receipt-content {
                        box-shadow: none !important;
                        border: none !important;
                        max-width: 100% !important;
                        width: 100% !important;
                        margin: 0 !important;
                    }
                    .print\\:hidden { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default EventReceiptModal;