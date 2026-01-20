import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import showApi from '@/api/showApi';
import { IShow } from '@/type/show.type';

const API_IMAGE_BASE = "https://api.momangshow.vn/api/images";

const SearchBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<IShow[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // --- Search Logic ---
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setIsDropdownOpen(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            setIsDropdownOpen(true);
            try {
                const response: any = await showApi.getAllShows({ keyword: searchTerm, limit: 10 } as any);
                const shows = response.shows || response.data?.content || [];
                setSearchResults(shows);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Click outside to close results
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Helper for Image ---
    const getEventImage = (show: any) => {
        if (show.bannerImageId) return `${API_IMAGE_BASE}/${show.bannerImageId}`;
        if (show.images && show.images.length > 0) {
            const firstImg = show.images[0];
            if (firstImg.imageFileId) return `${API_IMAGE_BASE}/${firstImg.imageFileId}`;
            if (firstImg.imageUrl) return firstImg.imageUrl;
        }
        if (show.image) return show.image;
        if (show.imageUrl) return show.imageUrl;
        if (show.galleryImageIds && show.galleryImageIds.length > 0) return `${API_IMAGE_BASE}/${show.galleryImageIds[0]}`;
        return "https://placehold.co/100x100?text=No+Image";
    };

    const renderSearchResults = () => {
        if (!isDropdownOpen || (!isSearching && searchResults.length === 0 && searchTerm)) return null;

        return (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl rounded-lg border border-gray-100 overflow-hidden z-[100] max-h-[450px] overflow-y-auto animate-fadeIn">
                {isSearching ? (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
                        <span className="text-orange-500 animate-spin"><FaSpinner size={24} /></span>
                        <span className="text-sm">Đang tìm kiếm sự kiện...</span>
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {searchResults.map((show) => (
                            <Link
                                key={show.id}
                                to={`/event/${show.id}`}
                                className="flex items-center gap-4 p-3 hover:bg-orange-50 transition-colors group"
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    setSearchTerm('');
                                }}
                            >
                                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 border text-black">
                                    <img
                                        src={getEventImage(show)}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        alt={show.name}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm text-gray-800 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors mb-1">
                                        {show.name}
                                    </h4>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-[11px] text-gray-500 font-medium">
                                            Ngày {new Date(show.startTime).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </p>
                                        <p className="text-[11px] text-gray-400 truncate">
                                            {show.address?.province || "Toàn quốc"}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        <Link
                            to="/music"
                            className="block p-3 text-center text-xs font-bold text-orange-600 hover:bg-orange-100 transition-colors uppercase tracking-wider"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            Xem tất cả kết quả
                        </Link>
                    </div>
                ) : searchTerm && (
                    <div className="p-8 text-center text-gray-500 italic text-sm">
                        Không tìm thấy sự kiện phù hợp...
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="relative w-full" ref={searchRef}>
            <div className={`relative ${isDropdownOpen ? 'z-[70]' : ''}`}>
                <input
                    type="text"
                    placeholder="Tìm kiếm ca nhạc, sự kiện..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm && setIsDropdownOpen(true)}
                    className="w-full pl-4 pr-10 py-2 border-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-600 text-sm md:text-base text-black bg-white"
                />
                <button className="absolute inset-y-0 right-0 px-5 flex items-center bg-gray-200 rounded-r-md hover:bg-gray-300 transition-colors border-l border-gray-100">
                    <span className="text-gray-400"><FaSearch size={18} /></span>
                </button>
            </div>
            {renderSearchResults()}
        </div>
    );
};

export default SearchBar;
