-- =============================================
-- DIQQAT: Bu faylni Supabase SQL Editor'ga ko'chiring
-- https://rrbxquwfvcpodhhkjocj.supabase.co
-- =============================================

-- 1. Avval eski jadvallarni o'chiramiz (agar xato bo'lsa)
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- 2. PRODUCTS jadvali (foreign key yo'q, sodda)
CREATE TABLE products (
  id             BIGINT PRIMARY KEY,
  name           TEXT NOT NULL,
  image          TEXT,
  rating         NUMERIC(3,1) DEFAULT 0,
  reviews        INTEGER DEFAULT 0,
  original_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  sale_price     NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount       INTEGER DEFAULT 0,
  badge          TEXT,
  colors         TEXT,
  in_stock       BOOLEAN DEFAULT true,
  description    TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CART_ITEMS jadvali (product_id foreign key YO'Q - sodda)
CREATE TABLE cart_items (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL,
  product_id  BIGINT NOT NULL,
  product_name TEXT,
  product_image TEXT,
  sale_price  NUMERIC(10,2),
  quantity    INTEGER NOT NULL DEFAULT 1,
  added_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5. WISHLIST_ITEMS jadvali
CREATE TABLE wishlist_items (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL,
  product_id  BIGINT NOT NULL,
  added_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS jadvali
CREATE TABLE orders (
  id               TEXT PRIMARY KEY,
  user_id          UUID,
  total_amount     NUMERIC(10,2) NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'Pending',
  customer_name    TEXT,
  customer_email   TEXT,
  customer_address TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDER_ITEMS jadvali
CREATE TABLE order_items (
  id            BIGSERIAL PRIMARY KEY,
  order_id      TEXT NOT NULL,
  product_id    BIGINT,
  product_name  TEXT NOT NULL,
  product_image TEXT,
  quantity      INTEGER NOT NULL,
  sale_price    NUMERIC(10,2) NOT NULL
);

-- 6. RLS yoqish
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
-- Products: hamma ko'ra oladi
CREATE POLICY "products_select_all" ON products
  FOR SELECT USING (true);

CREATE POLICY "products_insert_all" ON products
  FOR INSERT WITH CHECK (true);

-- Cart: hamma o'qiy va yoza oladi (auth kerak emas - test uchun)
CREATE POLICY "cart_all_access" ON cart_items
  FOR ALL USING (true) WITH CHECK (true);

-- Wishlist: hamma o'qiy va yoza oladi
CREATE POLICY "wishlist_all_access" ON wishlist_items
  FOR ALL USING (true) WITH CHECK (true);

-- Orders: hamma o'qiy va yoza oladi
CREATE POLICY "orders_all_access" ON orders
  FOR ALL USING (true) WITH CHECK (true);

-- Order items: hamma o'qiy va yoza oladi
CREATE POLICY "order_items_all_access" ON order_items
  FOR ALL USING (true) WITH CHECK (true);

-- 8. Namuna mahsulotlarni qo'shish
INSERT INTO products (id, name, image, rating, reviews, original_price, sale_price, discount, colors, in_stock, description) VALUES
(1, 'VISION® – 147 DAYTONA Hyper Silver', '/product_wheel.png', 5, 1, 254.00, 209.00, 18, '#e5e7eb,#B8860B,#1a1a1a', true, 'Premium hyper silver wheel'),
(2, 'Thinkware F770 Dash Cam Dual Channel Wifi', '/product_dashcam.png', 3, 1, 268.99, 249.99, 8, '#1f2937,#374151', true, '1080p Sony Exmor CMOS sensor'),
(3, 'Technaxx car Alarm with Charging Function', '/product_alarm.png', 5, 1, 51.99, 47.99, 0, '#1f2937', true, '2-in-1 car alarm and USB charger'),
(4, 'Spyder® – Projector Headlights', '/product_headlights.png', 5, 1, 582.99, 521.89, 11, '#9ca3af,#d1d5db', true, 'Premium projector headlights'),
(5, 'Spec-D® – Projector Headlights', '/product_headlights.png', 4, 1, 364.86, 279.02, 24, '#6b7280,#1f2937', true, 'Aftermarket projector headlights'),
(6, 'SnowyFox RV 15Amp to 50Amp Adapter', '/product_adapter.png', 5, 1, 25.98, 23.88, 0, '#f59e0b', true, 'Heavy-duty RV adapter'),
(7, 'Shell Rotella T1 SAE 30 Heavy Duty', '/product_dashcam.png', 5, 1, 24.85, 17.85, 29, '#dc2626,#fbbf24', true, 'Premium diesel engine oil'),
(8, 'Schumacher 125 Chrome Fan 12V', '/product_wheel.png', 4, 1, 45.99, 30.54, 34, '#9ca3af', true, '12V oscillating chrome fan');
