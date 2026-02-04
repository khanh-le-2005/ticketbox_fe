import React from 'react';
import ReactDOM from 'react-dom';
import { FaCalendarCheck, FaCheckCircle } from 'react-icons/fa';

interface BookingSuccessModalProps {
    isOpen: boolean;
    onFinish: () => void;
}

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({ isOpen, onFinish }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            translate="no"
            className="notranslate fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 backdrop-blur-md"
        >
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                {/* Header với gradient sang trọng */}
                <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 px-8 pt-10 pb-8 relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                    {/* Success icon */}
                    <div className="flex justify-center mb-4 relative z-10">
                        <div className="bg-white p-5 rounded-full shadow-lg">
                            <span className="notranslate" translate="no"> <FaCheckCircle /></span>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 text-center relative z-10">
                        <span className="notranslate" translate="no">Đặt phòng thành công!</span>
                    </h3>

                    <p className="text-emerald-50 text-sm text-center relative z-10">
                        <span className="notranslate" translate="no">Cảm ơn quý khách đã tin tưởng dịch vụ của chúng tôi</span>
                    </p>
                </div>

                {/* Body content */}
                <div className="px-8 py-6 bg-gradient-to-b from-gray-50 to-white">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                        <div className="flex items-start space-x-3 mb-4">
                            <div className="bg-emerald-100 p-2 rounded-lg mt-0.5">
                                <span className="notranslate" translate="no"> <FaCalendarCheck /></span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 mb-1">
                                    <span className="notranslate" translate="no">Trạng thái</span>
                                </p>
                                <p className="text-base font-semibold text-gray-800">
                                    <span className="notranslate" translate="no">Đã xác nhận</span>
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <p className="text-sm text-gray-600 leading-relaxed">
                                <span className="notranslate" translate="no">
                                    Thông tin chi tiết về đặt phòng đã được gửi đến email của quý khách.
                                    Vui lòng kiểm tra hộp thư để xem chi tiết.
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={onFinish}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <span className="notranslate" translate="no">Hoàn tất</span>
                        </button>

                        <button
                            onClick={onFinish}
                            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                        >
                            <span className="notranslate" translate="no">Xem chi tiết đặt phòng</span>
                        </button>
                    </div>
                </div>

                {/* Footer decoration */}
                <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600"></div>
            </div>
        </div>,
        document.body
    );
};

export default BookingSuccessModal;