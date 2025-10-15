// API Configuration
export const API_CONFIG = {
  SERVER_URL: process.env.REACT_APP_SERVER_URL || "http://localhost:8000",
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://8009-35-203-188-47.ngrok-free.app',
  ENDPOINTS: {
    CHARACTERS: '/api/characters',
    CHARACTER_BY_ID: (id) => `/api/characters/${id}`,
    LOGIN: '/api/users/login',
    TEXT_TO_VIDEO: '/text-to-video/',
    CHARACTER_CHAT: '/character/',
  }
};

// UI Constants
export const UI_CONFIG = {
  COLORS: {
    PRIMARY: '#0079D3',
    SECONDARY: '#4caf50',
    BACKGROUND: '#343541',
    SURFACE: '#525251',
    TEXT_PRIMARY: '#EEE4DA',
    TEXT_SECONDARY: '#ccc',
    WHITE: '#fff',
    BLACK: '#000',
    GRAY: '#ccc',
    LIGHT_GRAY: '#f0f0f0',
    DARK_GRAY: '#888',
    RED: '#f44336',
    BLUE: '#2196F3',
  },
  SPACING: {
    XS: '4px',
    SM: '8px',
    MD: '16px',
    LG: '24px',
    XL: '32px',
    XXL: '48px',
  },
  BORDER_RADIUS: {
    SM: '4px',
    MD: '8px',
    LG: '12px',
    XL: '16px',
    ROUND: '50%',
  },
  SHADOWS: {
    SM: '0 2px 4px rgba(0, 0, 0, 0.1)',
    MD: '0 4px 8px rgba(0, 0, 0, 0.1)',
    LG: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  BREAKPOINTS: {
    MOBILE: '768px',
    TABLET: '1024px',
    DESKTOP: '1200px',
  }
};

// Character Configuration
export const CHARACTER_CONFIG = {
  DEFAULT_PRICE: 490700,
  CURRENCY: 'VND',
  LOCALE: 'vi-VN',
};

// Payment Methods
export const PAYMENT_METHODS = [
  {
    id: 1,
    name: 'ShopeePay',
    img: 'https://cdn.garenanow.com/webmain/static/payment_center/vn/menu/vnshopeepay_pc.png'
  },
  {
    id: 2,
    name: 'MasterCard',
    img: 'https://www.mastercard.com.vn/content/dam/mccom/global/logos/logo-mastercard-mobile.svg'
  },
  {
    id: 3,
    name: 'Viettel',
    img: 'https://cdn-gop-garenanow-com.obs.myhuaweicloud.com/cdn.garenanow.com/webmain/static/payment_center/vn/menu/VT-SMS.png'
  },
  {
    id: 4,
    name: 'Mobifone',
    img: 'https://cdn-gop-garenanow-com.obs.myhuaweicloud.com/cdn.garenanow.com/webmain/static/payment_center/vn/menu/Mobifone-SMS.png'
  },
  {
    id: 5,
    name: 'ZaloPay',
    img: 'https://dms.inet.vn/uploads/public/2021/06/03/1622682588188_zalopay.png'
  },
  {
    id: 6,
    name: 'ATM',
    img: 'https://cdn-gop.garenanow.com/webmain/static/payment_center/vn/menu/vn_new_atm_140x87.png'
  }
];

// Form Types
export const FORM_TYPES = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER"
};
