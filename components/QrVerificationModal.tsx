// src/components/QrVerificationModal.tsx

import React from 'react';
import { QrVerificationModalProps } from '../types';
import { FaTimes, FaReceipt, FaQrcode } from 'react-icons/fa';

const QrVerificationModal: React.FC<QrVerificationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isConfirming,
    qrCodeData,
}) => {
    if (!isOpen) return null;

    // Tạo QR Code từ API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCodeData)}&margin=10`;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative animate-fade-in-up overflow-hidden">
                
                {/* Header */}
                <div className="bg-indigo-600 p-6 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                    <div className="flex justify-center mb-2">
                        <div className="p-3 bg-white/20 rounded-full">
                            <FaQrcode className="text-white text-2xl" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">Mã QR Đặt Vé</h2>
                    <p className="text-indigo-100 text-sm">Quét mã để lưu thông tin hoặc check-in</p>
                </div>

                <div className="p-8 text-center">
                    <p className="text-gray-600 mb-6 text-sm font-medium">
                        Sử dụng ứng dụng camera hoặc máy quét để đọc mã bên dưới:
                    </p>

                    {/* Khung chứa QR */}
                    <div className="bg-white p-2 rounded-xl inline-block border-4 border-orange-100 shadow-sm mb-6">
                        <img 
                            src={qrCodeUrl} 
                            alt="Booking QR Code" 
                            className="w-48 h-48 sm:w-56 sm:h-56 object-contain" 
                        />
                    </div>

                    <p className="text-gray-500 text-xs mb-6 px-4">
                        Mã này chứa thông tin đặt vé của bạn. Vui lòng không chia sẻ cho người lạ để tránh mất vé.
                    </p>

                    <div className="mt-2">
                        <button
                            onClick={onConfirm}
                            disabled={isConfirming}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-lg text-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isConfirming ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Đang tải hóa đơn...</span>
                                </>
                            ) : (
                                <>
                                    <FaReceipt />
                                    <span>Xem chi tiết hóa đơn</span>
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