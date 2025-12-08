
import React from 'react';
import { BookingReceiptModalProps } from '../types';
import { FaTimes, FaCheckCircle, FaPrint } from 'react-icons/fa';

const BookingReceiptModal: React.FC<BookingReceiptModalProps> = ({ isOpen, onClose, details }) => {
    if (!isOpen || !details) return null;

    const handlePrint = () => {
        window.print();
    };

    const qrData = encodeURIComponent(
        `Booking ID: ${details.bookingId}\n` +
        `Hotel: ${details.hotel.name}\n` +
        `Check-in: ${new Date(details.checkInDate).toLocaleDateString('vi-VN')}\n` +
        `Check-out: ${new Date(details.checkOutDate).toLocaleDateString('vi-VN')}\n` +
        `Guests: ${details.guests}`
    );
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}&margin=10`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 print:bg-gray-100 print:block print:p-8 print-container py-10">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all animate-fade-in-up relative receipt-content">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 print:hidden">
                    <FaTimes size={20} />
                </button>
                
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col-reverse items-center text-center sm:flex-row sm:text-left sm:justify-between sm:items-start">
                        <div className="pr-4 mt-4 sm:mt-0">
                            <h2 className="text-2xl font-bold text-gray-800">Hóa đơn đặt phòng</h2>
                            <p className="text-sm text-gray-500">Mã đặt phòng: <span className="font-mono text-gray-700">{details.bookingId}</span></p>
                        </div>
                        <div className="flex-shrink-0">
                             <img src={qrCodeUrl} alt="Booking QR Code" className="w-28 h-28 border p-1 bg-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center sm:justify-start space-x-2 text-green-600">
                        <FaCheckCircle size={24} />
                        <span className="text-lg font-semibold">Thanh toán thành công!</span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">Thông tin khách sạn</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-lg font-bold text-indigo-700">{details.hotel.name}</p>
                            <p className="text-sm text-gray-600">{details.hotel.location}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                         <h3 className="font-semibold text-gray-700 mb-2">Chi tiết đặt phòng</h3>
                         <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Nhận phòng:</span>
                                <span className="font-semibold text-gray-800">{new Date(details.checkInDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Trả phòng:</span>
                                <span className="font-semibold text-gray-800">{new Date(details.checkOutDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Số đêm:</span>
                                <span className="font-semibold text-gray-800">{details.nights}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Số khách:</span>
                                <span className="font-semibold text-gray-800">{details.guests}</span>
                            </div>
                        </div>
                    </div>
                     
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Chi tiết thanh toán</h3>
                         <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">{details.hotel.pricePerNight.toLocaleString('vi-VN')} ₫ x {details.nights} đêm</span>
                                <span className="text-gray-800">{details.totalPrice.toLocaleString('vi-VN')} ₫</span>
                            </div>
                             <div className="flex justify-between items-center text-lg font-bold pt-2 border-t mt-2">
                                <span className="text-gray-800">TỔNG CỘNG:</span>
                                <span className="text-orange-500">
                                    {details.totalPrice.toLocaleString('vi-VN')} ₫
                                </span>
                            </div>
                        </div>
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
                    .print-container {
                        padding: 0 !important;
                    }
                    .receipt-content {
                        margin: 0 auto;
                        box-shadow: none !important;
                        border: 1px solid #ddd;
                        max-width: 8.5in;
                        border-radius: 0 !important;
                    }
                }
            `}</style>

        </div>
    );
};

export default BookingReceiptModal;