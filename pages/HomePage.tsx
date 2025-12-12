// src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import EventCard from '../components/EventCard';
import EventSection from '../components/EventSection';
import Footer from '../components/Footer';

// Import API
import showApi from '../api/showApi';

// --- ĐƯỜNG DẪN GỐC TỚI API ẢNH ---
const API_IMAGE_BASE = "https://api.momangshow.vn/api/images";

const HomePage: React.FC = () => {
    const [highlightedEvents, setHighlightedEvents] = useState<any[]>([]);
    const [musicEvents, setMusicEvents] = useState<any[]>([]);
    const [edmEvents, setEdmEvents] = useState<any[]>([]);
    const [acousticEvents, setAcousticEvents] = useState<any[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Helper format tiền
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await showApi.getAllShows();
                const rawData = response.data;

                if (!Array.isArray(rawData)) {
                    console.error("❌ Dữ liệu trả về không phải là mảng:", rawData);
                    return;
                }

                // --- MAP DỮ LIỆU ---
                const mappedEvents = rawData.map((show: any) => {
                    // 1. Xử lý địa chỉ
                    const addr = show.address || {};
                    const fullLocation = addr.fullAddress ||
                        [addr.specificAddress, addr.ward, addr.district, addr.province]
                            .filter(Boolean).join(", ");

                    // 2. Xử lý giá vé
                    let minPrice = 0;
                    if (show.ticketTypes && show.ticketTypes.length > 0) {
                        minPrice = Math.min(...show.ticketTypes.map((t: any) => t.price));
                    }

                    // 3. XỬ LÝ ẢNH
                    let imageUrl = 'https://placehold.co/600x400?text=No+Image';

                    if (show.images && show.images.length > 0) {
                        const firstImg = show.images[0];
                        let imageId = "";

                        if (typeof firstImg === 'object' && firstImg !== null) {
                            imageId = firstImg.imageFileId || firstImg.id;
                        } else {
                            imageId = String(firstImg);
                        }

                        if (imageId && !imageId.includes("object")) {
                            imageUrl = `${API_IMAGE_BASE}/${imageId}`;
                        }
                    }

                    return {
                        id: show.id,
                        title: show.name,
                        date: show.startTime,
                        location: fullLocation || "Đang cập nhật",
                        image: imageUrl,
                        price: minPrice,
                        formattedPrice: minPrice === 0 ? "Miễn phí" : formatCurrency(minPrice),
                        description: show.description
                    };
                });

                // 4. Sắp xếp: Mới nhất lên đầu
                const sortedEvents = mappedEvents.sort((a: any, b: any) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                // 5. Phân chia dữ liệu
                setHighlightedEvents(sortedEvents.slice(0, 4));
                setMusicEvents(sortedEvents.slice(4, 8));
                setEdmEvents(sortedEvents.slice(8, 12));
                setAcousticEvents(sortedEvents.slice(12, 16));

            } catch (error: any) {
                console.error("❌ Lỗi khi tải trang chủ:", error);
                setErrorMessage("Không thể tải danh sách sự kiện.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <Navbar />
            <main>
                <Hero />

                {/* --- SỰ KIỆN NỔI BẬT (ĐÃ SỬA GRID) --- */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-500 pl-3">
                            SỰ KIỆN NỔI BẬT
                        </h2>
                    </div>

                    {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

                    {highlightedEvents.length > 0 ? (
                        // Grid Layout mới: 1 cột (mobile) -> 2 cột (tablet) -> 4 cột (PC)
                        // Bỏ cấu trúc lồng nhau gây lỗi layout cũ
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {highlightedEvents.slice(0, 4).map(event => (
                                <div key={event.id} className="h-full">
                                    <EventCard 
                                        event={event} 
                                        imageClassName="h-48 sm:h-52" // Cố định chiều cao ảnh
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        !errorMessage && <p className="text-gray-500 text-center italic">Chưa có sự kiện nổi bật nào.</p>
                    )}
                </section>

                {/* Các section khác */}
                {musicEvents.length > 0 && (
                    <EventSection
                        title="CA NHẠC"
                        events={musicEvents}
                        viewMoreLink="/music"
                    />
                )}

                {edmEvents.length > 0 && (
                    <EventSection
                        title="EDM & ROCK"
                        events={edmEvents}
                        viewMoreLink="/music"
                    />
                )}

                {acousticEvents.length > 0 && (
                    <EventSection
                        title="ACOUSTIC & INDIE"
                        events={acousticEvents}
                        viewMoreLink="/arts"
                    />
                )}

            </main>
            <Footer />
        </div>
    );
};

export default HomePage;