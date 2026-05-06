# 🐱 Oggy và Những Người Bạn — Interactive Web Portfolio

> Một trang portfolio sáng tạo theo phong cách hoạt hình **Oggy và Những Chú Gián**, kết hợp trải nghiệm **3D tương tác**, **cốt truyện** và **mini-game đập gián** đầy thú vị.

---

## 🌟 Tổng Quan Dự Án

Đây không chỉ là một trang portfolio thông thường. Dự án mang đến trải nghiệm độc đáo gồm **3 phần chính**:

| Phần | Mô tả |
|---|---|
| 🏠 **Portfolio 3D** | Khám phá các nhân vật Oggy, Jack, Olivia, Bob, Joey, Dee Dee, Marky trong không gian 3D tương tác |
| 📖 **Cốt Truyện** | Xem lại câu chuyện về các nhân vật qua giao diện lật sách 3D mượt mà |
| 🎮 **Mini Game** | Chơi game đập gián trong căn phòng 3D isometric với đầy đủ hệ thống điểm, mạng và trợ giúp |

---

## 🎮 Tính Năng Nổi Bật

### Portfolio 3D Tương Tác
- **Seven nhân vật 3D** render bằng Three.js, mỗi nhân vật có animation riêng (floating, idle)
- **Pixel-perfect click detection** — Chỉ click vào vùng nhân vật thực, không phải bounding box
- **Info Panel Glassmorphism** — Thông tin nhân vật hiện ra với hiệu ứng kính mờ đẹp mắt
- **Bướm bay thông minh** — Tự điều hướng ngẫu nhiên trên màn hình
- **Tivi mini-player** — Chuyển kênh GIF tự động mỗi 6 giây
- **Âm thanh cho từng nhân vật** — Mỗi nhân vật có tiếng riêng khi click
- **Hiệu ứng chuyển cảnh** hút vào tâm / bung ra khi chuyển giữa các scene

### Cốt Truyện (Story Mode)
- **Lật sách 3D** với hiệu ứng uốn cong trang giấy, bóng đổ và ánh sáng phản chiếu
- Điều hướng bằng **mũi tên**, **lăn chuột** hoặc **phím ← →**
- Hiệu ứng mở sách xuất phát từ nút bấm

### Mini Game — Truy Tìm Chìa Khóa Vàng
- **Căn phòng 3D isometric** được render bằng Three.js với model GLB chất lượng cao
- **3 con gián** (Marky, Dee Dee, Joey) với AI di chuyển, né tránh chuột và chui vào góc trốn
- **Hệ thống Boss** — Joey có 3 máu, cần hạ toàn bộ 3 con mới thắng
- **Bom** xuất hiện ngẫu nhiên và dịch chuyển liên tục
- **Cà chua bay** — Gián phản công mỗi 15 giây, chém bằng Ctrl+Click
- **Hệ thống trợ giúp** (mỗi loại chỉ dùng 1 lần):
  - ❤️ Thêm 1 mạng
  - ⏰ Đóng băng đồng hồ 5 giây
  - 🪳 Đóng băng gián 5 giây (nhưng vẫn phải giết hết 3 con!)
- **Nhạc nền** thay đổi theo từng giai đoạn thời gian (0-30s, 30-60s, 60-90s)
- Hiệu ứng **màn hình tối dần** khi gần hết giờ
- **Win Scene** và **Game Over Scene** với animation hoành tráng

---

## 🗂️ Cấu Trúc Dự Án

```
OGGY_FINAL/
├── index.html              # Entry point → tự redirect sang oggy2/
│
├── oggy2/                  # 🏠 Portfolio + Cốt Truyện
│   ├── index.html          # Giao diện chính (Portfolio 3D + Story)
│   ├── main.js             # Logic Three.js, tương tác nhân vật, story
│   └── assets/
│       ├── *.png           # Ảnh nhân vật (Oggy, Jack, Olivia, Bob, Joey, Dee Dee, Marky)
│       ├── bg_*.jpg        # Background riêng cho từng nhân vật
│       ├── *fn*.jpg        # Ảnh khoảnh khắc hài hước (film strip)
│       ├── tv*.gif         # GIF cho tivi mini
│       ├── cloud*.png      # Mây bay
│       ├── btf*.png        # Bướm (butterfly)
│       ├── oggy.glb        # Model 3D Oggy
│       └── sounds/         # Âm thanh nhân vật + UI
│
├── OGGY/                   # 🎮 Mini Game
│   ├── index.html          # Giao diện game (Loading → Video → Tutorial → Gameplay)
│   ├── main.js             # Logic game 3D isometric (Three.js)
│   ├── style.css           # CSS toàn bộ game
│   └── assets/
│       ├── room.glb        # Căn phòng 3D (~24MB)
│       ├── cartoon_TV.glb  # TV hoạt hình 3D
│       ├── cartoon_sofa.glb# Sofa hoạt hình 3D
│       ├── golden_key.glb  # Chìa khóa vàng (mục tiêu)
│       ├── cheese.glb      # Phô mai (mồi nhử)
│       ├── tomato.glb      # Cà chua (~47MB)
│       ├── *.png           # Sprite gián (Joey, Marky, Dee Dee)
│       └── videos/         # Nhạc nền + SFX + video intro
│
├── package.json
└── package-lock.json
```

---

## 🛠️ Công Nghệ Sử Dụng

| Công nghệ | Mục đích |
|---|---|
| **Three.js** `v0.160+` | Render 3D nhân vật, căn phòng game, hiệu ứng |
| **GLTFLoader** | Tải model 3D định dạng `.glb` |
| **Vite** `v8.x` | Dev server và build tool |
| **Vanilla CSS** | Toàn bộ styling, glassmorphism, animation |
| **Vanilla JavaScript** | Logic game, tương tác, âm thanh |
| **HTML5 Canvas** | Pixel-perfect click detection cho nhân vật |
| **Web Audio API** | Hệ thống âm thanh SFX + BGM |

---

## 🚀 Hướng Dẫn Chạy Dự Án

### Yêu cầu
- **Node.js** >= 16.x
- **npm** >= 8.x

### Cài đặt và chạy

```bash
# 1. Clone repository
git clone https://github.com/quytsiriel/OggyVaNhungNguoiBan.git
cd OggyVaNhungNguoiBan

# 2. Cài đặt dependencies
npm install

# 3. Chạy dev server
npx vite

# 4. Mở trình duyệt tại
# http://localhost:5173
```

> ⚠️ **Lưu ý:** Do các file model 3D có dung lượng lớn (`room.glb` ~24MB, `tomato.glb` ~47MB), lần đầu tải game sẽ mất vài giây. Đây là hành vi bình thường.

---

## 🎯 Cách Chơi Mini Game

1. Từ trang Portfolio, nhấn nút **"Vào nhà"** để vào game
2. Xem video intro (hoặc bấm **"Bỏ qua Video"**)
3. Đọc hướng dẫn và nhấn **"Bắt Đầu Chơi!"**

| Thao tác | Tác dụng |
|---|---|
| `Left Click` | Đập gián / bom |
| `Ctrl + Left Click` | Chém cà chua bay |
| Nút **🛡️ Trợ Giúp** | Mở menu trợ giúp (tạm dừng game) |

### Cách Thắng
1. Hạ gục **tất cả 3 con gián** (Marky, Dee Dee và Joey)
2. Joey có **3 máu** — cần đập 3 lần (mỗi lần cách nhau ít nhất 400ms)
3. Khi tất cả gã gục → **Chìa Khóa Vàng** xuất hiện
4. Click vào chìa khóa → **CHIẾN THẮNG!**

### Thua Cuộc Khi
- Hết **90 giây** mà chưa lấy được chìa khóa
- Mất hết **3 mạng** (do bấm vào bom)

---

## 🎨 Các Nhân Vật

| Nhân vật | Mô tả |
|---|---|
| 🐱 **Oggy** | Nhân vật chính, hiền lành, yêu nội trợ và nhạc cổ điển |
| 🐱 **Jack** | Nóng nảy, thích chế tạo vũ khí và tập thể hình |
| 🐱 **Olivia** | Dịu dàng, yêu thiên nhiên và hoà bình |
| 🐶 **Bob** | Cục súc, yêu không gian riêng tư |
| 🪳 **Joey** | Bộ não của nhóm gián, mưu mô, tham vọng |
| 🪳 **Dee Dee** | Ngây thơ, ham ăn, thích xúc xích |
| 🪳 **Marky** | Tâm hồn nghệ sĩ đào hoa, thích soi gương |

---

## 📁 Repository

**GitHub:** [https://github.com/quytsiriel/OggyVaNhungNguoiBan](https://github.com/quytsiriel/OggyVaNhungNguoiBan)

---

*Được xây dựng với ❤️ và nhiều tách cà phê ☕ — lấy cảm hứng từ tuổi thơ xem Oggy mỗi buổi sáng.*
