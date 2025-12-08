import React from 'react';
import { BookingSuccessToastProps } from '../types';
import { FaCheckCircle } from 'react-icons/fa';

const BookingSuccessToast: React.FC<BookingSuccessToastProps> = ({ message, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed top-5 right-5 bg-green-500 text-white py-3 px-5 rounded-lg shadow-lg flex items-center z-50 animate-fade-in-down">
            <FaCheckCircle className="mr-3" size={20} />
            <p className="font-semibold">{message}</p>
        </div>
    );
};

export default BookingSuccessToast;