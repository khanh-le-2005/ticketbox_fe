import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import EventCard from '../components/EventCard';
import EventSection from '../components/EventSection';
import Footer from '../components/Footer';

// Import API
import showApi from '../api/showApi';

const HomePage: React.FC = () => {
    const [highlightedEvents, setHighlightedEvents] = useState<any[]>([]);
    const [musicEvents, setMusicEvents] = useState<any[]>([]);
    const [edmEvents, setEdmEvents] = useState<any[]>([]);
    const [acousticEvents, setAcousticEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    // Thêm state lỗi để hiển thị lên màn hình cho dễ nhìn
    const [errorMessage, setErrorMessage] = useState<string>(""); 

    // Helper format tiền
    const formatCurrency = (val: number) => 
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("🚀 Bắt đầu gọi API getAllShows...");

                const response = await showApi.getAllShows();
                console.log("✅ Kết quả API trả về:", response);

                const rawData = response.data;

                if (!Array.isArray(rawData)) {
                    console.error("❌ Dữ liệu trả về không phải là mảng:", rawData);
                    setErrorMessage("Dữ liệu từ Server bị lỗi định dạng.");
                    return;
                }

                // 1. Map dữ liệu
                const mappedEvents = rawData.map((show: any) => {
                    const addr = show.address || {};
                    const fullLocation = addr.fullAddress || 
                        [addr.specificAddress, addr.ward, addr.district, addr.province]
                        .filter(Boolean).join(", ");

                    let minPrice = 0;
                    if (show.ticketTypes && show.ticketTypes.length > 0) {
                        minPrice = Math.min(...show.ticketTypes.map((t: any) => t.price));
                    }

                    // Xử lý ảnh (đảm bảo hiển thị ảnh đầu tiên hoặc ảnh mẫu)
                    const imageUrl = (show.images && show.images.length > 0) 
                        ? show.images[0] 
                        : 'https://picsum.photos/seed/event/800/600'; 

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

                // 2. Sắp xếp show mới nhất
                const sortedEvents = mappedEvents.sort((a: any, b: any) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                console.log("📊 Số lượng show sau khi xử lý:", sortedEvents.length);

                // 3. Phân chia dữ liệu
                setHighlightedEvents(sortedEvents.slice(0, 4));
                setMusicEvents(sortedEvents.slice(4, 8));
                setEdmEvents(sortedEvents.slice(8, 12));
                setAcousticEvents(sortedEvents.slice(12, 16));

            } catch (error: any) {
                console.error("❌ Lỗi khi tải trang chủ:", error);
                // Hiển thị lỗi cụ thể lên màn hình
                if (error.response) {
                    // Lỗi từ Server trả về (401, 403, 404, 500...)
                    setErrorMessage(`Lỗi Server: ${error.response.status} - ${error.response.statusText}`);
                } else if (error.request) {
                    // Không nhận được phản hồi (Server tắt hoặc lỗi mạng)
                    setErrorMessage("Không thể kết nối đến Server.");
                } else {
                    setErrorMessage("Lỗi xử lý dữ liệu: " + error.message);
                }
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
                
                {/* --- Highlighted Events Section --- */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                         <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-500 pl-3">
                            SỰ KIỆN NỔI BẬT
                        </h2>
                    </div>

                    {/* HIỂN THỊ LỖI NẾU CÓ */}
                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Đã xảy ra lỗi! </strong>
                            <span className="block sm:inline">{errorMessage}</span>
                            <p className="text-sm mt-1">Hãy nhấn F12, chọn tab Console để xem chi tiết.</p>
                        </div>
                    )}

                    {highlightedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid grid-cols-1 gap-6">
                                {highlightedEvents.slice(0, 2).map(event => (
                                    <EventCard key={event.id} event={event} imageClassName="h-52" />
                                ))}
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {highlightedEvents.slice(2, 4).map(event => (
                                    <EventCard key={event.id} event={event} imageClassName="h-52" />
                                ))}
                            </div>
                        </div>
                    ) : (
                        !errorMessage && <p className="text-gray-500 text-center italic">Chưa có sự kiện nổi bật nào.</p>
                    )}
                </section>
                
                {musicEvents.length > 0 && <EventSection title="CA NHẠC" events={musicEvents} />}
                {edmEvents.length > 0 && <EventSection title="EDM & ROCK" events={edmEvents} />}
                {acousticEvents.length > 0 && <EventSection title="ACOUSTIC & INDIE" events={acousticEvents} />}

            </main>
            <Footer />
        </div>
    );
};

export default HomePage;