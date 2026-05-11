# POS System (Point of Sale)

Dự án Hệ thống Quản lý Bán lẻ (POS) bao gồm Backend (Node.js/Express) và Frontend (React/Vite).

## Cấu trúc dự án
- `/backend`: API server sử dụng Node.js, Express và SQL Server (Sequelize).
- `/frontend`: Giao diện người dùng sử dụng React và Vite.

## Hướng dẫn cài đặt và chạy

### 1. Cấu hình Backend
- Di chuyển vào thư mục backend: `cd backend`
- Cài đặt dependencies: `npm install`
- Cấu hình kết nối cơ sở dữ liệu trong `backend/configs/db.js`.
- Chạy server: `npm run dev` (Server chạy tại port 5001)

### 2. Cấu hình Frontend
- Di chuyển vào thư mục frontend: `cd frontend`
- Cài đặt dependencies: `npm install`
- Chạy ứng dụng: `npm run dev`

## Công nghệ sử dụng
- **Backend**: Node.js, Express, Sequelize (SQL Server), JWT.
- **Frontend**: React, Vite, CSS Vanilla.
- **Database**: Microsoft SQL Server.

## Tính năng chính
- Quản lý sản phẩm và danh mục.
- Quản lý đơn hàng và thanh toán.
- Quản lý khách hàng và điểm tích lũy.
- Quản lý bảo hành và trả hàng.
