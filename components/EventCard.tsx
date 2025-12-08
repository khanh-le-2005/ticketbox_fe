
import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types';
import { FaEye, FaMapMarkerAlt } from 'react-icons/fa';

interface EventCardProps {
  event: Event;
  className?: string;
  imageClassName?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className = '', imageClassName = 'h-48' }) => {
  const showDate = event.date && event.date.day > 0 && event.date.year > 0;

  return (
    <Link to={`/event/${event.id}`} className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col ${className}`}>
      <div className="relative">
        <img src={event.imageUrl} alt={event.title} className={`w-full object-cover ${imageClassName}`} />
        {showDate && (
           <div className="absolute top-2 left-2 bg-white/95 p-1 px-2 rounded-lg text-center shadow-lg border border-gray-100 w-[70px]">
            <span className="text-sm font-semibold text-gray-700">{event.date.month}</span>
            <span className="block text-3xl font-bold text-orange-500 -my-1">{event.date.day}</span>
            <span className="text-xs text-gray-500">{event.date.year}</span>
          </div>
        )}
      </div>

      <div className="p-3 border-b border-gray-200">
        <div className="text-xs text-gray-500 flex items-center justify-between">
            <div className="flex items-center divide-x divide-gray-300">
                <div className="flex items-center pr-2 sm:pr-3">
                    <FaEye className="mr-1.5 text-gray-400"/>
                    <span>{event.views?.toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex items-center pl-2 sm:pl-3">
                    <FaMapMarkerAlt className="mr-1.5 text-gray-400"/>
                    <span>{event.location}</span>
                </div>
            </div>
            <div className="font-bold text-orange-500 text-right pl-2">
                {event.price}
            </div>
        </div>
      </div>
      
      <div className="p-3 pt-2 flex-grow flex items-center">
        <h3 className="text-sm font-semibold text-gray-800 leading-snug">{event.title}</h3>
      </div>
    </Link>
  );
};

export default EventCard;