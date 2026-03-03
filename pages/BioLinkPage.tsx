import React from 'react';
import {
    MapPin,
    Facebook,
    Music,
    Youtube,
    Instagram,
    AtSign,
    Globe,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatButton from '@/components/FloatButton';

// Định nghĩa kiểu dữ liệu cho mỗi nút liên kết
interface LinkItem {
    id: number;
    icon: React.ElementType | string; // Có thể là Icon component hoặc đường dẫn ảnh
    type: 'icon' | 'image'; // Đánh dấu để render icon hay ảnh
    title: string;
    subtitle: string;
    url: string;
    color?: string; // Màu sắc cho icon
}

const BioLinkPage: React.FC = () => {
    // Dữ liệu các nút (Mô phỏng theo hình ảnh)
    const links: LinkItem[] = [
        {
            id: 10,
            icon: 'https://cdn-icons-png.flaticon.com/512/724/724664.png',
            type: 'image',
            title: 'Liên Hệ',
            subtitle: '0929009999',
            url: 'tel:0929009999',
            color: '#4CAF50'
        },
        {
            id: 9,
            icon: Globe,
            type: 'icon',
            title: 'Website',
            subtitle: 'momangshow.vn',
            url: 'https://momangshow.vn',
            color: '#FF7A30'
        },
        {
            id: 2,
            icon: Facebook,
            type: 'icon',
            title: 'Facebook Show',
            subtitle: 'Mơ Màng Show Tam Đảo',
            url: 'https://www.facebook.com/momangshowtamdao',
            color: '#1877F2'
        },
        {
            id: 3,
            icon: Facebook,
            type: 'icon',
            title: 'Facebook House',
            subtitle: 'Mơ Màng House Tam Đảo',
            url: 'https://www.facebook.com/momanghousetamdao',
            color: '#1877F2'
        },
        {
            id: 4,
            icon: Music,
            type: 'icon',
            title: 'TikTok Show',
            subtitle: '@momangshow',
            url: 'https://www.tiktok.com/@momangshow',
            color: '#000000'
        },
        {
            id: 5,
            icon: Music,
            type: 'icon',
            title: 'TikTok House',
            subtitle: '@momanghousetamdao',
            url: 'https://www.tiktok.com/@momanghousetamdao',
            color: '#000000'
        },
        {
            id: 6,
            icon: Youtube,
            type: 'icon',
            title: 'Youtube',
            subtitle: '@momangshow',
            url: 'https://www.youtube.com/@momangshow',
            color: '#FF0000'
        },
        {
            id: 7,
            icon: Instagram,
            type: 'icon',
            title: 'Instagram',
            subtitle: '@momangtamdao',
            url: 'https://www.instagram.com/momangtamdao/',
            color: '#E4405F'
        },
        {
            id: 8,
            icon: AtSign,
            type: 'icon',
            title: 'Threads',
            subtitle: '@momangtamdao',
            url: 'https://www.threads.com/@momangtamdao',
            color: '#000000'
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#F0BDA3]">
            <Header />

            <main className="flex-grow py-12 px-4 flex flex-col items-center">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-24 h-24 mb-4 rounded-full p-1 bg-white shadow-lg overflow-hidden border-2 border-[#FF7A30]">
                        <img
                            src="https://i.postimg.cc/9XqB2tHC/logo-Copy.png"
                            alt="Mơ Màng Show Logo"
                            className="w-full h-full object-contain rounded-full bg-slate-50"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Mơ Màng Show</h1>
                    <p className="text-gray-600 mt-2 max-w-xs text-sm font-medium">✨ Giai điệu bồng bềnh, tìm MƠ MÀNG SHOW</p>
                </div>


                {/* Container chính */}
                <div className="w-full max-w-md space-y-4">
                    {/* Render danh sách các nút */}
                    {links.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block w-full bg-white rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] hover:scale-[1.01] transition-all duration-300 ease-in-out border border-transparent hover:border-[#FF7A30]/10"
                        >
                            <div className="flex items-center">
                                {/* Phần Icon bên trái */}
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-white transition-colors duration-300">
                                    {link.type === 'icon' ? (
                                        // Nếu là Icon từ Lucide
                                        React.createElement(link.icon as React.ElementType, {
                                            size: 28,
                                            style: { color: link.color || '#4A4A4A' },
                                            className: "transition-transform group-hover:scale-110 duration-300",
                                            strokeWidth: 2
                                        })
                                    ) : (
                                        // Nếu là Ảnh (cho nút Website cuối cùng)
                                        <img
                                            src={link.icon as string}
                                            alt="icon"
                                            className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                        />
                                    )}
                                </div>

                                {/* Phần Text ở giữa */}
                                <div className="flex-1 ml-4 text-left">
                                    <h3 className="text-gray-800 font-bold text-base leading-tight group-hover:text-[#FF7A30] transition-colors">
                                        {link.title}
                                    </h3>
                                    <p className="text-gray-500 text-xs mt-1 font-medium">
                                        {link.subtitle}
                                    </p>
                                </div>

                                {/* Arrow icon on the right (optional but adds to premium feel) */}
                                <div className="text-gray-300 group-hover:text-[#FF7A30] transition-colors translate-x-0 group-hover:translate-x-1 transition-transform">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Brand Tagline */}
                <div className="mt-16 text-center opacity-60">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Mơ Màng Show & House Tam Đảo</p>
                </div>
            </main>
            <FloatButton />

            <Footer />
        </div>
    );
};

export default BioLinkPage;