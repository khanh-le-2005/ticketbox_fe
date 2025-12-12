// src/components/BookingSuccessToast.tsx

import React from 'react';
import { BookingSuccessToastProps } from '../types';
import { FaCheckCircle } from 'react-icons/fa';

const BookingSuccessToast: React.FC<BookingSuccessToastProps> = ({ message, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed top-24 right-4 z-[9999] animate-slide-in">
            <div className="bg-white border-l-4 border-green-500 rounded-r-lg shadow-2xl p-4 flex items-center gap-4 min-w-[300px]">
                {/* Icon với nền xanh nhạt */}
                <div className="bg-green-100 p-2 rounded-full">
                    <FaCheckCircle className="text-green-600 text-xl" />
                </div>
                
                {/* Nội dung */}
                <div>
                    <h4 className="font-bold text-gray-800 text-sm">Thành công!</h4>
                    <p className="text-gray-600 text-sm font-medium">{message}</p>
                </div>
            </div>

            {/* CSS Animation nội bộ để không phụ thuộc file ngoài */}
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default BookingSuccessToast;