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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {/* Spacer: Chiều cao cố định cho header 1 tầng (Mobile 64px, Desktop 80px) */}
            <div className="h-[64px] lg:h-[80px] w-full"></div>

            <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-[64px] lg:h-[80px] transition-all duration-300 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4 w-[90%]">

                    {/* --- GROUP 1: LOGO & NAV LINKS (LEFT) --- */}
                    <div className="flex items-center gap-8 lg:gap-12">
                        {/* 1. Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="block" aria-label="Homepage">
                                <img
                                    src="https://i.postimg.cc/9XqB2tHC/logo-Copy.png"
                                    alt="Mơ Màng Show"
                                    className="h-[40px] lg:h-[60px] w-auto object-contain transition-transform hover:scale-105"
                                />
                            </Link>
                        </div>

                        {/* 2. Navigation Links (Desktop Only) - Nằm ngay cạnh Logo */}
                        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                            <Link to="/" className="text-gray-800 font-bold text-x hover:text-orange-600 transition-colors whitespace-nowrap">
                                Trang chủ
                            </Link>
                            <Link to="/music" className="text-gray-800 font-bold text-x hover:text-orange-600 transition-colors whitespace-nowrap">
                                Ca nhạc
                            </Link>
                            <Link to="/booking" className="text-gray-800 font-bold text-x hover:text-orange-600 transition-colors whitespace-nowrap">
                                Đặt phòng
                            </Link>
                            <Link to="/news" className="text-gray-800 font-bold text-x hover:text-orange-600 transition-colors whitespace-nowrap">
                                Tin tức
                            </Link>
                        </nav>
                    </div>

                    {/* --- GROUP 2: SEARCH BAR (CENTER-RIGHT) --- */}
                    <div className="hidden lg:flex flex-1 justify-end max-w-2xl px-4">
                        <div className="w-full">
                            <SearchBar />
                        </div>
                    </div>

                    {/* --- GROUP 3: USER ACTIONS (RIGHT) --- */}
                    <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                        {/* Nút tra cứu vé */}
                        {/* <Link to="/my-tickets" className="text-sm font-semibold text-gray-600 hover:text-orange-600 flex items-center gap-2 transition-colors whitespace-nowrap">
                            <FaTicketAlt /> Tra cứu
                        </Link> 
                        <div className="h-6 w-px bg-gray-300"></div>
                        */}

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium py-2">
                                    <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-200">
                                        <FaUser size={14} />
                                    </div>
                                    <span className="max-w-[120px] truncate font-semibold">{user.email.split('@')[0]}</span>
                                    <FaAngleDown size={12} />
                                </button>
                                <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                                        <Link to="/my-tickets" className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50">
                                            <FaTicketAlt className="mr-2 text-gray-400" /> Vé của tôi
                                        </Link>
                                        <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                            <FaSignOutAlt className="mr-2" /> Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-gray-700 font-bold hover:text-orange-600 transition-colors">
                                    ĐĂNG NHẬP
                                </Link>
                                <Link to="/register" className="bg-gray-900 text-white px-5 py-2.5 rounded-full font-bold hover:bg-gray-800 transition-all shadow-md">
                                    ĐĂNG KÝ
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* --- MOBILE TOGGLE BUTTON --- */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 -mr-2 text-gray-600 hover:text-orange-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                {/* --- MOBILE MENU DROPDOWN (GIỮ NGUYÊN) --- */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-[64px] left-0 right-0 bg-white border-b border-gray-200 shadow-2xl px-4 py-4 flex flex-col gap-4 animate-slideDown max-h-[80vh] overflow-y-auto">

                        {/* Search Mobile */}
                        <div className="w-full">
                            <SearchBar />
                        </div>

                        {/* Navigation Links Mobile */}
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


// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//     FaUser, FaAngleDown, FaSignOutAlt,
//     FaTicketAlt, FaBars, FaTimes,
//     FaHome, FaMusic, FaHotel, FaNewspaper
// } from 'react-icons/fa';
// import { useAuth } from '../hooks/useAuth';
// import SearchBar from './SearchBar';

// const Header: React.FC = () => {
//     const { user, logout } = useAuth();
//     const navigate = useNavigate();
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//     // --- ĐÃ ẨN LOGIC LOCATION ---
//     // const [isLocationOpen, setIsLocationOpen] = useState(false);
//     // const [selectedLocation, setSelectedLocation] = useState('Chọn địa điểm');
//     // const mobileLocationRef = useRef<HTMLDivElement>(null);
//     // const desktopLocationRef = useRef<HTMLDivElement>(null);
//     // const locations = ['Toàn quốc', 'Hà Nội', 'Hồ Chí Minh', 'Hải Phòng', 'Đà Nẵng', 'Cần Thơ'];

//     const handleLogout = () => {
//         logout();
//         navigate('/');
//     };

//     // --- ĐÃ ẨN USE EFFECT CLICK OUTSIDE VÌ KHÔNG CÒN DROPDOWN LOCATION ---
//     // useEffect(() => {
//     //     const handleClickOutside = (event: MouseEvent) => {
//     //         const target = event.target as Node;
//     //         if (mobileLocationRef.current && !mobileLocationRef.current.contains(target) && 
//     //             desktopLocationRef.current && !desktopLocationRef.current.contains(target)) {
//     //             setIsLocationOpen(false);
//     //         }
//     //     };
//     //     document.addEventListener('mousedown', handleClickOutside);
//     //     return () => document.removeEventListener('mousedown', handleClickOutside);
//     // }, []);

//     // const handleLocationSelect = (location: string) => {
//     //     setSelectedLocation(location);
//     //     setIsLocationOpen(false);
//     // }

//     return (
//         <>
//             {/* Spacer để tránh nội dung bị Header che mất */}
//             <div className="h-[64px] lg:h-[80px] w-full"></div>

//             <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-[64px] lg:h-[80px] transition-all duration-300 shadow-sm">
//                 <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

//                     {/* --- 1. LOGO AREA --- */}
//                     <div className="flex-shrink-0 flex items-center">
//                         <Link to="/" className="block" aria-label="Homepage">
//                             <img
//                                 src="https://i.postimg.cc/9XqB2tHC/logo-Copy.png"
//                                 alt="Mơ Màng Show"
//                                 className="h-[40px] lg:h-[60px] w-auto object-contain transition-transform hover:scale-105"
//                             />
//                         </Link>
//                     </div>

//                     {/* --- 2. DESKTOP CENTER (SEARCH ONLY) --- */}
//                     <div className="hidden lg:flex flex-1 items-center justify-center px-8 gap-4">
//                         {/* Search Bar */}
//                         <div className="flex-grow max-w-xl relative z-50">
//                             <SearchBar />
//                         </div>

//                         {/* --- ĐÃ ẨN LOCATION DROPDOWN (DESKTOP) --- */}
//                         {/* 
//                         <div className="relative" ref={desktopLocationRef}>
//                             <button 
//                                 onClick={() => setIsLocationOpen(!isLocationOpen)} 
//                                 className="flex items-center justify-between w-40 xl:w-48 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 transition-all"
//                             >
//                                 <div className="flex items-center gap-2 truncate">
//                                     <FaMapMarkerAlt className="text-gray-400" />
//                                     <span className="truncate">{selectedLocation}</span>
//                                 </div>
//                                 <FaAngleDown className={`text-gray-400 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
//                             </button>
                            
//                             {isLocationOpen && (
//                                 <div className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100 animate-fadeIn">
//                                     {locations.map((location) => (
//                                         <button 
//                                             key={location} 
//                                             onClick={() => handleLocationSelect(location)} 
//                                             className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
//                                         >
//                                             {location}
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div> 
//                         */}
//                     </div>

//                     {/* --- 3. DESKTOP RIGHT (USER ACTIONS) --- */}
//                     <div className="hidden lg:flex items-center gap-4">
//                         <Link to="/my-tickets" className="text-sm font-semibold text-gray-600 hover:text-orange-600 flex items-center gap-2 transition-colors whitespace-nowrap">
//                             <FaTicketAlt /> Tra cứu đơn hàng
//                         </Link>

//                         <div className="h-6 w-px bg-gray-300"></div>

//                         {user ? (
//                             <div className="relative group">
//                                 <button className="flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium py-2">
//                                     <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
//                                         <FaUser size={14} />
//                                     </div>
//                                     <span className="max-w-[120px] truncate">{user.email.split('@')[0]}</span>
//                                     <FaAngleDown size={12} />
//                                 </button>
//                                 <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
//                                     <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
//                                         <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
//                                             <FaSignOutAlt className="mr-2" /> Đăng xuất
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : (
//                             <Link to="/login" className="text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-lg hover:shadow-lg transform active:scale-95 transition-all">
//                                 Đăng nhập
//                             </Link>
//                         )}
//                     </div>

//                     {/* --- 4. MOBILE TOGGLE BUTTON --- */}
//                     <button
//                         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                         className="lg:hidden p-2 -mr-2 text-gray-600 hover:text-orange-600 hover:bg-gray-100 rounded-lg transition-colors"
//                     >
//                         {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//                     </button>
//                 </div>

//                 {/* --- 5. MOBILE MENU DROPDOWN --- */}
//                 {isMobileMenuOpen && (
//                     <div className="lg:hidden absolute top-[64px] left-0 right-0 bg-white border-b border-gray-200 shadow-2xl px-4 py-4 flex flex-col gap-4 animate-slideDown max-h-[80vh] overflow-y-auto">

//                         {/* Search Mobile */}
//                         <div className="w-full">
//                             <SearchBar />
//                         </div>

//                         {/* Navigation Links */}
//                         <div className="grid grid-cols-2 gap-2">
//                             <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600">
//                                 <FaHome className="text-orange-500" /> Trang chủ
//                             </Link>
//                             <Link to="/music" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600">
//                                 <FaMusic className="text-orange-500" /> Ca nhạc
//                             </Link>
//                             <Link to="/booking" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600">
//                                 <FaHotel className="text-orange-500" /> Đặt phòng
//                             </Link>
//                             <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600">
//                                 <FaNewspaper className="text-orange-500" /> Tin tức
//                             </Link>
//                         </div>

//                         {/* --- ĐÃ ẨN LOCATION MOBILE --- */}
//                         {/* 
//                         <div className="relative" ref={mobileLocationRef}>
//                             <button
//                                 onClick={() => setIsLocationOpen(!isLocationOpen)}
//                                 className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white"
//                             >
//                                 <div className="flex items-center gap-2">
//                                     <FaMapMarkerAlt className="text-gray-400" />
//                                     <span>{selectedLocation}</span>
//                                 </div>
//                                 <FaAngleDown className={`transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
//                             </button>
//                             {isLocationOpen && (
//                                 <div className="mt-2 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
//                                     {locations.map((location) => (
//                                         <button
//                                             key={location}
//                                             onClick={() => handleLocationSelect(location)}
//                                             className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 border-b border-gray-100 last:border-0"
//                                         >
//                                             {location}
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div> 
//                         */}

//                         <hr className="border-gray-100" />

//                         {/* User Actions Mobile */}
//                         <div className="flex flex-col gap-3">
//                             <Link to="/my-tickets" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200">
//                                 <FaTicketAlt /> Lịch sử mua hàng
//                             </Link>

//                             {user ? (
//                                 <div className="flex gap-2">
//                                     <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-50 text-orange-700 rounded-lg font-bold">
//                                         <FaUser /> {user.email.split('@')[0]}
//                                     </div>
//                                     <button onClick={handleLogout} className="px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
//                                         <FaSignOutAlt />
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 shadow-md">
//                                     Đăng nhập
//                                 </Link>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </header>
//         </>
//     );
// };

// export default Header;