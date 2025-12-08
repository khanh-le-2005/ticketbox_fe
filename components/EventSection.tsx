import React from 'react';
import { EventSectionProps } from '../types';
import EventCard from './EventCard';

const EventSection: React.FC<EventSectionProps> = ({ title, events }) => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-500 pl-3">
                    {title}
                </h2>
                <a href="#" className="text-sm font-medium text-orange-600 hover:underline">
                    Xem thêm
                </a>
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