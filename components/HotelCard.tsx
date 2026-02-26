
import React from 'react';
import { Link } from 'react-router-dom';
import { HotelCardProps } from '../types';
import { FaStar, FaMapMarkerAlt, FaBed } from 'react-icons/fa';

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onBookNow }) => {
    const toSlug = (value: string) =>
        value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

    const hotelPath = `/hotel/${hotel.slug || toSlug(hotel.name || "") || hotel.id}`;

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
                    <FaStar />
                </span>
            );
        }
        return <div className="flex items-center">{stars}</div>;
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <Link to={hotelPath} className="relative block">
                <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-300"></div>
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-semibold text-gray-700 shadow-sm flex items-center">
                    <FaBed className="mr-1 text-orange-500" />
                    <span>Sức chứa: {hotel.availableRooms} phòng</span>
                </div>
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <Link to={hotelPath} className="text-md font-bold text-gray-800 leading-tight flex-grow pr-2 hover:text-indigo-600 transition-colors">
                        {hotel.name}
                    </Link>
                    {renderStars(hotel.rating)}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="mr-1.5"><FaMapMarkerAlt /></span>
                    <span>{hotel.location}</span>
                </div>
                <div className="mt-auto flex justify-between items-center">
                    <div>
                        <span className="text-gray-600 text-sm">Giá/đêm từ</span>
                        <p className="font-bold text-orange-500 text-lg">
                            {hotel.pricePerNight.toLocaleString('vi-VN')} ₫
                        </p>
                    </div>
                    <button
                        onClick={() => onBookNow(hotel)}
                        disabled={hotel.availableRooms === 0}
                        className={`font-semibold py-2 px-4 rounded-md transition-colors text-sm ${hotel.availableRooms > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                        {hotel.availableRooms > 0 ? 'Đặt ngay' : 'Hết phòng'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;
