export interface Product {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  originalPrice: number;
  salePrice: number;
  discount: number;
  badge?: string;
  colors: string[];
  inStock: boolean;
  description?: string;
  category?: string;
  date?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'VISION® – 147 DAYTONA Hyper Silver',
    image: '/product_wheel.png',
    rating: 5,
    reviews: 1,
    originalPrice: 254.0,
    salePrice: 209.0,
    discount: 18,
    colors: ['#e5e7eb', '#B8860B', '#1a1a1a'],
    inStock: true,
    description: 'The VISION 147 DAYTONA is a premium hyper silver wheel that combines aggressive styling with exceptional durability. Engineered for high performance and perfect fitment on a variety of vehicles.',
  },
  {
    id: 2,
    name: 'Thinkware F770 Dash Cam Dual Channel Wifi',
    image: '/product_dashcam.png',
    rating: 3,
    reviews: 1,
    originalPrice: 268.99,
    salePrice: 249.99,
    discount: 8,
    colors: ['#1f2937', '#374151'],
    inStock: true,
    description: 'Equipped with a 1080p Sony Exmor CMOS sensor, the Thinkware F770 delivers crisp and detailed footage. Features built-in Wi-Fi, Super Night Vision, and Time Lapse recording for maximum security.',
  },
  {
    id: 3,
    name: 'Technaxx car Alarm with Charging Function',
    image: '/product_alarm.png',
    rating: 5,
    reviews: 1,
    originalPrice: 51.99,
    salePrice: 47.99,
    discount: 0,
    badge: 'SUPER PRICE',
    colors: ['#1f2937'],
    inStock: true,
    description: 'A 2-in-1 solution offering a loud 110dB car alarm and dual USB charging ports. Plugs directly into your 12V socket, providing peace of mind and keeping your devices powered.',
  },
  {
    id: 4,
    name: 'Spyder® – Projector Headlights',
    image: '/product_headlights.png',
    rating: 5,
    reviews: 1,
    originalPrice: 582.99,
    salePrice: 521.89,
    discount: 11,
    colors: ['#9ca3af', '#d1d5db'],
    inStock: true,
    description: 'Upgrade your vehicle\'s lighting with these premium projector headlights from Spyder. Featuring advanced optics for improved visibility and a sleek, modern look that transforms your front end.',
  },
  {
    id: 5,
    name: 'Spec-D® – Projector Headlights',
    image: '/product_headlights.png',
    rating: 4,
    reviews: 1,
    originalPrice: 364.86,
    salePrice: 279.02,
    discount: 24,
    colors: ['#6b7280', '#1f2937'],
    inStock: true,
    description: 'High-quality aftermarket projector headlights by Spec-D Tuning. Designed for easy plug-and-play installation, providing a brighter, more focused beam pattern for safer night driving.',
  },
  {
    id: 6,
    name: 'SnowyFox RV 15Amp to 50Amp Adapter – 15Male',
    image: '/product_adapter.png',
    rating: 5,
    reviews: 1,
    originalPrice: 25.98,
    salePrice: 23.88,
    discount: 0,
    badge: 'TOP PRODUCT',
    colors: ['#f59e0b'],
    inStock: true,
    description: 'Heavy-duty dogbone electrical adapter for RVs. Converts a standard 15A household receptacle to a 50A RV connection. Made with 100% copper wiring and a durable PVC jacket.',
  },
  {
    id: 7,
    name: 'Shell Rotella T1 SAE 30 Conventional Heavy Duty',
    image: '/product_dashcam.png',
    rating: 5,
    reviews: 1,
    originalPrice: 24.85,
    salePrice: 17.85,
    discount: 29,
    colors: ['#dc2626', '#fbbf24'],
    inStock: true,
    description: 'Premium heavy-duty engine oil designed to provide excellent protection and performance for diesel engines. Formulated with advanced additives to reduce wear and maintain engine cleanliness.',
  },
  {
    id: 8,
    name: 'Schumacher 125 Chrome Fan 12V',
    image: '/product_wheel.png',
    rating: 4,
    reviews: 1,
    originalPrice: 45.99,
    salePrice: 30.54,
    discount: 34,
    colors: ['#9ca3af'],
    inStock: true,
    description: 'Keep cool on the road with this 12V oscillating chrome fan. Plugs directly into your cigarette lighter and features a durable metal cage and adjustable mounting options.',
  },
];
