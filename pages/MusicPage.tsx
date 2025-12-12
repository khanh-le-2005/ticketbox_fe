// src/pages/MusicPage.tsx

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';

// Import API
import showApi from '../api/showApi';

// --- QUAN TRỌNG: Định nghĩa đường dẫn gốc tới API ảnh ---
const API_IMAGE_BASE = "https://api.momangshow.vn/api/images";

// Hàm helper format tiền
const formatCurrency = (val: number) => 
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

const MusicPage: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string>("");

    useEffect(() => {
        const fetchMusicEvents = async () => {
            try {
                setLoading(true);
                
                // 1. Gọi API lấy tất cả Show
                const response = await showApi.getAllShows(); 
                const rawData = response.data; 

                if (!Array.isArray(rawData)) {
                    throw new Error("Dữ liệu trả về không hợp lệ");
                }

                // 2. Map dữ liệu (Chuẩn hóa)
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

                    // --- XỬ LÝ ẢNH (QUAN TRỌNG) ---
                    let imageUrl = 'https://placehold.co/600x400?text=No+Image'; // Ảnh mặc định
                    
                    if (show.images && show.images.length > 0) {
                        const firstImg = show.images[0];
                        // Lấy ID ảnh từ object showImage
                        const imageId = firstImg.imageFileId || firstImg.id || firstImg;
                        // Ghép link hoàn chỉnh
                        imageUrl = `${API_IMAGE_BASE}/${imageId}`;
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

                // 3. Sắp xếp: Mới nhất lên đầu
                const sortedEvents = mappedEvents.sort((a: any, b: any) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                // (Tùy chọn) Nếu muốn lọc chỉ lấy sự kiện âm nhạc, bạn có thể filter theo genre
                // const musicOnly = sortedEvents.filter(e => e.genre === 'Music');
                
                setEvents(sortedEvents);
            } catch (error: any) {
                console.error("Failed to fetch music events:", error);
                setErrorMsg("Không thể tải danh sách sự kiện. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchMusicEvents();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Banner */}
                    <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-8 shadow-xl">
                        <img 
                            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop" 
                            alt="Music Banner" 
                            className="w-full h-48 object-cover opacity-60"
                        />
                        <div className="absolute inset-0 flex flex-col justify-center px-8">
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-md">Sự Kiện Ca Nhạc</h1>
                            <p className="text-gray-200 drop-shadow-md max-w-2xl">
                                Khám phá những đêm nhạc sôi động, liveshow hoành tráng và các sự kiện âm nhạc đỉnh cao đang diễn ra.
                            </p>
                        </div>
                    </div>
                    
                    <section>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
                            </div>
                        ) : errorMsg ? (
                            <div className="text-center py-10 bg-red-50 text-red-600 rounded-lg">
                                {errorMsg}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {events.length > 0 ? (
                                    events.map((event) => (
                                        <EventCard key={event.id} event={event} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center text-gray-500 py-10 italic">
                                        Hiện chưa có sự kiện nào trong danh mục này.
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

export default MusicPage;