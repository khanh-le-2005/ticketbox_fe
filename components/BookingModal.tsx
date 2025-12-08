
import React from 'react';
import { BookingModalProps } from '../types';
import { FaTimes, FaCalendarCheck } from 'react-icons/fa';

const BookingModal: React.FC<BookingModalProps> = ({ hotel, isOpen, onClose, onConfirm, checkInDate, checkOutDate, guests, isBooking }) => {
    if (!isOpen || !hotel) return null;

    const nights = Math.max(1, Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)));
    const totalPrice = nights * hotel.pricePerNight;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg m-4 transform transition-all animate-fade-in-up">
                <div className="p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <FaTimes size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Xác nhận đặt phòng</h2>
                </div>

                <div className="px-6 pb-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <img src={hotel.imageUrl} alt={hotel.name} className="w-24 h-24 rounded-md object-cover"/>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
                            <p className="text-sm text-gray-500">{hotel.location}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Nhận phòng:</span>
                            <span className="font-semibold text-gray-800">{new Date(checkInDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Trả phòng:</span>
                            <span className="font-semibold text-gray-800">{new Date(checkOutDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Số đêm:</span>
                            <span className="font-semibold text-gray-800">{nights}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Số khách:</span>
                            <span className="font-semibold text-gray-800">{guests}</span>
                        </div>
                    </div>
                    
                    <div className="border-t my-4"></div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-800 font-semibold text-lg">Tổng cộng:</span>
                        <span className="font-bold text-orange-500 text-2xl">
                            {totalPrice.toLocaleString('vi-VN')} ₫
                        </span>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-b-lg flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300">
                        Hủy
                    </button>
                    <button 
                        onClick={onConfirm} 
                        disabled={isBooking}
                        className="px-6 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center space-x-2 w-32 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                        {isBooking ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Đang xử lý</span>
                            </>
                        ) : (
                            <>
                                <FaCalendarCheck />
                                <span>Xác nhận</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;