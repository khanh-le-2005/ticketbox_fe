// // src/components/Header.tsx

// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaSearch, FaUser, FaAngleDown, FaSignOutAlt, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
// import { useAuth } from '../hooks/useAuth';

// // Bạn nhớ import ảnh logo vào đây hoặc điền đường dẫn ảnh trực tiếp vào thẻ img bên dưới
// // import logoImg from '../assets/logo-mo-mang.png'; 

// const locations = ['Toàn quốc', 'Hà Nội', 'Hồ Chí Minh', 'Hải Phòng', 'Đà Nẵng', 'Cần Thơ'];

// const Header: React.FC = () => {
//     const { user, logout } = useAuth();
//     const navigate = useNavigate();
//     const [isLocationOpen, setIsLocationOpen] = useState(false);
//     const [selectedLocation, setSelectedLocation] = useState('Chọn địa điểm');

//     const mobileLocationRef = useRef<HTMLDivElement>(null);
//     const desktopLocationRef = useRef<HTMLDivElement>(null);

//     const handleLogout = () => {
//         logout();
//         navigate('/');
//     };

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             const target = event.target as Node;
//             const outsideMobile = mobileLocationRef.current && !mobileLocationRef.current.contains(target);
//             const outsideDesktop = desktopLocationRef.current && !desktopLocationRef.current.contains(target);

//             if (outsideMobile && outsideDesktop) {
//                 setIsLocationOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     const handleLocationSelect = (location: string) => {
//         setSelectedLocation(location);
//         setIsLocationOpen(false);
//     }

//     return (
//         <>
//             <div className="h-[210px] md:h-[90px] w-full"></div>

//             <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-[210px] md:h-[90px] transition-all duration-300">
//                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col md:flex-row md:items-center lg:w-[80%]">

//                     {/* Logo Section - Đã thay thế */}
//                     <div className="flex items-center justify-center md:justify-start h-[60px] md:h-full w-full md:w-auto pt-2 md:pt-0">
//                         <Link to="/" className="flex items-center group" aria-label="Homepage">
//                             <img
//                                 src="https://i.postimg.cc/9XqB2tHC/logo-Copy.png" // <-- Dán link ảnh logo hoặc biến import vào đây
//                                 alt="Mơ Màng Show"
//                                 className="h-[50px] md:h-[80px] w-auto object-contain transform hover:scale-105 transition-transform duration-300"
//                             />
//                         </Link>
//                     </div>

//                     {/* Mobile Only Section */}
//                     <div className="md:hidden flex flex-col space-y-2 mt-2 w-full pb-2 px-2">
//                         {/* Search */}
//                         <div className="relative w-full">
//                             <input
//                                 type="text"
//                                 placeholder="Tìm kiếm..."
//                                 className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
//                             />
//                             <button className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-400">
//                                 <FaSearch size={14} />
//                             </button>
//                         </div>

//                         {/* Location */}
//                         <div className="relative w-full" ref={mobileLocationRef}>
//                             {/* <button
//                                 onClick={() => setIsLocationOpen(!isLocationOpen)}
//                                 className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white active:bg-gray-50 transition-colors"
//                             >
//                                 <div className="flex items-center overflow-hidden">
//                                     <FaMapMarkerAlt className="text-gray-400 mr-2 flex-shrink-0" size={14} />
//                                     <span className="truncate">{selectedLocation}</span>
//                                 </div>
//                                 <FaAngleDown size={14} className={`transform transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
//                             </button> */}
//                             {isLocationOpen && (
//                                 <div className="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg py-1 z-20 border max-h-40 overflow-y-auto w-full">
//                                     {locations.map((location) => (
//                                         <button
//                                             key={location}
//                                             onClick={() => handleLocationSelect(location)}
//                                             className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                                         >
//                                             {location}
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>

//                         {/* User Actions (Mobile) */}
//                         <div className="flex items-center justify-between pt-1 space-x-2">
//                             <Link to="/my-tickets" className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">
//                                 <FaTicketAlt className="text-orange-500" />
//                                 <span>Vé của tôi</span>
//                             </Link>

//                             {user ? (
//                                 <div className="flex-1 relative group">
//                                     <button className="w-full flex items-center justify-center space-x-2 bg-orange-50 py-2 rounded-md text-sm font-medium text-orange-700 hover:bg-orange-100">
//                                         <FaUser />
//                                         <span className="truncate max-w-[100px]">{user.email.split('@')[0]}</span>
//                                     </button>
//                                     <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-md shadow-lg py-1 hidden group-hover:block border z-20">
//                                         <button onClick={handleLogout} className="w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center justify-center">
//                                             <FaSignOutAlt className="mr-2" /> Đăng xuất
//                                         </button>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <Link to="/login" className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 py-2 rounded-md text-sm font-medium text-white hover:bg-orange-700 shadow-sm">
//                                     <span>Đăng nhập</span>
//                                 </Link>
//                             )}
//                         </div>
//                     </div>

//                     {/* Desktop Center: Search & Location */}
//                     <div className="hidden md:flex flex-1 justify-center items-center space-x-4 mx-4">
//                         <div className="flex-grow max-w-lg">
//                             <div className="relative">
//                                 <input
//                                     type="text"
//                                     placeholder="Tìm kiếm..."
//                                     className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//                                 />
//                                 <button className="absolute inset-y-0 right-0 px-3 flex items-center bg-gray-100 rounded-r-md hover:bg-gray-200 transition-colors">
//                                     <FaSearch className="h-5 w-5 text-gray-400" />
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="relative" ref={desktopLocationRef}>
//                             <button
//                                 onClick={() => setIsLocationOpen(!isLocationOpen)}
//                                 className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 justify-between transition-all w-36 lg:w-48"
//                             >
//                                 <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
//                                 <span className="flex-grow text-left truncate">{selectedLocation}</span>
//                                 <FaAngleDown className={`transform transition-transform flex-shrink-0 ${isLocationOpen ? 'rotate-180' : ''}`} />
//                             </button>
//                             {isLocationOpen && (
//                                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border max-h-60 overflow-y-auto">
//                                     {locations.map((location) => (
//                                         <button
//                                             key={location}
//                                             onClick={() => handleLocationSelect(location)}
//                                             className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                                         >
//                                             {location}
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Desktop Right: User Actions */}
//                     {/* Desktop Right: User Actions */}
//                     <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
//                         <Link to="/my-tickets" className="text-sm font-medium text-gray-600 hover:text-orange-600 flex items-center transition-colors">
//                             <FaTicketAlt className="mr-1.5" />
//                             Tra cứu đơn hàng
//                         </Link>
//                         <div className="border-l border-gray-300 h-6"></div>

//                         {user ? (
//                             <div className="relative group h-full flex items-center">
//                                 {/* Thêm h-full và flex items-center để vùng hover ổn định hơn */}
//                                 <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors py-2">
//                                     <FaUser />
//                                     <span className="hidden sm:inline">{user.email}</span>
//                                     <FaAngleDown />
//                                 </button>

//                                 {/* SỬA LỖI Ở ĐÂY: Thêm lớp pseudo-element (before:...) để nối liền khoảng cách */}
//                                 <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none group-hover:pointer-events-auto before:absolute before:-top-4 before:block before:h-4 before:w-full before:content-['']">
//                                     <button
//                                         onClick={handleLogout}
//                                         className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
//                                     >
//                                         <FaSignOutAlt className="mr-2" /> Đăng xuất
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="flex items-center space-x-3">
//                                 <Link to="/login" className="text-sm font-medium bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors shadow-sm">
//                                     Đăng nhập
//                                 </Link>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </header>
//         </>
//     );
// };

// export default Header;

// src/components/Header.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaUser, FaAngleDown, FaSignOutAlt,
    FaTicketAlt, FaBars, FaTimes,
    FaHome, FaMusic, FaHotel, FaNewspaper
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // --- ĐÃ ẨN LOGIC LOCATION ---
    // const [isLocationOpen, setIsLocationOpen] = useState(false);
    // const [selectedLocation, setSelectedLocation] = useState('Chọn địa điểm');
    // const mobileLocationRef = useRef<HTMLDivElement>(null);
    // const desktopLocationRef = useRef<HTMLDivElement>(null);
    // const locations = ['Toàn quốc', 'Hà Nội', 'Hồ Chí Minh', 'Hải Phòng', 'Đà Nẵng', 'Cần Thơ'];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // --- ĐÃ ẨN USE EFFECT CLICK OUTSIDE VÌ KHÔNG CÒN DROPDOWN LOCATION ---
    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         const target = event.target as Node;
    //         if (mobileLocationRef.current && !mobileLocationRef.current.contains(target) && 
    //             desktopLocationRef.current && !desktopLocationRef.current.contains(target)) {
    //             setIsLocationOpen(false);
    //         }
    //     };
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => document.removeEventListener('mousedown', handleClickOutside);
    // }, []);

    // const handleLocationSelect = (location: string) => {
    //     setSelectedLocation(location);
    //     setIsLocationOpen(false);
    // }

    return (
        <>
            {/* Spacer để tránh nội dung bị Header che mất */}
            <div className="h-[64px] lg:h-[80px] w-full"></div>

            <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-[64px] lg:h-[80px] transition-all duration-300 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                    {/* --- 1. LOGO AREA --- */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="block" aria-label="Homepage">
                            <img
                                src="https://i.postimg.cc/9XqB2tHC/logo-Copy.png"
                                alt="Mơ Màng Show"
                                className="h-[40px] lg:h-[60px] w-auto object-contain transition-transform hover:scale-105"
                            />
                        </Link>
                    </div>

                    {/* --- 2. DESKTOP CENTER (SEARCH ONLY) --- */}
                    <div className="hidden lg:flex flex-1 items-center justify-center px-8 gap-4">
                        {/* Search Bar */}
                        <div className="flex-grow max-w-xl relative z-50">
                            <SearchBar />
                        </div>

                        {/* --- ĐÃ ẨN LOCATION DROPDOWN (DESKTOP) --- */}
                        {/* 
                        <div className="relative" ref={desktopLocationRef}>
                            <button 
                                onClick={() => setIsLocationOpen(!isLocationOpen)} 
                                className="flex items-center justify-between w-40 xl:w-48 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 transition-all"
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                    <span className="truncate">{selectedLocation}</span>
                                </div>
                                <FaAngleDown className={`text-gray-400 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isLocationOpen && (
                                <div className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100 animate-fadeIn">
                                    {locations.map((location) => (
                                        <button 
                                            key={location} 
                                            onClick={() => handleLocationSelect(location)} 
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                        >
                                            {location}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div> 
                        */}
                    </div>

                    {/* --- 3. DESKTOP RIGHT (USER ACTIONS) --- */}
                    <div className="hidden lg:flex items-center gap-4">
                        <Link to="/my-tickets" className="text-sm font-semibold text-gray-600 hover:text-orange-600 flex items-center gap-2 transition-colors whitespace-nowrap">
                            <FaTicketAlt /> Tra cứu đơn hàng
                        </Link>

                        <div className="h-6 w-px bg-gray-300"></div>

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium py-2">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                        <FaUser size={14} />
                                    </div>
                                    <span className="max-w-[120px] truncate">{user.email.split('@')[0]}</span>
                                    <FaAngleDown size={12} />
                                </button>
                                <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                                        <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                            <FaSignOutAlt className="mr-2" /> Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-lg hover:shadow-lg transform active:scale-95 transition-all">
                                Đăng nhập
                            </Link>
                        )}
                    </div>

                    {/* --- 4. MOBILE TOGGLE BUTTON --- */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 -mr-2 text-gray-600 hover:text-orange-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                {/* --- 5. MOBILE MENU DROPDOWN --- */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-[64px] left-0 right-0 bg-white border-b border-gray-200 shadow-2xl px-4 py-4 flex flex-col gap-4 animate-slideDown max-h-[80vh] overflow-y-auto">

                        {/* Search Mobile */}
                        <div className="w-full">
                            <SearchBar />
                        </div>

                        {/* Navigation Links */}
                        <div className="grid grid-cols-2 gap-2">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                                <FaHome className="text-orange-500" /> Trang chủ
                            </Link>
                            <Link to="/music" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                                <FaMusic className="text-orange-500" /> Ca nhạc
                            </Link>
                            <Link to="/booking" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                                <FaHotel className="text-orange-500" /> Đặt phòng
                            </Link>
                            <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                                <FaNewspaper className="text-orange-500" /> Tin tức
                            </Link>
                        </div>

                        {/* --- ĐÃ ẨN LOCATION MOBILE --- */}
                        {/* 
                        <div className="relative" ref={mobileLocationRef}>
                            <button
                                onClick={() => setIsLocationOpen(!isLocationOpen)}
                                className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white"
                            >
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                    <span>{selectedLocation}</span>
                                </div>
                                <FaAngleDown className={`transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isLocationOpen && (
                                <div className="mt-2 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                                    {locations.map((location) => (
                                        <button
                                            key={location}
                                            onClick={() => handleLocationSelect(location)}
                                            className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 border-b border-gray-100 last:border-0"
                                        >
                                            {location}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div> 
                        */}

                        <hr className="border-gray-100" />

                        {/* User Actions Mobile */}
                        <div className="flex flex-col gap-3">
                            <Link to="/my-tickets" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200">
                                <FaTicketAlt /> Lịch sử mua hàng
                            </Link>

                            {user ? (
                                <div className="flex gap-2">
                                    <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-50 text-orange-700 rounded-lg font-bold">
                                        <FaUser /> {user.email.split('@')[0]}
                                    </div>
                                    <button onClick={handleLogout} className="px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                                        <FaSignOutAlt />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 shadow-md">
                                    Đăng nhập
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;