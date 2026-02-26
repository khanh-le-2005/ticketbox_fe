import React from 'react';
import { FaCheckCircle, FaTicketAlt, FaCalendarCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface EventReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    details: any; // Dữ liệu trả về từ API createBooking
}

const EventReceiptModal: React.FC<EventReceiptModalProps> = ({ isOpen, onClose, details }) => {
    const navigate = useNavigate();

    // DEBUG LOG
    React.useEffect(() => {
        if (isOpen) {
            console.log("EventReceiptModal MOUNTED with details:", details);
        }
    }, [isOpen, details]);

    if (!isOpen) return null;

    // 1️⃣ LOGIC LẤY ID: Check cả trong nested data và root level
    const p = details?.data || details || {};
    const finalBookingId =
        details?.orderCode ||
        p?.orderCode ||
        details?.bookingId ||
        p?.bookingId ||
        details?.transaction_id ||
        p?.transaction_id ||
        details?.payment_content ||
        p?.payment_content ||
        details?.id ||
        p?.id ||
        details?.requestId ||
        'UNKNOWN';

    // 2️⃣ LOGIC LẤY GIÁ: Check cả trong nested data và root level
    const finalAmount =
        details?.amount ||
        p?.amount ||
        details?.totalPrice ||
        p?.totalPrice ||
        details?.totalAmount ||
        p?.totalAmount ||
        0;

    // 3️⃣ LOGIC CHECK KÊNH GỬI: Kiểm tra kỹ các trường có thể đánh dấu là Zalo (check cả nested data)
    const isZalo =
        details?.channel === 'ZALO' ||
        p?.channel === 'ZALO' ||
        details?.notificationChannel === 'ZALO' ||
        p?.notificationChannel === 'ZALO';

    const handleFinish = () => {
        onClose();
        navigate('/my-tickets'); // Chuyển hướng về trang vé của tôi
    };

    return (
        // Tăng z-index lên cao nhất có thể để đảm bảo đè lên mọi thứ khác
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
            {/* Loại bỏ animation để tránh lỗi ẩn component nếu plugin chưa load */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative">

                {/* Header Xanh lá báo thành công */}
                <div className="bg-green-600 px-6 py-8 text-center">
                    <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce">
                        <FaCheckCircle className="text-green-600 text-5xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white uppercase tracking-wider">THANH TOÁN THÀNH CÔNG!</h3>

                    {/* Hiển thị đúng kênh gửi */}
                    <p className="text-green-100 mt-2 font-medium">
                        Vé điện tử đã được gửi tới <span className="font-bold underline">{isZalo ? 'Zalo' : 'Email'}</span> của bạn
                    </p>
                </div>

                <div className="p-8 space-y-6">
                    {/* Thông tin đơn hàng */}
                    <div className="border-b border-dashed border-gray-300 pb-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-500">Mã đơn hàng:</span>
                            {/* Cắt ngắn ID nếu nó quá dài (trường hợp là UUID) */}
                            <span className="font-mono font-bold text-lg text-gray-800 bg-gray-100 px-3 py-1 rounded">
                                #{finalBookingId.length > 10 ? finalBookingId.slice(-8).toUpperCase() : finalBookingId}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Tổng thanh toán:</span>
                            <span className="font-bold text-2xl text-orange-600">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalAmount)}
                            </span>
                        </div>
                    </div>

                    {/* Hướng dẫn */}
                    <div className="bg-indigo-50 p-4 rounded-lg flex items-start gap-3 border border-indigo-100">
                        <FaTicketAlt className="text-indigo-600 mt-1 flex-shrink-0 text-xl" />
                        <div>
                            <h4 className="font-bold text-indigo-900 text-sm uppercase">HƯỚNG DẪN SỬ DỤNG</h4>
                            <p className="text-sm text-indigo-700 mt-1 leading-relaxed">
                                Vui lòng kiểm tra <b>{isZalo ? 'tin nhắn Zalo (ZNS)' : 'hộp thư Email'}</b> để nhận vé và mã QR.
                                Khi đến sự kiện, hãy xuất trình mã QR này tại cổng soát vé.
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