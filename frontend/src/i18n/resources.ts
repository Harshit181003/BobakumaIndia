/** Base English copy — other locales fall back via i18next then merge overrides where added. */
export const en = {
  nav: {
    home: "Home",
    products: "Shop",
    cart: "Cart",
    wishlist: "Wishlist",
    orders: "Orders",
    account: "Account",
    admin: "Admin",
    login: "Login",
    register: "Register",
    logout: "Logout",
    offers: "Offers"
  },
  home: {
    offerTitle: "Spring sparkle sale",
    offerBody: "Use code WELCOME10 on your first cute lunchbox haul.",
    featured: "Featured lunchboxes",
    gallery: "Soft tones, real life",
    testimonials: "Loved by families",
    newsletterTitle: "Newsletter",
    newsletterHint: "Pastel drops, restocks, and secret coupons.",
    newsletterPlaceholder: "you@email.com",
    subscribe: "Subscribe"
  },
  products: {
    title: "Shop lunchboxes",
    search: "Search",
    filters: "Filters",
    category: "Category",
    material: "Material",
    color: "Color",
    price: "Price (₹)",
    sort: "Sort",
    all: "All",
    kids: "Kids",
    office: "Office",
    addToCart: "Add to cart",
    addToWishlist: "Wishlist",
    reviews: "Reviews",
    related: "You may also like",
    inStock: "In stock",
    outStock: "Out of stock"
  },
  cart: {
    title: "Your cart",
    empty: "Your cart is empty (but your lunch could be cute).",
    checkout: "Checkout",
    subtotal: "Subtotal"
  },
  checkout: {
    title: "Checkout",
    coupon: "Coupon code",
    placeOrder: "Place order & pay",
    shipping: "Shipping details"
  },
  auth: {
    email: "Email",
    password: "Password",
    name: "Name"
  },
  chat: {
    open: "Help",
    title: "Bobakuma helper",
    placeholder: "Ask about shipping, materials…",
    send: "Send"
  }
} as const;

const hi = {
  ...en,
  nav: { ...en.nav, home: "होम", products: "दुकान", cart: "कार्ट", login: "लॉग इन", register: "रजिस्टर" },
  home: {
    ...en.home,
    offerTitle: "वसंत ऑफर",
    offerBody: "अपनी पहली लंचबॉक्स खरीद पर WELCOME10 इस्तेमाल करें।"
  }
} as const;

export const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: en },
  gu: { translation: en },
  ta: { translation: en },
  te: { translation: en },
  bn: { translation: en },
  pa: { translation: en },
  es: { translation: en },
  fr: { translation: en },
  de: { translation: en },
  ja: { translation: en }
} as const;

export const locales = ["en", "hi", "mr", "gu", "ta", "te", "bn", "pa", "es", "fr", "de", "ja"] as const;
