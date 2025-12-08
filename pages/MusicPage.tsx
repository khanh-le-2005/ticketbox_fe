// src/pages/MusicPage.tsx

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';

// 1. IMPORT API: Dựa theo cấu trúc thư mục trong ảnh bạn gửi
// Kiểm tra kỹ xem trong file showApi.ts bạn export default hay export const
import showApi from '../api/showApi'; 
// HOẶC nếu bên trong file showApi.ts bạn viết là "export const ShowAPI = ...", thì dùng dòng dưới:
// import { ShowAPI as showApi } from '../api/showApi';

// Hàm helper format tiền
const formatCurrency = (val: number) => 
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

const MusicPage: React.FC = () => {
    // State lưu danh sách sự kiện
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMusicEvents = async () => {
            try {
                setLoading(true);
                
                // 2. GỌI API
                // Hàm này phải khớp tên với hàm trong file src/api/showApi.ts (ví dụ: getAll, getAllShows...)
                const response = await showApi.getAllShows(); 
                // Lưu ý: response.data là nơi chứa dữ liệu trả về từ server
                const rawData = response.data; 

                // 3. MAP DATA (Chuyển đổi dữ liệu từ Backend -> Frontend)
                const mappedEvents = rawData.map((show: any) => {
                    // Xử lý địa chỉ: Nối chuỗi địa chỉ
                    const addr = show.address || {};
                    const fullLocation = addr.fullAddress || 
                        [addr.specificAddress, addr.ward, addr.district, addr.province]
                        .filter(Boolean).join(", ");

                    // Xử lý giá vé: Lấy giá thấp nhất
                    let minPrice = 0;
                    if (show.ticketTypes && show.ticketTypes.length > 0) {
                        minPrice = Math.min(...show.ticketTypes.map((t: any) => t.price));
                    }

                    // Xử lý ảnh: Lấy ảnh đầu tiên hoặc ảnh mặc định
                    // Nếu backend trả về đường dẫn tương đối (vd: /uploads/abc.jpg), bạn cần thêm domain vào trước
                    const imageUrl = (show.images && show.images.length > 0) 
                        ? show.images[0] 
                        : 'https://picsum.photos/seed/music/800/600';

                    return {
                        id: show.id,
                        // EventCard bên bạn dùng props tên gì thì sửa dòng dưới cho khớp (title/name, eventName...)
                        title: show.name, 
                        date: show.startTime,
                        location: fullLocation || "Đang cập nhật",
                        image: imageUrl,
                        price: minPrice,
                        formattedPrice: minPrice === 0 ? "Miễn phí" : formatCurrency(minPrice),
                        description: show.description
                    };
                });

                // Sắp xếp sự kiện mới nhất lên đầu
                const sortedEvents = mappedEvents.sort((a: any, b: any) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                setEvents(sortedEvents);
            } catch (error) {
                console.error("Failed to fetch music events:", error);
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
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-8" style={{backgroundImage: "url('https://picsum.photos/seed/musicbg/1200/200')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
                        <div className="bg-black bg-opacity-50 p-4 rounded-md">
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Sự Kiện Ca Nhạc</h1>
                            <p className="text-gray-200">Danh sách các show diễn mới nhất được cập nhật từ hệ thống.</p>
                        </div>
                    </div>
                    
                    <section>
                        {loading ? (
                            // Hiệu ứng Loading
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            // Grid hiển thị danh sách
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {events.length > 0 ? (
                                    events.map((event) => (
                                        <EventCard key={event.id} event={event} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center text-gray-500 py-10">
                                        Chưa có sự kiện nào được tạo.
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