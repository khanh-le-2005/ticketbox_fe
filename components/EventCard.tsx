// src/components/EventCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';

// Định nghĩa Interface
export interface EventCardData {
  id: string;
  title: string;
  image: string;
  date: string;
  location: string;
  formattedPrice: string;
  views?: number;
  price?: number;
}

interface EventCardProps {
  event: EventCardData | any; 
  className?: string;
  imageClassName?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className = '', imageClassName = 'h-48' }) => {
  
  // Xử lý ngày tháng
  let day = "--";
  let month = "--";
  let year = "--";

  try {
      const dateObj = new Date(event.date);
      if (!isNaN(dateObj.getTime())) {
          day = String(dateObj.getDate());
          month = `Thg ${dateObj.getMonth() + 1}`;
          year = String(dateObj.getFullYear());
      }
  } catch (e) {
      console.error("Lỗi parse ngày:", e);
  }
  
  // Xử lý ảnh lỗi
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/600x400?text=No+Image';
  };

  return (
    <Link 
        to={`/event/${event.id}`} 
        className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group ${className}`}
    >
      {/* 1. PHẦN ẢNH: Cố định chiều cao, cắt ảnh gọn gàng */}
      <div className={`relative w-full ${imageClassName} overflow-hidden`}>
        <img 
            src={event.image || 'https://placehold.co/600x400?text=No+Image'} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={handleImageError}
        />
        
        {/* Badge Ngày Tháng */}
        <div className="absolute top-2 left-2 bg-white/95 p-1 px-2 rounded-lg text-center shadow-md border border-gray-100 min-w-[50px]">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">{month}</span>
            <span className="block text-xl font-extrabold text-orange-600 leading-none">{day}</span>
            <span className="text-[10px] text-gray-400 block">{year}</span>
        </div>
      </div>

      {/* 2. PHẦN NỘI DUNG: Dùng flex-grow để căn chỉnh đều nhau */}
      <div className="p-3 flex flex-col flex-grow">
        
        {/* Tiêu đề (Giới hạn 2 dòng để không bị dài quá) */}
        <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors h-[2.5em]">
            {event.title}
        </h3>

        {/* Thông tin phụ (View & Location) */}
        <div className="text-xs text-gray-500 flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
            <div className="flex items-center gap-3 w-full">
                <div className="flex items-center" title="Lượt xem">
                    <FaEye className="mr-1 text-gray-400"/>
                    <span>{event.views ? event.views.toLocaleString('vi-VN') : 0}</span>
                </div>
                <div className="flex items-center flex-1 min-w-0" title={event.location}>
                    <FaMapMarkerAlt className="mr-1 text-gray-400 flex-shrink-0"/>
                    <span className="truncate">{event.location}</span>
                </div>
            </div>
        </div>
        
        {/* Giá vé (Đẩy xuống đáy) */}
        <div className="mt-auto flex justify-end items-center">
            <div className="font-bold text-orange-600 text-sm flex items-center bg-orange-50 px-2 py-1 rounded">
                <FaTicketAlt className="mr-1.5 text-xs"/>
                {event.formattedPrice || event.price}
            </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;