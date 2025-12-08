import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorToastProps {
    message: string;
    isVisible: boolean;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ message, isVisible }) => {
    return (
        <div 
            className={`fixed top-24 right-5 bg-red-600 text-white py-3 px-5 rounded-lg shadow-lg flex items-center z-50 transform transition-transform duration-300 ease-out ${isVisible ? 'translate-x-0' : 'translate-x-[120%]'}`}
            role="alert"
            aria-live="assertive"
        >
            <FaExclamationTriangle className="mr-3" size={20} />
            <p className="font-semibold">{message}</p>
        </div>
    );
};

export default ErrorToast;
