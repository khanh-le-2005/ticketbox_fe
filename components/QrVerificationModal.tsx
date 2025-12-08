import React from 'react';
import { QrVerificationModalProps } from '../types';
import { FaTimes, FaReceipt } from 'react-icons/fa';

const QrVerificationModal: React.FC<QrVerificationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isConfirming,
    qrCodeData,
}) => {
    if (!isOpen) return null;

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeData)}&margin=10`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-900 text-white rounded-lg shadow-2xl w-full max-w-md relative animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <FaTimes size={24} />
                </button>

                <div className="p-8 text-center">
                    <h2
                        className="text-2xl font-bold text-yellow-400 mb-4"
                        style={{ fontFamily: "serif" }}
                    >
                        Quét mã để nhận hóa đơn
                    </h2>
                    <p className="text-gray-400 mb-6 text-sm">
                        Sử dụng ứng dụng camera hoặc máy quét QR để quét mã.
                    </p>

                    <div className="bg-white p-4 rounded-lg inline-block">
                        <img src={qrCodeUrl} alt="Booking QR Code" className="w-48 h-48" />
                    </div>

                    <p className="text-gray-400 mt-6 text-sm">
                        Sau khi quét, nhấn nút bên dưới để xem hóa đơn chi tiết.
                    </p>

                    <div className="mt-6">
                        <button
                            onClick={onConfirm}
                            disabled={isConfirming}
                            className="w-full font-bold py-3 px-8 rounded-lg text-lg transition-colors flex items-center justify-center space-x-2 bg-yellow-500 text-gray-900 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                        >
                            {isConfirming ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                <>
                                    <FaReceipt />
                                    <span>Xem hóa đơn</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QrVerificationModal;
