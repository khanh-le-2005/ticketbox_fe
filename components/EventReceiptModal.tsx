import React from 'react';
import { FaCheckCircle, FaTimes, FaTicketAlt, FaCalendarCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface EventReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    details: any;
}

const EventReceiptModal: React.FC<EventReceiptModalProps> = ({ isOpen, onClose, details }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    // 👇 SỬA ĐOẠN NÀY: Ưu tiên lấy các trường ID có thể có
    const finalBookingId = details?.bookingId || details?.user_id || details?.id || 'UNKNOWN';

    const handleFinish = () => {
        onClose();
        navigate('/my-tickets'); // Chuyển hướng về trang vé của tôi
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in fade-in zoom-in duration-300">

                {/* Header Xanh lá báo thành công */}
                <div className="bg-green-600 px-6 py-8 text-center">
                    <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce">
                        <FaCheckCircle className="text-green-600 text-5xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white uppercase tracking-wider">THANH TOÁN THÀNH CÔNG!</h3>
                    <p className="text-green-100 mt-2">Vé điện tử đã được gửi tới email của bạn</p>
                </div>

                <div className="p-8 space-y-6">
                    {/* Thông tin đơn hàng */}
                    <div className="border-b border-dashed border-gray-300 pb-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-500">Mã đơn hàng:</span>
                            {/* 👇 HIỂN THỊ ID ĐÃ XỬ LÝ */}
                            <span className="font-mono font-bold text-lg text-gray-800 bg-gray-100 px-3 py-1 rounded">
                                #{finalBookingId.slice(-8).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Tổng thanh toán:</span>
                            <span className="font-bold text-2xl text-orange-600">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(details?.amount || 0)}
                            </span>
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg flex items-start gap-3 border border-indigo-100">
                        <FaTicketAlt className="text-indigo-600 mt-1 flex-shrink-0 text-xl" />
                        <div>
                            <h4 className="font-bold text-indigo-900 text-sm uppercase">HƯỚNG DẪN SỬ DỤNG</h4>
                            <p className="text-sm text-indigo-700 mt-1 leading-relaxed">
                                Vui lòng kiểm tra Email để nhận mã QR vé. Khi đến sự kiện, hãy xuất trình mã QR này tại cổng soát vé.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleFinish}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <FaCalendarCheck /> Hoàn tất
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventReceiptModal;