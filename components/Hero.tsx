import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Kiểm tra lại đường dẫn folder (api hay apis?)
import { getActiveBannersByMenu } from '../api/api_banner-new';
import { Banner } from '../type';

const Hero: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        console.log("🚀 Đang gọi API lấy banner cho menu: 'homepage'...");
        const res: any = await getActiveBannersByMenu('homepage');
        const bannerList = res?.data || (Array.isArray(res) ? res : []);

        console.log("✅ Dữ liệu Banner đã xử lý:", bannerList);
        setBanners(bannerList);
      } catch (error) {
        console.error('❌ Lỗi tải Banner:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // TẠM THỜI COMMENT DÒNG NÀY ĐỂ DEBUG
  // if (!loading && banners.length === 0) {
  //   return null; 
  // }

  if (!loading && banners.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">API trả về danh sách rỗng.</p>
        <p className="text-sm text-gray-400">Hãy vào Admin tạo Banner với menu là "homepage" và bật Active.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      {loading ? (
        <div className="w-full h-[250px] md:h-[400px] lg:h-[500px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center text-gray-400">
          Đang tải ảnh...
        </div>
      ) : (
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          // navigation={true}
          loop={banners.length > 1}
          className="w-full h-[250px] md:h-[400px] lg:h-[500px] rounded-lg shadow-lg"
        >
          {banners.map((banner: any) => {
            const finalLink = banner.link || banner.linkUrl || banner.url || banner.redirectUrl || '';
            const isExternal = finalLink.startsWith('http');

            return (
              <SwiperSlide key={banner.id}>
                {isExternal ? (
                  <a href={finalLink} target="_blank" rel="noopener noreferrer" className="relative block w-full h-full">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log("Ảnh bị lỗi đường dẫn:", banner.imageUrl);
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1600x600?text=Image+Not+Found';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full bg-gradient-to-t from-black/60 to-transparent">
                      <h2 className="text-white text-xl md:text-3xl font-bold drop-shadow-md">
                        {banner.title}
                      </h2>
                      {banner.subtitle && (
                        <p className="text-gray-200 mt-1 md:mt-2 text-sm md:text-base hidden sm:block drop-shadow-md">
                          {banner.subtitle}
                        </p>
                      )}
                    </div>
                  </a>
                ) : (
                  <Link to={finalLink || '#'} className="relative block w-full h-full">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log("Ảnh bị lỗi đường dẫn:", banner.imageUrl);
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1600x600?text=Image+Not+Found';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full bg-gradient-to-t from-black/60 to-transparent">
                      <h2 className="text-white text-xl md:text-3xl font-bold drop-shadow-md">
                        {banner.title}
                      </h2>
                      {banner.subtitle && (
                        <p className="text-gray-200 mt-1 md:mt-2 text-sm md:text-base hidden sm:block drop-shadow-md">
                          {banner.subtitle}
                        </p>
                      )}
                    </div>
                  </Link>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default Hero;