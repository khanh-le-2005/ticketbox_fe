import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import showApi from '../api/showApi'; // Import API

// Cấu hình đường dẫn backend để nối ảnh
const API_BASE_URL = "http://localhost:8080"; 

// Helper format tiền
const formatCurrency = (val: number) => 
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

const NewsPage: React.FC = () => {
    const [newsEvents, setNewsEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchNewsData = async () => {
            try {
                setLoading(true);
                const response = await showApi.getAllShows();
                const rawData = response.data;

                // Map dữ liệu từ API sang cấu trúc hiển thị
                const mappedData = rawData.map((show: any) => {
                    // 1. Xử lý địa chỉ
                    const addr = show.address || {};
                    const fullLocation = addr.fullAddress || 
                        [addr.specificAddress, addr.ward, addr.district, addr.province]
                        .filter(Boolean).join(", ");

                    // 2. Xử lý giá vé thấp nhất
                    let minPrice = 0;
                    if (show.ticketTypes && show.ticketTypes.length > 0) {
                        minPrice = Math.min(...show.ticketTypes.map((t: any) => t.price));
                    }

                    // 3. Xử lý ảnh (Quan trọng: Xử lý đường dẫn tương đối và tuyệt đối)
                    let finalImageUrl = 'https://picsum.photos/seed/news/800/600'; // Ảnh mặc định cho tin tức
                    
                    if (show.images && show.images.length > 0) {
                        const imagePath = show.images[0];
                        // Nếu là ảnh Base64 (có data:image...)
                        if (imagePath.data || (typeof imagePath === 'string' && imagePath.includes('base64'))) {
                             const base64String = imagePath.data?.base64 || imagePath.data || imagePath;
                             finalImageUrl = `data:image/jpeg;base64,${base64String}`;
                        } 
                        // Nếu là đường dẫn URL online
                        else if (imagePath.startsWith("http")) {
                            finalImageUrl = imagePath;
                        } 
                        // Nếu là đường dẫn nội bộ server (uploads/...)
                        else {
                            const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
                            finalImageUrl = `${API_BASE_URL}/${cleanPath}`;
                        }
                    }

                    return {
                        id: show.id,
                        title: show.name,
                        date: show.startTime,
                        location: fullLocation || "Đang cập nhật",
                        image: finalImageUrl,
                        price: minPrice,
                        formattedPrice: minPrice === 0 ? "Miễn phí" : formatCurrency(minPrice),
                        description: show.description
                    };
                });

                // Sắp xếp sự kiện mới nhất lên đầu (Tin mới nhất)
                const sortedNews = mappedData.sort((a: any, b: any) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                setNewsEvents(sortedNews);
            } catch (error) {
                console.error("Lỗi khi tải tin tức sự kiện:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNewsData();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Banner Tin Tức */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-8" style={{backgroundImage: "url('https://picsum.photos/seed/newsbg/1200/300')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
                        <div className="bg-black bg-opacity-60 p-6 rounded-md max-w-3xl">
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Tin Tức & Sự Kiện</h1>
                            <p className="text-gray-200 text-lg">Cập nhật những thông tin nóng hổi nhất về thế giới giải trí và các show diễn sắp bùng nổ.</p>
                        </div>
                    </div>
                    
                    <section>
                        {loading ? (
                            // Loading UI
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                            </div>
                        ) : (
                            // Grid hiển thị tin tức (Sử dụng EventCard)
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {newsEvents.length > 0 ? (
                                    newsEvents.map((item) => (
                                        <EventCard key={item.id} event={item} />
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-16">
                                        <p className="text-xl font-medium mb-2">Hiện chưa có tin tức sự kiện nào.</p>
                                        <p className="text-sm">Hãy quay lại sau để cập nhật nhé!</p>
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

export default NewsPage;