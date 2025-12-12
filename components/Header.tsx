// src/components/Header.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaAngleDown, FaSignOutAlt, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const locations = ['Toàn quốc', 'Hà Nội', 'Hồ Chí Minh', 'Hải Phòng', 'Đà Nẵng', 'Cần Thơ'];

const CloudLogo = () => (
    <svg width="170" height="90" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform hover:scale-105 transition-transform duration-300">
        <path d="M145 105H55C30 105 10 85 10 60C10 40 25 25 45 25C50 15 65 5 85 5C110 5 130 20 135 35C145 30 155 30 165 40C185 45 190 65 190 80C190 95 170 105 145 105Z" fill="#F97316"/>
        <path d="M50 35 C 52 30, 58 30, 60 35" stroke="#FFDBA8" strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
        <path d="M40 40 C 42 35, 48 35, 50 40" stroke="#FFDBA8" strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
        <path d="M160 45 C 162 40, 168 40, 170 45" stroke="#FFDBA8" strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
        <path d="M170 50 C 172 45, 178 45, 180 50" stroke="#FFDBA8" strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
        <text x="100" y="65" dominantBaseline="middle" textAnchor="middle" fontFamily="'Dancing Script', cursive" fontSize="52" fill="white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>Mơ Màng</text>
        <text x="100" y="92" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="white" letterSpacing="0.05em">Show</text>
    </svg>
);

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('Chọn địa điểm');
    
    const mobileLocationRef = useRef<HTMLDivElement>(null);
    const desktopLocationRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const outsideMobile = mobileLocationRef.current && !mobileLocationRef.current.contains(target);
            const outsideDesktop = desktopLocationRef.current && !desktopLocationRef.current.contains(target);

            if (outsideMobile && outsideDesktop) {
                setIsLocationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLocationSelect = (location: string) => {
        setSelectedLocation(location);
        setIsLocationOpen(false);
    }

    return (
        <>
            <div className="h-[210px] md:h-[90px] w-full"></div>
            
            <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-[210px] md:h-[90px] transition-all duration-300">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col md:flex-row md:items-center lg:w-[80%]">
                    
                    {/* Logo */}
                    <div className="flex items-center justify-center md:justify-start h-[60px] md:h-full w-full md:w-auto pt-2 md:pt-0">
                        <Link to="/" className="flex items-center group" aria-label="Homepage">
                            <CloudLogo />
                        </Link>
                    </div>

                    {/* Mobile Only Section */}
                    <div className="md:hidden flex flex-col space-y-2 mt-2 w-full pb-2 px-2">
                        {/* Search */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                            />
                            <button className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-400">
                                <FaSearch size={14} />
                            </button>
                        </div>      

                        {/* Location */}
                        <div className="relative w-full" ref={mobileLocationRef}>
                            <button 
                                onClick={() => setIsLocationOpen(!isLocationOpen)}
                                className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white active:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center overflow-hidden">
                                    <FaMapMarkerAlt className="text-gray-400 mr-2 flex-shrink-0" size={14}/>
                                    <span className="truncate">{selectedLocation}</span>
                                </div>
                                <FaAngleDown size={14} className={`transform transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isLocationOpen && (
                                <div className="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg py-1 z-20 border max-h-40 overflow-y-auto w-full">
                                    {locations.map((location) => (
                                        <button
                                            key={location}
                                            onClick={() => handleLocationSelect(location)}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                        {location}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* User Actions (Mobile) */}
                        <div className="flex items-center justify-between pt-1 space-x-2">
                            <Link to="/my-tickets" className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">
                                <FaTicketAlt className="text-orange-500" />
                                <span>Vé của tôi</span>
                            </Link>
                            
                            {user ? (
                                <div className="flex-1 relative group">
                                    <button className="w-full flex items-center justify-center space-x-2 bg-orange-50 py-2 rounded-md text-sm font-medium text-orange-700 hover:bg-orange-100">
                                        <FaUser />
                                        <span className="truncate max-w-[100px]">{user.email.split('@')[0]}</span>
                                    </button>
                                    <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-md shadow-lg py-1 hidden group-hover:block border z-20">
                                        <button onClick={handleLogout} className="w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center justify-center">
                                            <FaSignOutAlt className="mr-2" /> Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 py-2 rounded-md text-sm font-medium text-white hover:bg-orange-700 shadow-sm">
                                    <span>Đăng nhập</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Desktop Center: Search & Location */}
                    <div className="hidden md:flex flex-1 justify-center items-center space-x-4 mx-4">
                        <div className="flex-grow max-w-lg">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <button className="absolute inset-y-0 right-0 px-3 flex items-center bg-gray-100 rounded-r-md hover:bg-gray-200 transition-colors">
                                    <FaSearch className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="relative" ref={desktopLocationRef}>
                            <button 
                                onClick={() => setIsLocationOpen(!isLocationOpen)}
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 justify-between transition-all w-36 lg:w-48"
                            >
                                <FaMapMarkerAlt className="text-gray-400 flex-shrink-0"/>
                                <span className="flex-grow text-left truncate">{selectedLocation}</span>
                                <FaAngleDown className={`transform transition-transform flex-shrink-0 ${isLocationOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isLocationOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border max-h-60 overflow-y-auto">
                                    {locations.map((location) => (
                                        <button
                                            key={location}
                                            onClick={() => handleLocationSelect(location)}
                                            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                        {location}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Right: User Actions */}
                    <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
                        <Link to="/my-tickets" className="text-sm font-medium text-gray-600 hover:text-orange-600 flex items-center transition-colors">
                            <FaTicketAlt className="mr-1.5" />
                            Vé của tôi
                        </Link>
                        <div className="border-l border-gray-300 h-6"></div>
                        
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                                    <FaUser />
                                    <span className="hidden sm:inline">{user.email}</span>
                                    <FaAngleDown />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none group-hover:pointer-events-auto">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                    <FaSignOutAlt className="mr-2" /> Đăng xuất
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="text-sm font-medium bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors shadow-sm">
                                    Đăng nhập
                                </Link>
                                {/* ĐÃ XÓA NÚT ĐĂNG KÝ Ở ĐÂY */}
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;