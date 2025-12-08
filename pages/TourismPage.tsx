// src/pages/TourismPage.tsx

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import showApi from '../api/showApi'; // Đảm bảo import đúng đường dẫn API

// Hàm format tiền tệ
const formatCurrency = (val: number) => 
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

const TourismPage: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTourismEvents = async () => {
            try {
                setLoading(true);
                const response = await showApi.getAllShows();
                const rawData = response.data;

                // 1. Map dữ liệu từ API sang cấu trúc EventCard
                const mappedEvents = rawData.map((show: any) => {
                    const addr = show.address || {};
                    const fullLocation = addr.fullAddress || 
                        [addr.specificAddress, addr.ward, addr.district, addr.province]
                        .filter(Boolean).join(", ");

                    let minPrice = 0;
                    if (show.ticketTypes && show.ticketTypes.length > 0) {
                        minPrice = Math.min(...show.ticketTypes.map((t: any) => t.price));
                    }

                    const imageUrl = (show.images && show.images.length > 0) 
                        ? show.images[0] 
                        : 'https://picsum.photos/seed/travel/800/600'; // Ảnh mặc định chủ đề du lịch

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

                // 2. LỌC DỮ LIỆU (Tùy chọn)
                // Vì chưa có field Category, ta có thể lọc tạm theo tên chương trình
                // Nếu muốn hiển thị tất cả thì bỏ đoạn .filter() này đi
                const tourismEvents = mappedEvents.filter((event: any) => {
                    // Lọc những show có tên chứa từ khóa liên quan du lịch (ví dụ)
                    // Hoặc tạm thời hiển thị tất cả nếu dữ liệu demo ít
                    return true; 
                    // return event.title.toLowerCase().includes('tour') || event.title.toLowerCase().includes('du lịch');
                });

                // Sắp xếp sự kiện mới nhất
                const sortedEvents = tourismEvents.sort((a: any, b: any) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                setEvents(sortedEvents);
            } catch (error) {
                console.error("Failed to fetch tourism events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTourismEvents();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Banner Du lịch */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-8" style={{backgroundImage: "url('https://picsum.photos/seed/travelbg/1200/300')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
                        <div className="bg-black bg-opacity-60 p-6 rounded-md max-w-2xl">
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Du Lịch & Khám Phá</h1>
                            <p className="text-gray-200 text-lg">Trải nghiệm những chuyến đi tuyệt vời, khám phá vẻ đẹp Việt Nam và các hoạt động văn hóa đặc sắc.</p>
                        </div>
                    </div>
                    
                    <section>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {events.length > 0 ? (
                                    events.map((event) => (
                                        <EventCard key={event.id} event={event} />
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-16">
                                        <p className="text-xl font-medium mb-2">Chưa có tour du lịch nào.</p>
                                        <p className="text-sm">Vui lòng quay lại sau nhé!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TourismPage;