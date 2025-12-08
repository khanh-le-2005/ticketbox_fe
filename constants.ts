

import { Event, Hotel } from './types';
export const SEATING_CHART_URL = 'https://i.postimg.cc/bvVzJr6T/ghengoi.jpg';

export const NAV_LINKS = [
    'Đặt vé ca nhạc', 'Đặt phòng', 'Tin tức'
];

export const FEATURED_EVENTS_SLIDER: Event[] = [
    { 
        id: 1, 
        title: 'Liveshow "My Soul 1981" - Mỹ Tâm', 
        imageUrl: 'https://i.postimg.cc/YqPwcZsr/mytam.jpg', 
        date: { month: 'Thg 7', day: 15, year: 2025 }, 
        views: 250000, 
        location: 'Hà Nội', 
        fullLocation: 'Cung Điền kinh Mỹ Đình, Hà Nội',
        time: '20:00',
        price: '1.500.000+', 
        description: 'Liveshow đặc biệt của "Họa mi tóc nâu" Mỹ Tâm, hứa hẹn mang đến những bản hit đình đám và những ca khúc mới nhất trong không gian âm nhạc đỉnh cao. Chương trình được đầu tư hoành tráng về âm thanh, ánh sáng, tái hiện lại hành trình âm nhạc đầy cảm xúc của Mỹ Tâm qua các thập kỷ.',
        lineup: ['Mỹ Tâm', 'Khách mời bí mật'],
        ticketTiers: [
            { name: 'Super VIP', price: '4.000.000 VNĐ', type: 'Ghế ngồi', description: 'Vị trí trung tâm, quà tặng độc quyền.' },
            { name: 'VIP', price: '2.500.000 VNĐ', type: 'Ghế ngồi', description: 'Gần sân khấu, tầm nhìn đẹp.' },
            { name: 'GA 1', price: '1.500.000 VNĐ', type: 'Đứng/Ngồi', description: 'Khu vực phổ thông 1.' },
            { name: 'GA 2', price: '800.000 VNĐ', type: 'Đứng/Ngồi', description: 'Khu vực phổ thông 2.' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 2, 
        title: 'Concert "Chân Trời Rực Rỡ" - Hà Anh Tuấn', 
        imageUrl: 'https://i.postimg.cc/Rhb2BJX4/haanhtuan.jpg', 
        date: { month: 'Thg 8', day: 1, year: 2025 }, 
        views: 180000, 
        location: 'TP. HCM', 
        fullLocation: 'Sân vận động Quân khu 7, TP. HCM',
        time: '19:30',
        price: '2.000.000+', 
        description: 'Hà Anh Tuấn tiếp tục mang đến một đêm nhạc đầy cảm xúc với những câu chuyện kể bằng âm nhạc, trong một không gian sân khấu được đầu tư hoành tráng. Concert hứa hẹn sẽ là nơi hội tụ của những tâm hồn đồng điệu, yêu cái đẹp và âm nhạc tử tế.',
        lineup: ['Hà Anh Tuấn', 'Đen Vâu'],
        ticketTiers: [
            { name: 'Horizon VIP', price: '5.000.000 VNĐ', type: 'Ghế ngồi', description: 'Vị trí tốt nhất, tiệc nhẹ trước giờ diễn.' },
            { name: 'Zone A', price: '3.000.000 VNĐ', type: 'Ghế ngồi', description: 'Khán đài A.' },
            { name: 'Zone B', price: '2.000.000 VNĐ', type: 'Ghế ngồi', description: 'Khán đài B.' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 3, 
        title: 'BLACKPINK WORLD TOUR [BORN PINK] HANOI', 
        imageUrl: 'https://i.postimg.cc/j29390d9/blackping.webp', 
        date: { month: 'Thg 8', day: 10, year: 2025 }, 
        views: 500000, 
        location: 'Hà Nội', 
        fullLocation: 'Sân vận động Quốc gia Mỹ Đình, Hà Nội',
        time: '19:00',
        price: '2.500.000+', 
        description: 'Nhóm nhạc nữ toàn cầu BLACKPINK trở lại Việt Nam với world tour BORN PINK. Một sự kiện không thể bỏ lỡ cho cộng đồng BLINKs. Sân khấu bùng nổ với các bản hit Pink Venom, Shut Down, How You Like That...',
        lineup: ['Jisoo', 'Jennie', 'Rosé', 'Lisa'],
        ticketTiers: [
            { name: 'VIP', price: '9.800.000 VNĐ', type: 'Ghế ngồi', description: 'Soundcheck, thẻ VIP, quà lưu niệm.' },
            { name: 'Platinum', price: '6.800.000 VNĐ', type: 'Ghế ngồi', description: 'Tầng 1 khán đài.' },
            { name: 'CAT 1', price: '5.800.000 VNĐ', type: 'Ghế ngồi', description: 'Tầng 2 khán đài, view trực diện.' },
            { name: 'CAT 2', price: '3.800.000 VNĐ', type: 'Ghế ngồi', description: 'Tầng 2 khán đài, cánh gà.' },
            { name: 'CAT 3', price: '2.500.000 VNĐ', type: 'Ghế ngồi', description: 'Tầng 3 khán đài.' }
        ],
        seatingChartUrl: 'https://picsum.photos/seed/bp_chart/600/400'
    },
    { 
        id: 4, 
        title: 'Show của Đen: "Mười Năm"', 
        imageUrl: 'https://i.postimg.cc/zvRFyL82/denvau.jpg', 
        date: { month: 'Thg 9', day: 5, year: 2025 }, 
        views: 300000, 
        location: 'TP. HCM', 
        fullLocation: 'Nhà thi đấu Phú Thọ, TP. HCM',
        time: '20:00',
        price: '800.000+', 
        description: 'Đen Vâu kỷ niệm chặng đường 10 năm hoạt động nghệ thuật bằng một liveshow hoành tráng, nhìn lại những dấu mốc quan trọng trong sự nghiệp. Cùng Đồng Âm ôn lại những kỷ niệm đẹp.',
        lineup: ['Đen Vâu', 'Màu Nước Band', 'Lynk Lee', 'Kimmese'],
        ticketTiers: [
            { name: 'Đồng Âm VIP', price: '2.500.000 VNĐ', type: 'Đứng', description: 'Sát sân khấu.' },
            { name: 'Đồng Âm Zone', price: '1.200.000 VNĐ', type: 'Đứng', description: 'Khu vực giữa.' },
            { name: 'GA', price: '800.000 VNĐ', type: 'Ngồi', description: 'Khán đài xa.' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 5, 
        title: 'Liveshow "Tri Âm" - Hà Anh Tuấn & Phan Mạnh Quỳnh', 
        imageUrl: 'https://i.postimg.cc/J4pjRcNc/phanmanhquynh.jpg', 
        date: { month: 'Thg 9', day: 20, year: 2025 }, 
        views: 150000, 
        location: 'Đà Lạt', 
        fullLocation: 'Cao đẳng Sư phạm Đà Lạt',
        time: '18:00',
        price: '1.200.000+', 
        description: 'Sự kết hợp lần đầu tiên giữa hai giọng ca đầy tự sự, Hà Anh Tuấn và Phan Mạnh Quỳnh, trong không gian lãng mạn của Đà Lạt chiều hoàng hôn.',
        lineup: ['Hà Anh Tuấn', 'Phan Mạnh Quỳnh'],
        ticketTiers: [
            { name: 'VVIP', price: '3.500.000 VNĐ', type: 'Ghế ngồi', description: 'Bàn tiệc trà.' },
            { name: 'VIP', price: '2.500.000 VNĐ', type: 'Ghế ngồi', description: 'Ghế nệm.' },
            { name: 'Standard', price: '1.200.000 VNĐ', type: 'Ghế ngồi', description: 'Ghế nhựa cao cấp.' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
];

export const HIGHLIGHTED_EVENTS: Event[] = [
    {
    id: 6, 
        title: 'The Winter Concert ft. Suboi & Kimmese', 
        imageUrl: 'https://i.postimg.cc/XJNVNFcn/The-Winter-Concert.jpg', 
        date: { month: 'Thg 12', day: 12, year: 2025 }, 
        views: 180000, 
        location: 'Hà Nội', 
        fullLocation: '1900 Le Théâtre, Tạ Hiện, Hà Nội',
        // fullLocationm:'địa chỉ cụ thể ',
        time: '21:00',
        price: '400.000+', 
        description: 'Đêm nhạc hip-hop đỉnh cao với sự góp mặt của hai nữ hoàng rapper hàng đầu Việt Nam: Suboi và Kimmese. Sẵn sàng cháy hết mình với những flow cực chất.',
        lineup: ['Suboi', 'Kimmese', 'DJ Mie'],
        ticketTiers: [
            { name: 'Vé tiêu chuẩn', price: '400.000 VNĐ', type: 'Đứng', description: 'Vé vào cửa + 1 đồ uống.' },
            { name: 'Combo bàn đứng', price: '2.500.000 VNĐ', type: 'Bàn', description: 'Dành cho 4 người + 1 tháp bia.' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 7, 
        title: 'Dalat Music Festival - "Thành Phố Ngàn Hoa"', 
        imageUrl: 'https://i.postimg.cc/yxM4RS9N/dalat.webp', 
        date: { month: 'Thg 12', day: 21, year: 2025 }, 
        views: 300000, 
        location: 'Đà Lạt', 
        fullLocation: 'Quảng trường Lâm Viên, Đà Lạt',
        time: '16:00',
        price: 'Miễn phí', 
        description: 'Lễ hội âm nhạc thường niên tại Đà Lạt, quy tụ nhiều nghệ sĩ Indie và V-Pop trong một không gian ngoài trời thoáng đãng. Sự kiện mở cửa tự do.',
        lineup: ['Ngọt', 'Chillies', 'Madihu', 'Hoàng Dũng'],
        ticketTiers: [
             { name: 'Vé Fanzone', price: '300.000 VNĐ', type: 'Đứng', description: 'Khu vực gần sân khấu (số lượng có hạn).' },
             { name: 'Vé Vào Cửa', price: '0 VNĐ', type: 'Tự do', description: 'Khu vực khán đài tự do.' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 8, 
        title: 'Mega Booming Music Fest 2025 (Day 2)', 
        imageUrl: 'https://i.postimg.cc/QM02bz1M/mega.jpg', 
        date: { month: 'Thg 12', day: 21, year: 2025 }, 
        views: 50000, 
        location: 'Huế', 
        price: '350.000+',
        description: `Không chỉ là một đại nhạc hội, Mega Booming 2025 (Day 2) còn là hành trình du lịch - âm nhạc - văn hoá đặc sắc, diễn ra tại trái tim di sản văn hoá thế giới Huế. Sự kiện QUY TỤ 21 NGHỆ SĨ HÀNG ĐẦU VIỆT NAM, hứa hẹn mang đến một đêm mãn nhãn với hệ thống âm thanh - ánh sáng - sân khấu đẳng cấp quốc tế.`,
        time: '19:00',
        fullLocation: 'Quảng trường Ngọ Môn, Đại Nội, TP Huế, Huế',
        lineup: ['NEKO LÊ', 'B RAY', 'ISAAC', 'QUÂN A.P', 'HOÀNG DŨNG', 'SEXY B', 'GEMINI HÙNG HUỲNH', 'CAPTAIN BOY', 'XUÂN ĐAN K.Y', 'KHOI VU', 'PHẠM ANH KHOA', 'NGỌC KHUÊ', 'LYLY', 'BẠCH TRÀ', 'ĐOÀN HIẾU', 'DJ HUY NGÔ', 'RUM', 'PHẠM VIỆT THẮNG', 'NGÔ TRÚC LINH', 'SHUMO AG', 'TRUNGG I.U'],
        ticketTiers: [
            { name: 'VVIP Standing', price: '3.500.000 VNĐ', type: 'hạng vé đứng', description: 'Khu vực đứng sát sân khấu chính.' },
            { name: 'Vé VIP', price: '3.000.000 VNĐ', type: 'hạng vé ngồi', description: 'Vị trí ngồi cao cấp với tầm nhìn đẹp.' },
            { name: 'Khán Đài A', price: '1.800.000 VNĐ', type: 'hạng vé ngồi', description: 'Vị trí ngồi khán đài A, có mái che.' },
            { name: 'Khán Đài B', price: '1.200.000 VNĐ', type: 'hạng vé ngồi', description: 'Vị trí ngồi khán đài B.' },
        ],
        seatingChartUrl: 'https://i.postimg.cc/bvVzJr6T/ghengoi.jpg'
    },
    { 
        id: 9, 
        title: 'Liveshow Quốc Thiên - "Tình Ca"', 
        imageUrl: 'https://i.postimg.cc/3JZQNWNC/live-concert-Quoc-Thien-2.jpg', 
        date: { month: 'Thg 1', day: 18, year: 2026 }, 
        views: 65000, 
        location: 'Đà Lạt', 
        fullLocation: 'Mây Lang Thang, Đà Lạt',
        time: '17:30',
        price: '350.000+', 
        description: 'Thưởng thức giọng ca nồng nàn của Quốc Thiên qua những bản tình ca bất hủ trong không khí se lạnh của Đà Lạt.',
        lineup: ['Quốc Thiên', 'Uyên Linh'],
        ticketTiers: [
            { name: 'VIP', price: '1.500.000 VNĐ', type: 'Ghế ngồi', description: 'Hàng đầu.' },
            { name: 'Standard', price: '350.000 VNĐ', type: 'Ghế ngồi', description: 'Tầm nhìn bao quát.' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 10, 
        title: 'The Wandering ft. Hoàng Dũng - "Nàng Thơ"', 
        imageUrl: 'https://i.postimg.cc/wTgnCHVn/nangtho.jpg', 
        date: { month: 'Thg 2', day: 14, year: 2026 }, 
        views: 95000, 
        location: 'Hà Nội', 
        fullLocation: 'Trung tâm Hội nghị Quốc gia, Hà Nội',
        time: '20:00',
        price: '600.000+', 
        description: 'Hoàng Dũng và ban nhạc The Wandering sẽ kể những câu chuyện tình yêu qua âm nhạc trong đêm Valentine đặc biệt.',
        lineup: ['Hoàng Dũng', 'Ban nhạc The Wandering'],
        ticketTiers: [
             { name: 'Sweetheart VIP', price: '2.000.000 VNĐ', type: 'Ghế ngồi', description: 'Ghế đôi tình nhân.' },
             { name: 'Lover Zone', price: '600.000 VNĐ', type: 'Ghế ngồi', description: 'Vị trí đẹp.' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 11, 
        title: 'Liveshow "Từ Bàn Tay Này" - Bức Tường', 
        imageUrl: 'https://i.postimg.cc/zXzPd7DD/buctuong.jpg', 
        date: { month: 'Thg 3', day: 8, year: 2026 }, 
        views: 42000, 
        location: 'Hà Nội', 
        fullLocation: 'Đại học Xây Dựng, Hà Nội',
        time: '19:30',
        price: '500.000+', 
        description: 'Huyền thoại rock Việt Nam, Bức Tường, trở lại với một đêm nhạc đầy lửa, hứa hẹn sẽ đốt cháy sân khấu thủ đô.',
        lineup: ['Ban nhạc Bức Tường', 'Phạm Anh Khoa'],
        ticketTiers: [
             { name: 'Rock Fan', price: '500.000 VNĐ', type: 'Đứng', description: 'Khu vực quẩy.' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
];
// MUSIC_EVENTS
export const MUSIC_EVENTS: Event[] = [
    { 
        id: 12, 
        title: 'Liveshow Hoài Lâm - "Về Bên Anh"', 
        imageUrl: 'https://i.postimg.cc/3Jxnjw9d/hoailam.jpg', 
        date: { month: 'Thg 11', day: 28, year: 2025 }, 
        views: 80000, 
        location: 'Hà Nội', 
        fullLocation: 'Nhà hát lớn Hà Nội', 
        time: '20:00', 
        price: '500.000+', 
        description: 'Hoài Lâm trở lại với những ca khúc trữ tình đầy cảm xúc trong liveshow "Về Bên Anh".', 
        lineup: ['Hoài Lâm', 'Ngọc Ánh'], 
        ticketTiers: [
            { name: 'VIP', price: '1.500.000 VNĐ', type: 'Ghế ngồi', description: 'Hàng đầu gần sân khấu' },
            { name: 'Standard', price: '500.000 VNĐ', type: 'Ghế ngồi', description: 'Tầm nhìn toàn cảnh sân khấu' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 13, 
        title: 'Đêm nhạc Trịnh Công Sơn - "Để Gió Cuốn Đi"', 
        imageUrl: 'https://i.postimg.cc/7YhnGWY2/trinhcongson.jpg', 
        date: { month: 'Thg 12', day: 5, year: 2025 }, 
        views: 120000, 
        location: 'Đà Nẵng', 
        fullLocation: 'Cung Thể thao Tiên Sơn, Đà Nẵng', 
        time: '19:30', 
        price: '350.000+', 
        description: 'Thưởng thức những tác phẩm bất hủ của Trịnh Công Sơn qua giọng ca các nghệ sĩ nổi tiếng.', 
        lineup: ['Ca sĩ khách mời'], 
        ticketTiers: [
            { name: 'Vé tiêu chuẩn', price: '350.000 VNĐ', type: 'Ghế ngồi', description: 'Khu vực khán đài' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 14, 
        title: 'The Wandering ft. Hoàng Dũng', 
        imageUrl: 'https://i.postimg.cc/fyLmdVZw/honagdung.jpg', 
        date: { month: 'Thg 12', day: 14, year: 2025 }, 
        views: 95000, 
        location: 'Hà Nội', 
        fullLocation: 'Nhà hát Trưng Vương, Hà Nội', 
        time: '20:00', 
        price: '600.000+', 
        description: 'Hoàng Dũng cùng ban nhạc The Wandering mang đến những bản nhạc acoustic đầy cảm xúc.', 
        lineup: ['Hoàng Dũng', 'The Wandering'], 
        ticketTiers: [
            { name: 'VIP', price: '1.800.000 VNĐ', type: 'Ghế ngồi', description: 'Hàng đầu sân khấu' },
            { name: 'Standard', price: '600.000 VNĐ', type: 'Ghế ngồi', description: 'Tầm nhìn trung bình' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 15, 
        title: 'The Legend Live Concert - Bằng Kiều & Lệ Quyên', 
        imageUrl: 'https://i.postimg.cc/Y9XmttFb/lequyen.jpg', 
        date: { month: 'Thg 1', day: 10, year: 2026 }, 
        views: 150000, 
        location: 'Hồ Chí Minh', 
        fullLocation: 'Nhà hát Hòa Bình, TP HCM', 
        time: '19:00', 
        price: '700.000+', 
        description: 'Bằng Kiều và Lệ Quyên hội ngộ trong đêm nhạc bolero đỉnh cao, hứa hẹn mang lại trải nghiệm âm nhạc khó quên.', 
        lineup: ['Bằng Kiều', 'Lệ Quyên'], 
        ticketTiers: [
            { name: 'VVIP', price: '2.500.000 VNĐ', type: 'Ghế ngồi', description: 'Hàng đầu gần sân khấu' },
            { name: 'VIP', price: '1.500.000 VNĐ', type: 'Ghế ngồi', description: 'Ghế trung bình' },
            { name: 'Standard', price: '700.000 VNĐ', type: 'Ghế ngồi', description: 'Khán đài' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 16, 
        title: 'Le Minshow Trung Quân - "Chưa Bao Giờ"', 
        imageUrl: 'https://i.postimg.cc/DznWsSdR/lehoi.jpg', 
        date: { month: 'Thg 1', day: 20, year: 2026 }, 
        views: 90000, 
        location: 'Hà Nội', 
        fullLocation: 'Cung Văn hoá Hữu Nghị, Hà Nội', 
        time: '20:00', 
        price: '500.000+', 
        description: 'Trung Quân tái hiện những bản hit "Chưa Bao Giờ" trong không gian âm nhạc lãng mạn.', 
        lineup: ['Trung Quân'], 
        ticketTiers: [
            { name: 'VIP', price: '1.500.000 VNĐ', type: 'Ghế ngồi', description: 'Hàng đầu' },
            { name: 'Standard', price: '500.000 VNĐ', type: 'Ghế ngồi', description: 'Khán đài' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 17, 
        title: 'Quốc Thiên - Live Show "Gió Mùa Về"', 
        imageUrl: 'https://i.postimg.cc/Y9jCfY4J/quocthienn.jpg', 
        date: { month: 'Thg 2', day: 5, year: 2026 }, 
        views: 75000, 
        location: 'Đà Nẵng', 
        fullLocation: 'Sân vận động Quân khu 5, Đà Nẵng', 
        time: '19:30', 
        price: '450.000+', 
        description: 'Quốc Thiên gửi tới khán giả những bản ballad ngọt ngào trong live show "Gió Mùa Về".', 
        lineup: ['Quốc Thiên'], 
        ticketTiers: [
            { name: 'VIP', price: '1.200.000 VNĐ', type: 'Ghế ngồi', description: 'Hàng đầu gần sân khấu' },
            { name: 'Standard', price: '450.000 VNĐ', type: 'Ghế ngồi', description: 'Khán đài' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 18, 
        title: 'Sơn Tùng M-TP - Sky Tour', 
        imageUrl: 'https://i.postimg.cc/j20LhcpW/sky_tour.webp', 
        date: { month: 'Thg 2', day: 18, year: 2026 }, 
        views: 250000, 
        location: 'Hồ Chí Minh', 
        fullLocation: 'Sân vận động Thống Nhất, TP HCM', 
        time: '20:00', 
        price: '800.000+', 
        description: 'Sky Tour 2026 tiếp tục hành trình của Sơn Tùng M-TP với âm nhạc hiện đại và sân khấu hoành tráng.', 
        lineup: ['Sơn Tùng M-TP'], 
        ticketTiers: [
            { name: 'VVIP', price: '3.000.000 VNĐ', type: 'Ghế VIP', description: 'Hàng đầu gần sân khấu' },
            { name: 'VIP', price: '1.800.000 VNĐ', type: 'Ghế ngồi', description: 'Ghế trung tâm' },
            { name: 'Standard', price: '800.000 VNĐ', type: 'Ghế ngồi', description: 'Khán đài' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 19, 
        title: 'EDM Festival - Ravolution Music Festival', 
        imageUrl: 'https://i.postimg.cc/d19zWtXV/lehoii.jpg', 
        date: { month: 'Thg 3', day: 12, year: 2026 }, 
        views: 180000, 
        location: 'Hà Nội', 
        fullLocation: 'SVĐ Mỹ Đình, Hà Nội', 
        time: '18:00', 
        price: '600.000+', 
        description: 'Lễ hội EDM lớn nhất miền Bắc, hội tụ các DJ nổi tiếng quốc tế và Việt Nam.', 
        lineup: ['DJ Snake', 'DJ Tiesto', 'DJ KOO', 'Local DJ'], 
        ticketTiers: [
            { name: 'VVIP', price: '3.500.000 VNĐ', type: 'Đứng', description: 'Sát sân khấu' },
            { name: 'VIP', price: '1.800.000 VNĐ', type: 'Đứng', description: 'Khu vực gần sân khấu' },
            { name: 'Standard', price: '600.000 VNĐ', type: 'Đứng', description: 'Khu vực xa sân khấu' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
];


export const TOURISM_EVENTS: Event[] = [ // Re-purposed for EDM & ROCK
    { 
        id: 20, 
        title: 'Rockfest Vietnam 2025', 
        imageUrl: 'https://i.postimg.cc/nLF5XtMj/rook.png', 
        date: { month: 'Thg 6', day: 10, year: 2025 }, 
        views: 75000, 
        location: 'TP. HCM', 
        fullLocation: 'Nhà thi đấu Nguyễn Du',
        time: '18:00',
        price: '600.000+', 
        description: 'Lễ hội nhạc Rock lớn nhất năm.',
        ticketTiers: [ { name: 'Rock Fan', price: '600.000 VNĐ', type: 'Đứng', description: 'Vé phổ thông.' } ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 21, 
        title: 'Hypersonic Music Festival', 
        imageUrl: 'https://i.postimg.cc/ncnvbVW9/fec.jpg', 
        date: { month: 'Thg 7', day: 22, year: 2025 }, 
        views: 90000, 
        location: 'Đà Nẵng', 
        fullLocation: 'Công viên Biển Đông',
        time: '16:00',
        price: '800.000+', 
        description: 'Lễ hội âm nhạc điện tử bên bờ biển Đà Nẵng.',
        ticketTiers: [ { name: 'GA', price: '800.000 VNĐ', type: 'Đứng', description: 'Vé vào cửa.' } ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 22, 
        title: 'In The Mood - Live performance by Microwave', 
        imageUrl: 'https://i.postimg.cc/NfhQ55tK/covananchoi-01-01.jpg', 
        date: { month: 'Thg 8', day: 5, year: 2025 }, 
        views: 45000, 
        location: 'Hà Nội', 
        fullLocation: 'Polygon Musik',
        time: '20:30',
        price: '450.000+', 
        description: 'Ban nhạc Rock Microwave sẽ có một đêm diễn riêng.',
        ticketTiers: [ { name: 'Vé vào cửa', price: '450.000 VNĐ', type: 'Đứng', description: 'Kèm 1 bia.' } ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 23, 
        title: 'Color Me Run - Music & Fun', 
        imageUrl: 'https://i.postimg.cc/L89K1PbX/color.jpg', 
        date: { month: 'Thg 9', day: 15, year: 2025 }, 
        views: 120000, 
        location: 'TP. HCM', 
        fullLocation: 'Khu đô thị Sala',
        time: '14:00',
        price: '550.000+', 
        description: 'Đường chạy sắc màu kết hợp với âm nhạc điện tử.',
        ticketTiers: [ { name: 'Runner Kit', price: '550.000 VNĐ', type: 'Tham gia', description: 'Áo + Bột màu + Bib.' } ],
        seatingChartUrl: SEATING_CHART_URL,
    },
];

export const ARTS_EVENTS: Event[] = [ // Re-purposed for ACOUSTIC & INDIE
    { 
        id: 24, 
        title: 'Đêm nhạc Acoustic - "Chuyện Của Mùa Đông"', 
        imageUrl: 'https://i.postimg.cc/ZqXMVvVZ/poster-chuyencuamuadong-kv-nghe-sy-20241112165036.png', 
        date: { month: 'Thg 10', day: 31, year: 2025 }, 
        views: 33000, 
        location: 'Hà Nội', 
        fullLocation: 'Tranquil Books & Coffee',
        time: '20:00',
        price: '300.000+', 
        description: 'Một đêm nhạc acoustic ấm cúng.',
        ticketTiers: [ { name: 'Vé', price: '300.000 VNĐ', type: 'Ngồi', description: 'Kèm đồ uống.' } ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 25, 
        title: 'Cá Hồi Hoang - "Gấp Gọn Nỗi Buồn"', 
        imageUrl: 'https://i.postimg.cc/PfQS87sn/cahoihoang.webp', 
        date: { month: 'Thg 11', day: 5, year: 2025 }, 
        views: 48000, 
        location: 'TP. HCM', 
        fullLocation: 'Soul Live Project',
        time: '19:00',
        price: '450.000+', 
        description: 'Ban nhạc indie Cá Hồi Hoang mang đến tour diễn mới.',
        ticketTiers: [ { name: 'Vé sớm', price: '450.000 VNĐ', type: 'Đứng', description: 'Khu vực Fanzone.' } ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 26, 
        title: 'Chillies Live Session', 
        imageUrl: 'https://i.postimg.cc/rsVCJ8Xt/chillies.jpg', 
        date: { month: 'Thg 11', day: 19, year: 2025 }, 
        views: 52000, 
        location: 'Cần Thơ', 
        fullLocation: 'Trung tâm văn hóa Cần Thơ',
        time: '19:30',
        price: '350.000+', 
        description: 'Nhóm nhạc Chillies sẽ có một buổi trình diễn live gần gũi.',
        ticketTiers: [ { name: 'Vé', price: '350.000 VNĐ', type: 'Đứng', description: 'Vé vào cửa.' } ],
        seatingChartUrl: SEATING_CHART_URL,
    },
    { 
        id: 27, 
        title: 'V-Pop Underground Hits - ft. Vũ & The Flob', 
        imageUrl: 'https://i.postimg.cc/L89K1PbX/color.jpg', 
        
        date: { month: 'Thg 12', day: 25, year: 2025 }, 
        views: 110000, 
        location: 'Đà Nẵng', 
        fullLocation: 'Nhà hát Trưng Vương',
        time: '20:00',
        price: '700.000+', 
        description: '"Hoàng tử Indie" Vũ kết hợp cùng ban nhạc The Flob.',
        ticketTiers: [ 
            { name: 'VIP', price: '1.000.000 VNĐ', type: 'Ngồi', description: 'Gần sân khấu.' },
            { name: 'GA', price: '700.000 VNĐ', type: 'Ngồi', description: 'Phía sau.' }
        ],
        seatingChartUrl: SEATING_CHART_URL,
    },
];


export const HOTEL_DATA: Hotel[] = [
    { 
        id: 1, 
        name: 'InterContinental Hanoi Landmark72', 
        location: 'Hà Nội', 
        rating: 5, 
        pricePerNight: 3500000, 
        imageUrl: 'https://picsum.photos/seed/hotel1/800/500',
        description: 'Tọa lạc tại tầng cao nhất của tòa nhà Keangnam Hanoi Landmark Tower, InterContinental Hanoi Landmark72 là khách sạn cao nhất Hà Nội, mang đến tầm nhìn ngoạn mục toàn cảnh thành phố. Với thiết kế sang trọng, tiện nghi hiện đại và dịch vụ đẳng cấp, đây là điểm đến lý tưởng cho cả doanh nhân và du khách nghỉ dưỡng.',
        amenities: ['Hồ bơi vô cực', 'Spa & Wellness', 'Phòng gym hiện đại', 'Nhà hàng & Bar cao cấp', 'Dịch vụ phòng 24/7', 'Wifi miễn phí'],
        images: [
            'https://picsum.photos/seed/hotel1/800/500',
            'https://picsum.photos/seed/hotel1_room/400/300',
            'https://picsum.photos/seed/hotel1_pool/400/300',
            'https://picsum.photos/seed/hotel1_view/400/300'
        ],
        availableRooms: 10
    },
    { 
        id: 2, 
        name: 'The Reverie Saigon', 
        location: 'TP. Hồ Chí Minh', 
        rating: 5, 
        pricePerNight: 6800000, 
        imageUrl: 'https://picsum.photos/seed/hotel2/800/500',
        description: 'The Reverie Saigon là biểu tượng của sự xa hoa và tráng lệ tại trung tâm TP.HCM. Với nội thất mang phong cách hoàng gia Ý, từng chi tiết đều được chăm chút tỉ mỉ. Khách sạn cung cấp trải nghiệm nghỉ dưỡng đỉnh cao với các tiện ích 6 sao.',
        amenities: ['Nội thất Ý cao cấp', 'Hồ bơi ngoài trời', 'The Spa at The Reverie', '5 Nhà hàng & Bar', 'Dịch vụ quản gia', 'Xe đưa đón hạng sang'],
        images: [
            'https://picsum.photos/seed/hotel2/800/500',
            'https://picsum.photos/seed/hotel2_room/400/300',
            'https://picsum.photos/seed/hotel2_lobby/400/300',
            'https://picsum.photos/seed/hotel2_bath/400/300'
        ],
        availableRooms: 10
    },
    { 
        id: 3, 
        name: 'JW Marriott Phu Quoc Emerald Bay', 
        location: 'Phú Quốc', 
        rating: 5, 
        pricePerNight: 8200000, 
        imageUrl: 'https://picsum.photos/seed/hotel3/800/500',
        description: 'Được thiết kế bởi kiến trúc sư lừng danh Bill Bensley, khu nghỉ dưỡng tái hiện ngôi trường đại học Lamarck giả tưởng thế kỷ 19. Nằm bên bãi Kem tuyệt đẹp, JW Marriott Phu Quoc mang đến không gian nghỉ dưỡng độc đáo, đầy màu sắc và nghệ thuật.',
        amenities: ['Bãi biển riêng', '3 Hồ bơi lớn', 'Chanterelle - Spa by JW', 'Các hoạt động giải trí', 'Kids Club', 'Ẩm thực đa dạng'],
        images: [
            'https://picsum.photos/seed/hotel3/800/500',
            'https://picsum.photos/seed/hotel3_room/400/300',
            'https://picsum.photos/seed/hotel3_beach/400/300',
            'https://picsum.photos/seed/hotel3_pool/400/300'
        ],
        availableRooms: 10
    },
    { 
        id: 4, 
        name: 'Four Seasons Resort The Nam Hai', 
        location: 'Hội An', 
        rating: 5, 
        pricePerNight: 15000000, 
        imageUrl: 'https://picsum.photos/seed/hotel4/800/500',
        description: 'Nằm dọc theo bờ biển Hà My nguyên sơ, Four Seasons Resort The Nam Hai là thiên đường nghỉ dưỡng yên bình. Các biệt thự được thiết kế theo phong thủy, hòa mình vào thiên nhiên, mang đến sự riêng tư và thư giãn tuyệt đối.',
        amenities: ['Biệt thự có hồ bơi riêng', 'Spa trên mặt nước', 'Sân Tennis', 'Lớp học nấu ăn', 'Thể thao dưới nước', 'Yoga & Thiền'],
        images: [
            'https://picsum.photos/seed/hotel4/800/500',
            'https://picsum.photos/seed/hotel4_villa/400/300',
            'https://picsum.photos/seed/hotel4_spa/400/300',
            'https://picsum.photos/seed/hotel4_beach/400/300'
        ],
        availableRooms: 10
    },
    { 
        id: 5, 
        name: 'Hotel de la Coupole - MGallery', 
        location: 'Sa Pa', 
        rating: 5, 
        pricePerNight: 4100000, 
        imageUrl: 'https://picsum.photos/seed/hotel5/800/500',
        description: 'Kiệt tác kiến trúc giữa mây ngàn Sa Pa, Hotel de la Coupole kết hợp vẻ đẹp quyến rũ của thời trang Pháp thượng lưu với nét văn hóa đặc sắc của các dân tộc vùng cao Tây Bắc. Đây là điểm check-in không thể bỏ qua.',
        amenities: ['Hồ bơi nước nóng trong nhà', 'Nuages Spa', 'Absinthe Bar', 'Nhà hàng Chic', 'Kết nối ga tàu hỏa leo núi', 'Cửa hàng lưu niệm'],
        images: [
            'https://picsum.photos/seed/hotel5/800/500',
            'https://picsum.photos/seed/hotel5_lobby/400/300',
            'https://picsum.photos/seed/hotel5_pool/400/300',
            'https://picsum.photos/seed/hotel5_room/400/300'
        ],
        availableRooms: 10
    },
    { 
        id: 6, 
        name: 'Six Senses Ninh Van Bay', 
        location: 'Nha Trang', 
        rating: 5, 
        pricePerNight: 18000000, 
        imageUrl: 'https://picsum.photos/seed/hotel6/800/500',
        description: 'Ẩn mình giữa những tảng đá kỳ vĩ hướng ra biển Đông, Six Senses Ninh Van Bay mang đến cảm giác biệt lập và gần gũi với thiên nhiên. Các biệt thự được xây dựng hài hòa với môi trường, mang lại trải nghiệm nghỉ dưỡng sang trọng nhưng vẫn mộc mạc.',
        amenities: ['Biệt thự trên đá/mặt nước', 'Hồ bơi riêng từng căn', 'Six Senses Spa', 'Lặn biển & Thể thao nước', 'Rạp chiếu phim ngoài trời', 'Trồng rau hữu cơ'],
        images: [
            'https://picsum.photos/seed/hotel6/800/500',
            'https://picsum.photos/seed/hotel6_villa/400/300',
            'https://picsum.photos/seed/hotel6_view/400/300',
            'https://picsum.photos/seed/hotel6_rock/400/300'
        ],
        availableRooms: 10
    },
    { 
        id: 7, 
        name: 'Azerai La Residence Hue', 
        location: 'Huế', 
        rating: 5, 
        pricePerNight: 3900000, 
        imageUrl: 'https://picsum.photos/seed/hotel7/800/500',
        description: 'Tọa lạc bên dòng sông Hương thơ mộng, Azerai La Residence Hue là một dinh thự cổ điển mang phong cách Art Deco từ những năm 1930. Khách sạn mang đến không gian thanh lịch, hoài cổ và dịch vụ ân cần đậm chất Cố đô.',
        amenities: ['Hồ bơi nước mặn', 'Le Spa', 'Nhà hàng Le Parfum', 'Quầy bar bên hồ bơi', 'Phòng tập thể dục', 'Vườn nhiệt đới'],
        images: [
            'https://picsum.photos/seed/hotel7/800/500',
            'https://picsum.photos/seed/hotel7_exterior/400/300',
            'https://picsum.photos/seed/hotel7_room/400/300',
            'https://picsum.photos/seed/hotel7_river/400/300'
        ],
        availableRooms: 10
    },
    { 
        id: 8, 
        name: 'Vinpearl Resort & Spa Ha Long', 
        location: 'Hạ Long', 
        rating: 5, 
        pricePerNight: 2800000, 
        imageUrl: 'https://picsum.photos/seed/hotel8/800/500',
        description: 'Nằm biệt lập trên đảo Rều, Vinpearl Resort & Spa Hạ Long sở hữu kiến trúc tân cổ điển lộng lẫy như một lâu đài giữa biển. Với tầm nhìn 360 độ ra Vịnh Hạ Long, đây là nơi lý tưởng để tận hưởng kỳ nghỉ dưỡng đẳng cấp.',
        amenities: ['3 Bãi tắm riêng', 'Hồ bơi lớn ngoài trời', 'Akoya Spa', 'Khu vui chơi trẻ em', 'Nhà hàng buffet & Alacarte', 'Trung tâm hội nghị'],
        images: [
            'https://picsum.photos/seed/hotel8/800/500',
            'https://picsum.photos/seed/hotel8_exterior/400/300',
            'https://picsum.photos/seed/hotel8_room/400/300',
            'https://picsum.photos/seed/hotel8_pool/400/300'
        ],
        availableRooms: 10
    },
];