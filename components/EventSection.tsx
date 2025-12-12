// src/components/EventSection.tsx

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { EventSectionProps } from '../types';
import EventCard from './EventCard';

// Mở rộng Props để nhận thêm link (nếu file types.ts chưa có)
interface CustomEventSectionProps extends EventSectionProps {
    viewMoreLink?: string; // Link tùy chọn (VD: '/music', '/sports')
}

const EventSection: React.FC<CustomEventSectionProps> = ({ title, events, viewMoreLink }) => {
    // Nếu không có sự kiện nào thì không hiển thị section này (tránh khoảng trắng xấu)
    if (!events || events.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-500 pl-3">
                    {title}
                </h2>
                
                {/* Chỉ hiển thị nút Xem thêm nếu có đường dẫn */}
                {viewMoreLink && (
                    <Link 
                        to={viewMoreLink} 
                        className="text-sm font-medium text-orange-600 hover:text-orange-800 hover:underline flex items-center transition-colors"
                    >
                        Xem thêm 
                        {/* Icon mũi tên nhỏ cho đẹp */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </section>
    );
};

export default EventSection;