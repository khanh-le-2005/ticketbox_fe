// src/pages/ArtsPage.tsx

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import showApi from '../api/showApi'; // Import API

// Hàm format tiền tệ
const formatCurrency = (val: number) => 
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

const ArtsPage: React.FC = () => {
    // 1. State lưu trữ dữ liệu
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 2. Gọi API lấy dữ liệu
    useEffect(() => {
        const fetchArtsEvents = async () => {
            try {
                setLoading(true);
                const response = await showApi.getAllShows();
                const rawData = response.data;

                // 3. Map dữ liệu từ Backend sang Frontend
                const mappedEvents = rawData.map((show: any) => {
                    // Xử lý địa chỉ
                    const addr = show.address || {};
                    const fullLocation = addr.fullAddress || 
                        [addr.specificAddress, addr.ward, addr.district, addr.province]
                        .filter(Boolean).join(", ");

                    // Xử lý giá vé thấp nhất
                    let minPrice = 0;
                    if (show.ticketTypes && show.ticketTypes.length > 0) {
                        minPrice = Math.min(...show.ticketTypes.map((t: any) => t.price));
                    }

                    // Xử lý ảnh: Nếu không có ảnh thật thì dùng ảnh seed 'abstract' cho nghệ thuật
                    const imageUrl = (show.images && show.images.length > 0) 
                        ? show.images[0] 
                        : 'https://picsum.photos/seed/arts/800/600'; 

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

                // (Tùy chọn) Lọc hoặc sắp xếp
                // Hiện tại hiển thị tất cả, sắp xếp mới nhất lên đầu
                const sortedEvents = mappedEvents.sort((a: any, b: any) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                setEvents(sortedEvents);
            } catch (error) {
                console.error("Lỗi khi tải sự kiện nghệ thuật:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtsEvents();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Banner Arts */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-8" style={{backgroundImage: "url('https://picsum.photos/seed/artsbg/1200/200')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
                        <div className="bg-black bg-opacity-50 p-4 rounded-md">
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Văn Hóa & Nghệ Thuật</h1>
                            <p className="text-gray-200">Đắm chìm trong không gian của những giai điệu acoustic, kịch nói, triển lãm và các sự kiện nghệ thuật đặc sắc.</p>
                        </div>
                    </div>
                    
                    <section>
                        {loading ? (
                            // Loading UI
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                            </div>
                        ) : (
                            // Grid Data
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {events.length > 0 ? (
                                    events.map((event) => (
                                        <EventCard key={event.id} event={event} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center text-gray-500 py-10 italic">
                                        Hiện chưa có sự kiện nghệ thuật nào.
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

export default ArtsPage;