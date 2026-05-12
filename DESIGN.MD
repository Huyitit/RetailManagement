# DESIGN.MD — Architect POS (Retail Electronics Management System)

## 1. Overview

**Architect POS** is an internal web application for retail electronics stores. It provides a unified platform for cashiers, store managers, and system administrators to manage point-of-sale transactions, inventory, suppliers, customers, warranty claims, and reporting — all from a centralized, real-time synchronized database.

### Target Users
| Role | Vietnamese | Key Responsibilities |
|------|-----------|---------------------|
| **Cashier** | Nhân viên thu ngân | POS checkout, customer lookup, warranty processing, exchange/returns |
| **Store Manager** | Quản lý cửa hàng | Product catalog, inventory (import/export slips), supplier/customer profiles, reports |
| **System Admin** | Quản trị hệ thống | Staff account management, role assignment, system configuration |

---

## 2. Design System

### 2.1 Color Palette

#### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--primary-50` | `#EEF2FF` | Subtle backgrounds, hover states |
| `--primary-100` | `#E0E7FF` | Feature card backgrounds, badges |
| `--primary-200` | `#C7D2FE` | Borders, dividers on dark surfaces |
| `--primary-300` | `#A5B4FC` | Icons (inactive), secondary text |
| `--primary-400` | `#818CF8` | Links, interactive text, chart accents |
| `--primary-500` | `#6366F1` | **Primary brand color** — buttons, active states, navigation highlights |
| `--primary-600` | `#4F46E5` | **Button default** — CTA, primary actions |
| `--primary-700` | `#4338CA` | Button hover, active navigation bg |
| `--primary-800` | `#3730A3` | Sidebar background, header gradient end |
| `--primary-900` | `#312E81` | Deep accent, hero section gradient |
| `--primary-950` | `#1E1B4B` | Darkest background layer |

#### Neutral / Surface Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--neutral-0` | `#FFFFFF` | Page background, card surfaces, input bg |
| `--neutral-50` | `#F8FAFC` | Alternate row, subtle panel bg |
| `--neutral-100` | `#F1F5F9` | Sidebar inactive bg, divider lines |
| `--neutral-200` | `#E2E8F0` | Borders, input borders (rest) |
| `--neutral-300` | `#CBD5E1` | Placeholder text, disabled borders |
| `--neutral-400` | `#94A3B8` | Caption text, secondary labels |
| `--neutral-500` | `#64748B` | Body text (secondary) |
| `--neutral-600` | `#475569` | Body text (primary) |
| `--neutral-700` | `#334155` | Headings, strong labels |
| `--neutral-800` | `#1E293B` | Page titles, main headings |
| `--neutral-900` | `#0F172A` | Darkest text |

#### Semantic / Functional Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--success-500` | `#22C55E` | Completed orders, stock sufficient, active accounts |
| `--success-50` | `#F0FDF4` | Success badge background |
| `--warning-500` | `#F59E0B` | Low stock alerts, pending status |
| `--warning-50` | `#FFFBEB` | Warning badge background |
| `--danger-500` | `#EF4444` | Delete actions, out of stock, deactivated accounts |
| `--danger-50` | `#FEF2F2` | Error badge background |
| `--info-500` | `#3B82F6` | Informational tooltips, help icons |
| `--info-50` | `#EFF6FF` | Info badge background |

#### Gradient Definitions
```css
/* Hero / Login left panel */
--gradient-hero: linear-gradient(135deg, #4F46E5 0%, #6366F1 40%, #818CF8 100%);

/* Sidebar navigation */
--gradient-sidebar: linear-gradient(180deg, #4338CA 0%, #4F46E5 100%);

/* CTA Buttons (hover shimmer) */
--gradient-button: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);

/* Revenue chart area fill */
--gradient-chart: linear-gradient(180deg, rgba(99,102,241,0.3) 0%, rgba(99,102,241,0) 100%);
```

### 2.2 Typography

| Element | Font | Weight | Size | Line Height | Letter Spacing |
|---------|------|--------|------|-------------|----------------|
| **Display / Hero** | Inter | 800 (ExtraBold) | 40px / 2.5rem | 1.1 | -0.02em |
| **Page Title (H1)** | Inter | 700 (Bold) | 28px / 1.75rem | 1.3 | -0.01em |
| **Section Title (H2)** | Inter | 600 (SemiBold) | 22px / 1.375rem | 1.4 | 0 |
| **Card Title (H3)** | Inter | 600 (SemiBold) | 18px / 1.125rem | 1.4 | 0 |
| **Subtitle** | Inter | 500 (Medium) | 16px / 1rem | 1.5 | 0 |
| **Body** | Inter | 400 (Regular) | 14px / 0.875rem | 1.6 | 0 |
| **Body Small** | Inter | 400 (Regular) | 13px / 0.8125rem | 1.5 | 0 |
| **Caption / Label** | Inter | 500 (Medium) | 12px / 0.75rem | 1.4 | 0.02em |
| **Button** | Inter | 600 (SemiBold) | 14px / 0.875rem | 1 | 0.01em |
| **Input Text** | Inter | 400 (Regular) | 14px / 0.875rem | 1.5 | 0 |
| **Monospace (SKU/IMEI)** | JetBrains Mono | 500 (Medium) | 13px / 0.8125rem | 1.4 | 0.05em |

**Font Import:**
```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap
```

### 2.3 Spacing & Layout

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Tight inline spacing |
| `--space-sm` | 8px | Icon-to-text gap, compact padding |
| `--space-md` | 12px | Input padding, small card padding |
| `--space-base` | 16px | Standard card padding, section gap |
| `--space-lg` | 24px | Between sections, card gaps |
| `--space-xl` | 32px | Major section separation |
| `--space-2xl` | 48px | Page-level vertical rhythm |
| `--space-3xl` | 64px | Hero section padding |

**Layout Grid:**
- Sidebar width: `260px` (collapsed: `72px`)
- Content max-width: `1400px`
- Content padding: `32px`
- Card gap: `24px`
- Table row height: `52px`

### 2.4 Border Radius (Shape)

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | 4px | Badges, tags, chips |
| `--radius-sm` | 6px | Small buttons, inline elements |
| `--radius-md` | 8px | Input fields, dropdowns |
| `--radius-base` | 10px | Buttons (default), cards |
| `--radius-lg` | 12px | Modal dialogs, large cards |
| `--radius-xl` | 16px | Feature cards, hero panels |
| `--radius-2xl` | 20px | Login panels, splash cards |
| `--radius-full` | 9999px | Avatar circles, pill buttons |

### 2.5 Shadows & Elevation

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle separation |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Cards at rest |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | Cards on hover, dropdowns |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modals, floating panels |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | Login panel, hero elements |
| `--shadow-primary` | `0 4px 14px rgba(79,70,229,0.4)` | Primary button focus/active |

### 2.6 Transitions & Animations

```css
--transition-fast: 150ms ease;      /* Hover states, small interactions */
--transition-base: 250ms ease;      /* Page element transitions */
--transition-slow: 350ms ease;      /* Modal open/close, sidebar toggle */
--transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1); /* Bounce-in effects */
```

---

## 3. Component Specifications

### 3.1 Navigation — Sidebar

- **Width**: 260px expanded / 72px collapsed
- **Background**: `var(--gradient-sidebar)` — deep indigo gradient
- **Text**: `#FFFFFF` (active), `rgba(255,255,255,0.7)` (inactive)
- **Active item**: `rgba(255,255,255,0.15)` bg + left 3px accent border `#FFFFFF`
- **Logo area**: Top section, 64px height, brand mark + "Architect POS" text
- **Menu sections** (grouped by role):
  - **POS / Sales**: Bán hàng (POS Checkout)
  - **Products**: Quản lý mặt hàng (Catalog + Variants)
  - **Inventory**: Quản lý kho (Import/Export Slips, Stock Check)
  - **Profiles**: Hồ sơ đối tác (Customers, Suppliers)
  - **Warranty**: Xử lý bảo hành
  - **Reports**: Thống kê báo cáo (Revenue, Inventory, Debt)
  - **Staff** (Admin only): Quản lý tài khoản
  - **Settings**: Cài đặt hệ thống

### 3.2 Buttons

| Variant | Background | Text | Border | Hover | Active |
|---------|-----------|------|--------|-------|--------|
| **Primary** | `--primary-600` | `#FFFFFF` | none | `--primary-700` + shadow-primary | `--primary-800` |
| **Secondary** | `transparent` | `--primary-600` | 1.5px solid `--primary-600` | `--primary-50` bg | `--primary-100` bg |
| **Ghost** | `transparent` | `--neutral-600` | none | `--neutral-100` bg | `--neutral-200` bg |
| **Danger** | `--danger-500` | `#FFFFFF` | none | darken 10% | darken 15% |
| **Success** | `--success-500` | `#FFFFFF` | none | darken 10% | darken 15% |

- **Sizes**: `sm` (32px h), `md` (40px h), `lg` (48px h)
- **Padding**: `sm` 8px 16px, `md` 10px 20px, `lg` 14px 28px
- **Border radius**: `var(--radius-base)` (10px)
- **Min-width**: 120px for action buttons

### 3.3 Input Fields

- **Height**: 44px
- **Background**: `--neutral-0` (white)
- **Border**: 1.5px solid `--neutral-200`
- **Border radius**: `var(--radius-md)` (8px)
- **Focus state**: border `--primary-500`, ring `0 0 0 3px rgba(99,102,241,0.15)`
- **Error state**: border `--danger-500`, ring `0 0 0 3px rgba(239,68,68,0.15)`
- **Left icon**: 20px, color `--neutral-400`, padded left 12px
- **Placeholder**: `--neutral-300`, font-style italic

### 3.4 Data Tables

- **Header row**: `--neutral-50` bg, `--neutral-700` text, font-weight 600, uppercase 11px letter-spacing 0.05em
- **Body rows**: `--neutral-0` bg, `--neutral-600` text
- **Alternate rows**: `--neutral-50` bg
- **Row hover**: `--primary-50` bg with left 3px `--primary-500` accent border
- **Row height**: 52px
- **Cell padding**: 12px 16px
- **Borders**: bottom 1px solid `--neutral-100`
- **SKU/IMEI columns**: Use `JetBrains Mono` monospace font

### 3.5 Cards

- **Background**: `--neutral-0`
- **Border**: 1px solid `--neutral-100`
- **Border radius**: `var(--radius-lg)` (12px)
- **Padding**: 24px
- **Shadow**: `var(--shadow-sm)` at rest, `var(--shadow-md)` on hover
- **Transition**: `var(--transition-base)`

### 3.6 Stat Cards (Dashboard KPIs)

- **Layout**: Horizontal row of 4-5 cards
- **Icon container**: 48px circle, bg `--primary-50`, icon color `--primary-500`
- **Value**: 28px, font-weight 700, color `--neutral-800`
- **Label**: 12px, font-weight 500, color `--neutral-400`, uppercase
- **Trend indicator**: Green (↑) or Red (↓) with percentage

### 3.7 Modals / Dialogs

- **Backdrop**: `rgba(15,23,42,0.5)` with `backdrop-filter: blur(4px)`
- **Container**: max-width 560px, bg `--neutral-0`, radius `var(--radius-lg)`, shadow `var(--shadow-xl)`
- **Header**: 20px top padding, title H3, optional close (X) icon button
- **Body**: 24px padding, scrollable if content exceeds 400px
- **Footer**: 16px padding, right-aligned action buttons with 12px gap
- **Entry animation**: scale(0.95) → scale(1), opacity 0 → 1, `var(--transition-slow)`

### 3.8 Badges / Status Tags

| Status | Background | Text | Border |
|--------|-----------|------|--------|
| **Active / Còn hạn** | `--success-50` | `--success-500` | 1px solid `--success-500` at 20% |
| **Expired / Hết hạn** | `--danger-50` | `--danger-500` | 1px solid `--danger-500` at 20% |
| **Pending / Chờ xử lý** | `--warning-50` | `--warning-500` | 1px solid `--warning-500` at 20% |
| **Deactivated / Đã khóa** | `--neutral-100` | `--neutral-500` | 1px solid `--neutral-300` |
| **Processing** | `--info-50` | `--info-500` | 1px solid `--info-500` at 20% |

- **Padding**: 4px 10px
- **Border radius**: `var(--radius-full)` (pill shape)
- **Font**: 11px, weight 600, uppercase

### 3.9 Toast Notifications

- **Position**: Top-right, 24px from edges
- **Width**: 380px
- **Border radius**: `var(--radius-base)`
- **Slide-in animation**: translateX(100%) → translateX(0), `var(--transition-slow)`
- **Auto-dismiss**: 4 seconds
- **Types**: Success (green left border), Error (red), Warning (amber), Info (blue)

---

## 4. Screen Specifications

### 4.1 Login Screen (`/login`)
- **Layout**: Split 50/50 — Left panel (brand hero) + Right panel (login form)
- **Left panel**: `var(--gradient-hero)` background, brand logo top-left, large Vietnamese headline text (white, Inter ExtraBold 40px), subtext description, two feature badges at bottom (speed & security)
- **Right panel**: White background, centered form container (max-width 420px)
  - Title: "Đăng nhập hệ thống" — H2, `--neutral-800`
  - Fields: Username (with user icon), Password (with lock icon + show/hide toggle)
  - Remember me checkbox + "Quên mật khẩu?" link
  - Primary CTA button: "Đăng nhập" — full-width, `--primary-600`, 48px height, `--radius-base`
  - Register link: "Chưa có tài khoản? **Đăng ký ngay →**"
  - Footer links: Điều khoản | Bảo mật | Trợ giúp

### 4.2 Dashboard / Home (`/dashboard`)
- **Top bar**: Welcome message ("Xin chào, [Tên]"), today's date, notification bell icon
- **KPI row**: 4-5 stat cards — Doanh thu hôm nay, Đơn hàng, Sản phẩm tồn kho, Khách hàng mới, Công nợ NCC
- **Charts section**: Revenue line chart (7-day trend), Top selling products (horizontal bar), Category distribution (donut)
- **Recent activity**: Latest 5 orders table with status badges
- **Quick actions**: Floating action buttons for "Tạo đơn hàng", "Nhập kho", "Thêm sản phẩm"

### 4.3 POS Checkout (`/pos`)
- **Layout**: 3-column — Product search/catalog (left 35%), Cart/Order (center 40%), Payment summary (right 25%)
- **Product search**: Large search bar with barcode icon, category filter tabs, product grid with thumbnails
- **Cart table**: Product name, variant info (color/storage), unit price, quantity stepper, line total, remove button
- **Payment panel**: Subtotal, discount, VAT (10%), grand total (bold large), customer lookup (phone), loyalty points, payment method selector (Cash / QR / Card), action buttons
- **After payment**: Receipt preview modal with print button, "Tạo đơn mới" reset button

### 4.4 Product Management (`/products`)
- **List view**: Searchable data table with columns: SKU, Tên sản phẩm, Danh mục, Hãng SX, Giá bán, Tồn kho, Trạng thái
- **Add/Edit form** (`/products/new`, `/products/:id/edit`): Two-section layout
  - **Section 1 — General Info**: Tên, Danh mục (dropdown), Hãng SX, Thời gian bảo hành, Mô tả (textarea)
  - **Section 2 — Variants**: Toggle "Sản phẩm có nhiều biến thể"
    - Attribute builder: dynamic attribute name + values input
    - Variant table: auto-generated combinations with editable SKU, IMEI, Giá nhập, Giá bán per row
    - "Thêm biến thể" button for manual addition

### 4.5 Inventory Management (`/inventory`)
- **Sub-tabs**: Phiếu nhập kho | Phiếu xuất kho | Kiểm kê
- **Import slip form**: Supplier search → product search → quantity input → running total table → save
- **Export slip form**: Reason selector dropdown → supplier search → product search → quantity + defect notes → save
- **Slip list view**: Table with slip code, date, supplier name, total value, staff name, status

### 4.6 Profile Management (`/profiles`)
- **Sub-tabs**: Khách hàng | Nhà cung cấp
- **Customer list**: Name, Phone, Email, Member tier badge, Loyalty points, Purchase count
- **Supplier list**: Company name, Contact person, Phone, Address, Debt status indicator
- **Add/Edit form**: Modal or slide-over panel with field validation, duplicate checking

### 4.7 Warranty Processing (`/warranty`)
- **Search**: Phone number or IMEI/Serial lookup
- **Results table**: Invoice ID, Product name, Serial, Purchase date, Warranty expiry, Status badge
- **Detail view**: Full warranty conditions display, product physical condition checklist
- **Action panel**: "Đổi sản phẩm mới" or "Trả hàng hoàn tiền" options, new serial input, defect reason textarea

### 4.8 Reports & Statistics (`/reports`)
- **Sub-tabs**: Doanh thu | Tồn kho | Công nợ NCC
- **Revenue report**: Date range picker, summary KPIs, line/bar charts, drill-down to daily invoices
- **Inventory report**: Filter (All / Low stock / Long-standing), product table with stock levels
- **Debt report**: Supplier debt summary table, click-through to detailed payment history

### 4.9 Staff Account Management (`/staff`) — Admin only
- **Account list**: Name, Username, Role badge, Status (Active/Locked), Last login
- **Actions**: Add account, Edit info, Assign role (dropdown), Reset password (modal), Deactivate (confirm dialog)

---

## 5. Interaction Patterns

### 5.1 Search Behavior
- **Debounced input**: 300ms delay after typing stops
- **Minimum characters**: 2 characters before triggering search
- **Loading state**: Skeleton rows or spinner inside the results area
- **Empty state**: Illustration + "Không tìm thấy kết quả" message + suggestion to refine

### 5.2 Form Validation
- **Real-time**: Validate on blur for each field
- **Submit-time**: Full form validation with error summary at top
- **Error display**: Red border + inline error message below field
- **Required fields**: Asterisk (*) indicator on label

### 5.3 Destructive Actions (Delete / Deactivate)
- **Always require confirmation** via modal dialog
- **Soft delete**: Products with transaction history → status "Ngừng kinh doanh"
- **Hard delete**: Products without any transactions → permanent removal
- **Staff accounts**: Never hard-deleted, only deactivated to preserve audit trail

### 5.4 Data Loading
- **Skeleton screens** for initial page loads
- **Optimistic updates** for cart additions in POS
- **Polling/WebSocket** for real-time stock updates across multiple POS terminals
- **Pagination**: Server-side, 20 rows per page default, with page size selector

### 5.5 Responsive Considerations
- **Primary target**: Desktop (1280px+), multiple POS terminals
- **Breakpoints**: 1024px (compact sidebar), 1280px (full layout), 1440px+ (wide dashboard)
- **POS screen**: Optimized for 1920×1080 displays (full-screen mode available)

---

## 6. Iconography

- **Icon library**: Lucide Icons (consistent line weight, 1.5px stroke)
- **Size tokens**: 16px (inline), 20px (input prefix/suffix), 24px (navigation), 32px (stat cards), 48px (empty states)
- **Color**: Inherits from parent text color; active state uses `--primary-500`

### Key Icon Mapping
| Function | Icon Name |
|----------|-----------|
| Dashboard | `LayoutDashboard` |
| POS / Sales | `ShoppingCart` |
| Products | `Package` |
| Inventory | `Warehouse` |
| Import Slip | `PackagePlus` |
| Export Slip | `PackageMinus` |
| Customers | `Users` |
| Suppliers | `Truck` |
| Warranty | `ShieldCheck` |
| Reports | `BarChart3` |
| Revenue | `TrendingUp` |
| Staff / Accounts | `UserCog` |
| Settings | `Settings` |
| Search | `Search` |
| Add / Create | `Plus` |
| Edit | `Pencil` |
| Delete | `Trash2` |
| Save | `Save` |
| Print | `Printer` |
| Logout | `LogOut` |

---

## 7. Data Entity Reference

### Core Entities
```
Store          → Thông tin cửa hàng
Staff          → Nhân viên (Admin / Manager / Cashier)
Product        → Mặt hàng (thông tin chung)
Variant        → Biến thể sản phẩm (SKU, IMEI, giá, tồn kho)
Customer       → Khách hàng (tích điểm, bảo hành)
Supplier       → Nhà cung cấp
Order          → Đơn hàng / Hóa đơn bán lẻ
SaleDetail     → Chi tiết hóa đơn (Order ↔ Variant, n-n)
ImportReceipt  → Phiếu nhập kho
ImportDetail   → Chi tiết phiếu nhập (ImportReceipt ↔ Variant, n-n)
ExportReceipt  → Phiếu xuất kho
ExportDetail   → Chi tiết phiếu xuất (ExportReceipt ↔ Variant, n-n)
WarrantyClaim  → Yêu cầu bảo hành / Đổi trả
```

### Key Relationships
- Product `1 → n` Variant
- Staff `1 → n` Order / ImportReceipt / ExportReceipt
- Customer `1 → n` Order
- Supplier `1 → n` ImportReceipt / ExportReceipt
- Order `n ↔ n` Variant (via SaleDetail)
- SaleDetail `1 → n` WarrantyClaim

---

## 8. Accessibility & Localization

- **Language**: Vietnamese (vi-VN) as primary UI language
- **Number format**: `1.234.567` (dot thousands separator), currency suffix `đ` or `VNĐ`
- **Date format**: `DD/MM/YYYY` (Vietnamese standard)
- **Keyboard navigation**: Full tab-order support for POS screen (cashier efficiency)
- **Color contrast**: All text meets WCAG 2.1 AA (4.5:1 minimum)
- **Focus indicators**: Visible focus rings on all interactive elements (3px `--primary-500` ring)
