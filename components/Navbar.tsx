
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBars, FaTimes } from 'react-icons/fa';
import { NAV_LINKS } from '../constants';

const Navbar: React.FC = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const getLinkPath = (linkText: string) => {
        switch (linkText) {
            case 'Đặt vé ca nhạc': return '/music';
            case 'Văn hoá nghệ thuật': return '/arts';
            case 'Du lịch': return '/tourism';
            case 'Đặt phòng': return '/booking';
            case 'Vé xem phim': return '/movies';
            case 'Vé tham quan': return '/sightseeing';
            case 'Thể thao': return '/sports';
            case 'Tin tức': return '/news';
            default: return '#';
        }
    };

    const baseClasses = "text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center whitespace-nowrap block w-full lg:w-auto hover:bg-indigo-600";
    const activeClasses = "bg-indigo-800 font-semibold";

    return (
        <>
            {/* Spacer div to prevent content from being hidden behind the fixed navbar */}
            <div className="h-12 w-full lg:block"></div>

            {/* Adjusted top position for mobile to account for taller header */}
            {/* Adjusted top position to match Header (64px mobile / 80px desktop) */}
            <nav className="bg-indigo-700 fixed top-[64px] lg:top-[80px] left-0 right-0 z-40 h-12 shadow-md transition-all duration-300">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex items-center justify-between lg:justify-center h-full">
                        {/* Mobile Menu Button */}
                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={handleToggleMenu}
                                className="text-white p-2 rounded-md hover:bg-indigo-600 transition focus:outline-none"
                                aria-label="Mở menu"
                            >
                                {isMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                            </button>
                            <span className="text-white font-bold ml-2">Menu</span>
                        </div>

                        {/* Links Container */}
                        <div className={`
                            ${isMenuOpen ? 'flex' : 'hidden'} 
                            lg:flex lg:items-center lg:space-x-4 
                            absolute lg:static top-12 left-0 w-full lg:w-auto 
                            bg-indigo-700 lg:bg-transparent 
                            flex-col lg:flex-row 
                            border-t lg:border-t-0 border-indigo-600
                            shadow-lg lg:shadow-none
                            z-50
                            pb-4 lg:pb-0
                        `}>
                            <Link
                                to="/"
                                className={`${baseClasses} ${location.pathname === '/' ? activeClasses : ''} lg:inline-flex`}
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="Trang chủ"
                            >
                                <span className="mr-2 lg:mr-0"><FaHome size={18} /></span>
                                <span className="lg:hidden">Trang chủ</span>
                            </Link>
                            {NAV_LINKS.map((link) => {
                                const path = getLinkPath(link);
                                const isActive = location.pathname === path;
                                return (
                                    <Link
                                        key={link}
                                        to={path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`${baseClasses} ${isActive ? activeClasses : ''} lg:inline-flex`}
                                    >
                                        {link}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
