
import React from 'react';
import { Link } from 'react-router-dom';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import data
import { FEATURED_EVENTS_SLIDER } from '../constants';

const Hero: React.FC = () => {
  // Helper to force high resolution for hero banner
  const getHeroImageUrl = (url: string) => {
      // Replace any dimensions at the end (e.g., /400/300) with /1600/600
      return url.replace(/\/\d+\/\d+$/, '/1600/600'); 
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true}
        className="w-full h-[250px] md:h-[400px] lg:h-[500px] rounded-lg shadow-lg"
      >
        {FEATURED_EVENTS_SLIDER.map((event) => (
          <SwiperSlide key={event.id}>
            <Link to={`/event/${event.id}`} className="relative block w-full h-full">
              <img 
                src={getHeroImageUrl(event.imageUrl)} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              {/* Removed gradient overlay */}
              <div className="absolute bottom-0 left-0 p-4 md:p-8">
                <h2 className="text-white text-xl md:text-3xl font-bold drop-shadow-md">{event.title}</h2>
                <p className="text-gray-200 mt-1 md:mt-2 text-sm md:text-base hidden sm:block drop-shadow-md">{event.description}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
