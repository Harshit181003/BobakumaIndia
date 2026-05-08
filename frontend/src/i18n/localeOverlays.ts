import { mergeDeep, type DeepPartial } from "./merge";

/** Stronger Hindi copy (full page chrome). */
export const hiOverlay = {
  nav: {
    home: "होम",
    products: "शॉप",
    shirts: "टी-शर्ट",
    lunchboxes: "लंचबॉक्स",
    cart: "कार्ट",
    wishlist: "विशलिस्ट",
    orders: "ऑर्डर",
    account: "खाता",
    admin: "एडमिन",
    login: "लॉग इन",
    register: "रजिस्टर",
    logout: "लॉग आउट",
    offers: "ऑफ़र"
  },
  home: {
    offerTitle: "वसंत ऑफ़र",
    offerBody: "अपनी पहली लंचबॉक्स खरीद पर WELCOME10 इस्तेमाल करें।",
    featured: "फ़ीचर्ड लंचबॉक्स",
    featuredShirts: "फ़ीचर्ड टी-शर्ट",
    gallery: "नरम रंग, असली ज़िंदगी",
    testimonials: "परिवारों की पसंद",
    newsletterTitle: "न्यूज़लेटर",
    newsletterHint: "नए रंग, रीस्टॉक और छुपे कूपन।",
    newsletterPlaceholder: "you@email.com",
    subscribe: "सब्सक्राइब",
    newsletterSuccess: "आप जुड़ गए — जल्द ही अपडेट मिलेगा।",
    newsletterError: "सब्सक्राइब नहीं हो सका — बाद में कोशिश करें।",
    rangeLabel: "हमारी रेंज",
    pickVibe: "अपनी पसंद चुनें",
    viewAll: "सभी देखें →",
    everySize: "हर साइज़",
    forEveryNeed: "हर ज़रूरत के लिए",
    seeSizes: "साइज़ देखें →",
    explore: "एक्सप्लोर +",
    heroBadge: "सफ़ेद, पिस्ता और रंगीन एक्सेंट — Bobakuma वाइब।",
    heroTitle: "लंचबॉक्स जो हर दिन छोटा-सा गिफ़्ट जैसा लगे।",
    heroBody:
      "स्टैक करने वाले बेंटो, नरम स्ट्रैप और क्यूट डिटेल्स। स्कूल, ऑफ़िस और गिफ़्टिंग के लिए।",
    shopCta: "लंचबॉक्स देखें",
    cuteCta: "क्यूट कलेक्शन",
    mixMatch: "मिक्स और मैच",
    buildSet: "अपना सेट बनाएँ",
    buildSetBody: "स्ट्रैप, प्रिंट और साइज़ चुनें जो आप जैसे हों।",
    tryNow: "अभी देखें",
    corpGift: "कॉर्पोरेट गिफ़्ट",
    giftBoxes: "गिफ़्ट बॉक्स",
    giftBoxesBody: "ऐसे लंचबॉक्स जो हर डेस्क पर अच्छे लगें।",
    exploreBtn: "एक्सप्लोर",
    communityTag: "#Bobakuma",
    communityTitle: "कम्युनिटी",
    communityBody: "असली लंच, रंग और डेस्क सेटअप देखें।",
    viewPosts: "पोस्ट देखें",
    shirtsSectionTitle: "ग्राफ़िक टी-शर्ट",
    shirtsSectionSub: "लंचबॉक्स से मैच करने वाले प्रिंट और पेस्टल टोन।",
    shopShirts: "शर्ट देखें",
    heroCardTitle: "टू-टियर बेंटो",
    heroCardSub: "पिस्ता स्ट्रैप • लीक-अवेयर सील",
    heroCardFrom: "₹899 से",
    colOriginal: "ओरिजिनल",
    colOriginalSub: "साफ़ और मिनिमल",
    colPositive: "पॉज़िटिव",
    colPositiveSub: "नरम टोन",
    colGraphic: "ग्राफ़िक",
    colGraphicSub: "मज़ेदार प्रिंट",
    colKids: "बच्चे",
    colKidsSub: "क्यूट और मज़बूत",
    colShirts: "टी-शर्ट",
    colShirtsSub: "कॉटन ग्राफ़िक टी",
    colAccessories: "एक्सेसरीज़",
    colAccessoriesSub: "कटलरी और एक्स्ट्रा",
    sizeSnacks: "छोटा नाश्ता",
    sizeLight: "हल्का लंच",
    sizeDaily: "रोज़ाना भोजन",
    sizeBig: "बड़ी भूख",
    sizeFamily: "फ़ैमिली शेयर",
    sizeMealprep: "मील प्रेप"
  },
  products: {
    title: "लंचबॉक्स और शर्ट शॉप करें",
    subtitle: "नरम पेस्टल, प्रीमियम मटीरियल, खुशहाल लंच।",
    search: "खोजें",
    filters: "फ़िल्टर",
    category: "श्रेणी",
    material: "मटीरियल",
    color: "रंग",
    price: "कीमत (₹)",
    sort: "क्रम",
    all: "सभी",
    allCategories: "सभी श्रेणियाँ",
    kids: "बच्चे",
    office: "ऑफ़िस",
    shirts: "टी-शर्ट / शर्ट",
    addToCart: "कार्ट में डालें",
    addToWishlist: "विशलिस्ट",
    reviews: "रिव्यू",
    related: "आपको यह भी पसंद आ सकता है",
    inStock: "स्टॉक में",
    outStock: "ख़त्म",
    apply: "लागू करें",
    sortNewest: "नवीनतम",
    sortPriceAsc: "कीमत ↑",
    sortPriceDesc: "कीमत ↓",
    sortRating: "रेटिंग",
    minInr: "न्यूनतम ₹",
    maxInr: "अधिकतम ₹",
    showing: "दिखा रहे हैं {{shown}} / {{total}} · पृष्ठ {{page}}",
    compareRegion: "तुलना (छूट के बाद)",
    reviewsCount: "रिव्यू",
    checkoutChargesPrefix: "चेकआउट शुल्क",
    checkoutChargesSuffix: "Razorpay (INR) के माध्यम से लिया जाएगा।",
    noReviewsYet: "अभी कोई रिव्यू नहीं — आप पहले लिखें।",
    capacity: "क्षमता"
  },
  auth: {
    welcomeBack: "वापसी पर स्वागत है",
    email: "ईमेल",
    password: "पासवर्ड",
    name: "नाम",
    newHere: "नए हैं?",
    createAccount: "खाता बनाएँ",
    createTitle: "अपना Bobakuma खाता बनाएँ",
    passwordMin: "पासवर्ड (कम से कम 8 अक्षर)",
    haveAccount: "पहले से खाता है?",
    emailInUse: "यह ईमेल पहले से रजिस्टर्ड है।",
    invalidInput: "कृपया ईमेल और पासवर्ड जाँचें।",
    networkError: "सर्वर से कनेक्ट नहीं हो सका — API URL / नेटवर्क जाँचें।",
    loginFailed: "ईमेल या पासवर्ड गलत है।",
    registerFailed: "खाता नहीं बन सका — फिर कोशिश करें।",
    accountDisabled: "यह खाता निष्क्रिय है।"
  },
  chat: {
    open: "मदद",
    title: "Bobakuma सहायक",
    placeholder: "शिपिंग, मटीरियल…",
    send: "भेजें"
  },
  cart: {
    title: "आपकी कार्ट",
    empty: "कार्ट खाली है (पर लंच क्यूट हो सकता है)।",
    checkout: "चेकआउट",
    subtotal: "उप-योग"
  },
  checkout: {
    title: "चेकआउट",
    coupon: "कूपन कोड",
    placeOrder: "ऑर्डर करें और भुगतान करें",
    shipping: "शिपिंग विवरण"
  }
} as const satisfies DeepPartial<Record<string, unknown>>;

function navEsFrDeJa(
  home: string,
  shop: string,
  shirts: string,
  cart: string,
  wish: string,
  orders: string,
  login: string,
  reg: string
) {
  return { home, products: shop, shirts, lunchboxes: shop, cart, wishlist: wish, orders, account: "Account", admin: "Admin", login, register: reg, logout: "Logout", offers: "Offers" };
}

/** Marathi — full nav + product chrome */
export const mrOverlay = {
  nav: navEsFrDeJa("मुखपृष्ठ", "लंचबॉक्स", "टी-शर्ट", "कार्ट", "विशलिस्ट", "ऑर्डर", "लॉग इन", "नोंदणी"),
  home: {
    featured: "वैशिष्ट्यीकृत लंचबॉक्स",
    featuredShirts: "वैशिष्ट्यीकृत टी-शर्ट",
    offerTitle: "वसंत ऑफर",
    offerBody: "पहिल्या खरेदीवर WELCOME10 वापरा.",
    gallery: "मऊ रंग",
    testimonials: "कुटुंबांना आवडते",
    newsletterTitle: "न्यूजलेटर",
    newsletterHint: "अपडेट्स आणि कूपन.",
    newsletterPlaceholder: "you@email.com",
    subscribe: "सबस्क्राइब",
    newsletterSuccess: "नोंदणी झाली.",
    newsletterError: "अयशस्वी — नंतर प्रयत्न करा.",
    rangeLabel: "आमची रेंज",
    pickVibe: "स्टाइल निवडा",
    viewAll: "सर्व पहा →",
    heroTitle: "दररोज एक छोटेसे गिफ्ट सारखे लंचबॉक्स.",
    heroBody: "स्कूल, ऑफिस आणि भेटवस्तूसाठी.",
    shopCta: "खरेदी करा",
    shirtsSectionTitle: "ग्राफिक टी-शर्ट",
    shirtsSectionSub: "लंचबॉक्सशी जुळणारे प्रिंट.",
    shopShirts: "शर्ट पहा"
  },
  products: {
    title: "लंचबॉक्स आणि शर्ट",
    subtitle: "प्रीमियम साहित्य, मऊ रंग.",
    allCategories: "सर्व श्रेणी",
    kids: "मुले",
    office: "ऑफिस",
    shirts: "टी-शर्ट",
    apply: "लागू",
    sortNewest: "नवीन",
    sortPriceAsc: "किंमत ↑",
    sortPriceDesc: "किंमत ↓",
    sortRating: "रेटिंग",
    minInr: "किमान ₹",
    maxInr: "कमाल ₹",
    showing: "{{shown}} / {{total}} · पृष्ठ {{page}}",
    compareRegion: "तुलना",
    reviewsCount: "पुनरावलोकने",
    search: "शोधा",
    material: "साहित्य",
    color: "रंग"
  },
  auth: {
    emailInUse: "ईमेल आधीच नोंदणीकृत आहे.",
    invalidInput: "इनपुट तपासा.",
    networkError: "जोडणी अयशस्वी.",
    loginFailed: "चुकीचे क्रेडेन्शियल्स."
  }
} as const satisfies DeepPartial<Record<string, unknown>>;

export const guOverlay = {
  nav: navEsFrDeJa("હોમ", "લંચબોક્સ", "ટી-શર્ટ", "કાર્ટ", "વિશલિસ્ટ", "ઓર્ડર", "લૉગિન", "નોંધણી"),
  home: {
    featured: "ફીચર્ડ લંચબોક્સ",
    featuredShirts: "ફીચર્ડ ટી-શર્ટ",
    offerTitle: "વસંત ઓફર",
    offerBody: "પ્રથમ ખરીદી પર WELCOME10.",
    newsletterSuccess: "તમે જોડાયા.",
    newsletterError: "નિષ્ફળ — ફરી પ્રયાસ કરો.",
    heroTitle: "રોજ નાની ભેટ જેવા લંચબોક્સ.",
    shopCta: "ખરીદો",
    shirtsSectionTitle: "ગ્રાફિક ટી-શર્ટ",
    shopShirts: "શર્ટ જુઓ"
  },
  products: {
    title: "લંચબોક્સ અને શર્ટ",
    subtitle: "પ્રીમિયમ સામગ્રી.",
    shirts: "ટી-શર્ટ",
    allCategories: "બધી શ્રેણી",
    apply: "લાગુ",
    showing: "{{shown}} / {{total}} · પૃષ્ઠ {{page}}",
    search: "શોધો",
    material: "સામગ્રી",
    color: "રંગ",
    kids: "બાળકો",
    office: "ઓફિસ"
  },
  auth: {
    emailInUse: "આ ઈમેલ પહેલેથી છે.",
    networkError: "સર્વર સાથે જોડાણ નિષ્ફળ.",
    loginFailed: "ખોટું ઈમેલ અથવા પાસવર્ડ."
  }
} as const satisfies DeepPartial<Record<string, unknown>>;

export const taOverlay = {
  nav: navEsFrDeJa("முகப்பு", "லஞ்ச் பாக்ஸ்", "டி-சர்ட்", "கார்ட்", "விஷ்லிஸ்ட்", "ஆர்டர்கள்", "உள்நுழை", "பதிவு"),
  home: {
    featured: "சிறப்பு லஞ்ச் பாக்ஸ்",
    featuredShirts: "சிறப்பு டி-சர்ட்",
    newsletterSuccess: "சேர்ந்தீர்கள்.",
    newsletterError: "தோல்வி — பின்னர் முயலவும்.",
    heroTitle: "தினமும் ஒரு சிறிய பரிசு போன்ற லஞ்ச் பாக்ஸ்.",
    shopCta: "கடை",
    shirtsSectionTitle: "கிராஃபிக் டி-சர்ட்",
    shopShirts: "சர்ட் பார்க்க"
  },
  products: {
    title: "லஞ்ச் பாக்ஸ் & சர்ட்",
    subtitle: "பிரீமியம் பொருள்.",
    shirts: "டி-சர்ட்",
    allCategories: "அனைத்து வகைகள்",
    apply: "பயன்படுத்து",
    showing: "{{shown}} / {{total}} · பக்கம் {{page}}",
    search: "தேடு",
    material: "பொருள்",
    color: "நிறம்",
    kids: "குழந்தைகள்",
    office: "அலுவலகம்"
  },
  auth: {
    emailInUse: "இந்த மின்னஞ்சல் ஏற்கனவே உள்ளது.",
    networkError: "இணைப்பு தோல்வி.",
    loginFailed: "தவறான உள்நுழைவு."
  }
} as const satisfies DeepPartial<Record<string, unknown>>;

export const teOverlay = {
  nav: navEsFrDeJa("హోమ్", "లంచ్ బాక్స్", "టీ-షర్ట్", "కార్ట్", "విష్‌లిస్ట్", "ఆర్డర్లు", "లాగిన్", "నమోదు"),
  home: {
    featured: "ఫీచర్డ్ లంచ్ బాక్స్",
    featuredShirts: "ఫీచర్డ్ టీ-షర్ట్",
    newsletterSuccess: "చేరారు.",
    newsletterError: "విఫలమైంది.",
    heroTitle: "ప్రతిరోజూ చిన్న బహుమతి లాంటి లంచ్ బాక్స్.",
    shopCta: "షాప్",
    shirtsSectionTitle: "గ్రాఫిక్ టీ-షర్ట్",
    shopShirts: "షర్ట్ చూడండి"
  },
  products: {
    title: "లంచ్ బాక్స్ & షర్ట్",
    subtitle: "ప్రీమియం మెటీరియల్.",
    shirts: "టీ-షర్ట్",
    allCategories: "అన్ని వర్గాలు",
    apply: "వర్తింపజేయి",
    showing: "{{shown}} / {{total}} · పేజీ {{page}}",
    search: "వెతకండి",
    material: "మెటీరియల్",
    color: "రంగు",
    kids: "పిల్లలు",
    office: "ఆఫీస్"
  },
  auth: {
    emailInUse: "ఇమెయిల్ ఇప్పటికే ఉంది.",
    networkError: "కనెక్షన్ విఫలం.",
    loginFailed: "తప్పు లాగిన్."
  }
} as const satisfies DeepPartial<Record<string, unknown>>;

export const bnOverlay = {
  nav: navEsFrDeJa("হোম", "লাঞ্চবক্স", "টি-শার্ট", "কার্ট", "উইশলিস্ট", "অর্ডার", "লগইন", "নিবন্ধন"),
  home: {
    featured: "ফিচার্ড লাঞ্চবক্স",
    featuredShirts: "ফিচার্ড টি-শার্ট",
    newsletterSuccess: "যুক্ত হয়েছেন.",
    newsletterError: "ব্যর্থ.",
    heroTitle: "প্রতিদিন একটি ছোট উপহারের মতো লাঞ্চবক্স.",
    shopCta: "কেনাকাটা",
    shirtsSectionTitle: "গ্রাফিক টি-শার্ট",
    shopShirts: "শার্ট দেখুন"
  },
  products: {
    title: "লাঞ্চবক্স ও শার্ট",
    subtitle: "প্রিমিয়াম উপাদান.",
    shirts: "টি-শার্ট",
    allCategories: "সব বিভাগ",
    apply: "প্রয়োগ",
    showing: "{{shown}} / {{total}} · পৃষ্ঠা {{page}}",
    search: "খুঁজুন",
    material: "উপাদান",
    color: "রঙ",
    kids: "শিশু",
    office: "অফিস"
  },
  auth: {
    emailInUse: "ইমেইল আগে থেকেই আছে.",
    networkError: "সংযোগ ব্যর্থ.",
    loginFailed: "ভুল লগইন."
  }
} as const satisfies DeepPartial<Record<string, unknown>>;

export const paOverlay = {
  nav: navEsFrDeJa("ਹੋਮ", "ਲੰਚਬਾਕਸ", "ਟੀ-ਸ਼ਰਟ", "ਕਾਰਟ", "ਵਿਸ਼ਲਿਸਟ", "ਆਰਡਰ", "ਲਾਗਇਨ", "ਰਜਿਸਟਰ"),
  home: {
    featured: "ਫੀਚਰਡ ਲੰਚਬਾਕਸ",
    featuredShirts: "ਫੀਚਰਡ ਟੀ-ਸ਼ਰਟ",
    newsletterSuccess: "ਜੁੜ ਗਏ.",
    newsletterError: "ਅਸਫਲ.",
    heroTitle: "ਹਰ ਰੋਜ਼ ਇੱਕ ਛੋਟਾ ਤੋਹਫ਼ਾ ਵਾਂਗ ਲੰਚਬਾਕਸ.",
    shopCta: "ਖਰੀਦੋ",
    shirtsSectionTitle: "ਗ੍ਰਾਫਿਕ ਟੀ-ਸ਼ਰਟ",
    shopShirts: "ਸ਼ਰਟ ਵੇਖੋ"
  },
  products: {
    title: "ਲੰਚਬਾਕਸ ਅਤੇ ਸ਼ਰਟ",
    subtitle: "ਪ੍ਰੀਮੀਅਮ ਸਮੱਗਰੀ.",
    shirts: "ਟੀ-ਸ਼ਰਟ",
    allCategories: "ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ",
    apply: "ਲਾਗੂ",
    showing: "{{shown}} / {{total}} · ਪੰਨਾ {{page}}",
    search: "ਖੋਜੋ",
    material: "ਸਮੱਗਰੀ",
    color: "ਰੰਗ",
    kids: "ਬੱਚੇ",
    office: "ਦਫ਼ਤਰ"
  },
  auth: {
    emailInUse: "ਈਮੇਲ ਪਹਿਲਾਂ ਹੀ ਹੈ.",
    networkError: "ਕਨੈਕਸ਼ਨ ਅਸਫਲ.",
    loginFailed: "ਗਲਤ ਲਾਗਇਨ."
  }
} as const satisfies DeepPartial<Record<string, unknown>>;

export const esOverlay = {
  nav: navEsFrDeJa("Inicio", "Loncheras", "Camisetas", "Carrito", "Favoritos", "Pedidos", "Entrar", "Registro"),
  home: {
    featured: "Loncheras destacadas",
    featuredShirts: "Camisetas destacadas",
    offerTitle: "Oferta de primavera",
    offerBody: "Usa WELCOME10 en tu primera compra.",
    gallery: "Tonos suaves",
    testimonials: "Familias felices",
    newsletterTitle: "Boletín",
    newsletterHint: "Novedades y cupones.",
    newsletterPlaceholder: "tu@email.com",
    subscribe: "Suscribirse",
    newsletterSuccess: "¡Listo! Te mantendremos informado.",
    newsletterError: "No se pudo suscribir — inténtalo luego.",
    rangeLabel: "Nuestra gama",
    pickVibe: "Elige tu estilo",
    viewAll: "Ver todo →",
    heroTitle: "Loncheras que se sienten como un pequeño regalo cada día.",
    heroBody: "Para el cole, la oficina y regalos.",
    shopCta: "Ver loncheras",
    cuteCta: "Colecciones cute",
    shirtsSectionTitle: "Camisetas gráficas",
    shirtsSectionSub: "Estampados que combinan con tus loncheras.",
    shopShirts: "Ver camisetas",
    colOriginal: "Original",
    colOriginalSub: "Limpio y minimal",
    colPositive: "Positive",
    colPositiveSub: "Tonos suaves",
    colGraphic: "Gráfico",
    colGraphicSub: "Estampados divertidos",
    colKids: "Niños",
    colKidsSub: "Lindo y resistente",
    colShirts: "Camisetas",
    colShirtsSub: "Algodón con estampado",
    colAccessories: "Accesorios",
    colAccessoriesSub: "Cubiertos y extras",
    sizeSnacks: "Snacks pequeños",
    sizeLight: "Almuerzo ligero",
    sizeDaily: "Comidas diarias",
    sizeBig: "Mucho apetito",
    sizeFamily: "Para compartir",
    sizeMealprep: "Meal prep"
  },
  products: {
    title: "Loncheras y camisetas",
    subtitle: "Materiales premium y colores pastel.",
    allCategories: "Todas las categorías",
    kids: "Niños",
    office: "Oficina",
    shirts: "Camisetas",
    apply: "Aplicar",
    sortNewest: "Más nuevos",
    sortPriceAsc: "Precio ↑",
    sortPriceDesc: "Precio ↓",
    sortRating: "Valoración",
    minInr: "Mín ₹",
    maxInr: "Máx ₹",
    showing: "Mostrando {{shown}} de {{total}} · página {{page}}",
    compareRegion: "Comparar (con descuento)",
    reviewsCount: "reseñas",
    search: "Buscar",
    material: "Material",
    color: "Color"
  },
  auth: {
    emailInUse: "Este correo ya está registrado.",
    invalidInput: "Revisa correo y contraseña.",
    networkError: "No se pudo conectar al servidor.",
    loginFailed: "Correo o contraseña incorrectos."
  }
} as const satisfies DeepPartial<Record<string, unknown>>;

export const frOverlay = {
  nav: navEsFrDeJa("Accueil", "Boîtes à lunch", "T-shirts", "Panier", "Liste d'envies", "Commandes", "Connexion", "S'inscrire"),
  home: {
    featured: "Boîtes à lunch en vedette",
    featuredShirts: "T-shirts en vedette",
    offerTitle: "Promo printemps",
    offerBody: "Utilisez WELCOME10 sur votre premier achat.",
    gallery: "Tons doux",
    testimonials: "Adoré des familles",
    newsletterTitle: "Infolettre",
    newsletterHint: "Nouveautés et coupons.",
    newsletterPlaceholder: "vous@email.com",
    subscribe: "S'abonner",
    newsletterSuccess: "Merci — vous êtes inscrit.",
    newsletterError: "Échec — réessayez plus tard.",
    rangeLabel: "Notre gamme",
    pickVibe: "Choisissez votre style",
    viewAll: "Tout voir →",
    heroTitle: "Des boîtes à lunch comme un petit cadeau chaque jour.",
    heroBody: "Pour l'école, le bureau et les cadeaux.",
    shopCta: "Voir les boîtes",
    cuteCta: "Collections mignonnes",
    shirtsSectionTitle: "T-shirts graphiques",
    shirtsSectionSub: "Imprimés assortis à vos boîtes.",
    shopShirts: "Voir les t-shirts"
  },
  products: {
    title: "Boîtes à lunch et t-shirts",
    subtitle: "Matériaux premium, couleurs pastel.",
    allCategories: "Toutes les catégories",
    kids: "Enfants",
    office: "Bureau",
    shirts: "T-shirts",
    apply: "Appliquer",
    sortNewest: "Plus récents",
    sortPriceAsc: "Prix ↑",
    sortPriceDesc: "Prix ↓",
    sortRating: "Note",
    minInr: "Min ₹",
    maxInr: "Max ₹",
    showing: "Affichage {{shown}} sur {{total}} · page {{page}}",
    compareRegion: "Comparer (après réduction)",
    reviewsCount: "avis",
    search: "Recherche",
    material: "Matériau",
    color: "Couleur"
  },
  auth: {
    emailInUse: "Cet e-mail est déjà utilisé.",
    invalidInput: "Vérifiez l'e-mail et le mot de passe.",
    networkError: "Impossible de joindre le serveur.",
    loginFailed: "E-mail ou mot de passe incorrect."
  }
} as const satisfies DeepPartial<Record<string, unknown>>;

export const deOverlay = {
  nav: navEsFrDeJa("Start", "Brotdosen", "T-Shirts", "Warenkorb", "Wunschliste", "Bestellungen", "Login", "Registrieren"),
  home: {
    featured: "Beliebte Brotdosen",
    featuredShirts: "Beliebte T-Shirts",
    offerTitle: "Frühlingsangebot",
    offerBody: "Nutze WELCOME10 beim ersten Einkauf.",
    gallery: "Sanfte Farben",
    testimonials: "Familienliebling",
    newsletterTitle: "Newsletter",
    newsletterHint: "Neuheiten & Gutscheine.",
    newsletterPlaceholder: "du@email.com",
    subscribe: "Abonnieren",
    newsletterSuccess: "Danke — du bist dabei.",
    newsletterError: "Fehlgeschlagen — später erneut versuchen.",
    rangeLabel: "Unser Sortiment",
    pickVibe: "Wähle deinen Stil",
    viewAll: "Alle anzeigen →",
    heroTitle: "Brotdosen wie ein kleines Geschenk für jeden Tag.",
    heroBody: "Für Schule, Büro und Geschenke.",
    shopCta: "Brotdosen shoppen",
    cuteCta: "Süße Kollektionen",
    shirtsSectionTitle: "Grafik-T-Shirts",
    shirtsSectionSub: "Prints passend zu deinen Boxen.",
    shopShirts: "T-Shirts ansehen"
  },
  products: {
    title: "Brotdosen & Shirts",
    subtitle: "Premium-Materialien, Pastellfarben.",
    allCategories: "Alle Kategorien",
    kids: "Kinder",
    office: "Büro",
    shirts: "T-Shirts",
    apply: "Anwenden",
    sortNewest: "Neueste",
    sortPriceAsc: "Preis ↑",
    sortPriceDesc: "Preis ↓",
    sortRating: "Bewertung",
    minInr: "Min ₹",
    maxInr: "Max ₹",
    showing: "{{shown}} von {{total}} · Seite {{page}}",
    compareRegion: "Vergleich (nach Rabatt)",
    reviewsCount: "Bewertungen",
    search: "Suche",
    material: "Material",
    color: "Farbe"
  },
  auth: {
    emailInUse: "Diese E-Mail ist bereits registriert.",
    invalidInput: "Bitte E-Mail und Passwort prüfen.",
    networkError: "Server nicht erreichbar.",
    loginFailed: "Falsche Anmeldedaten."
  }
} as const satisfies DeepPartial<Record<string, unknown>>;

export const jaOverlay = {
  nav: navEsFrDeJa("ホーム", "ランチボックス", "Tシャツ", "カート", "ほしい物", "注文", "ログイン", "登録"),
  home: {
    featured: "おすすめランチボックス",
    featuredShirts: "おすすめTシャツ",
    offerTitle: "春のセール",
    offerBody: "初回購入で WELCOME10 をどうぞ。",
    gallery: "やわらかい色合い",
    testimonials: "家族に人気",
    newsletterTitle: "ニュースレター",
    newsletterHint: "新商品とクーポン。",
    newsletterPlaceholder: "you@email.com",
    subscribe: "登録",
    newsletterSuccess: "登録ありがとうございます。",
    newsletterError: "登録に失敗しました。後でもう一度。",
    rangeLabel: "ラインナップ",
    pickVibe: "好みを選ぶ",
    viewAll: "すべて見る →",
    heroTitle: "毎日ちょっとしたギフトみたいなランチボックス。",
    heroBody: "学校・オフィス・ギフトに。",
    shopCta: "ランチボックスを見る",
    cuteCta: "かわいいシリーズ",
    shirtsSectionTitle: "グラフィックTシャツ",
    shirtsSectionSub: "ランチボックスに合うプリント。",
    shopShirts: "Tシャツを見る"
  },
  products: {
    title: "ランチボックス＆Tシャツ",
    subtitle: "プレミアム素材、パステルカラー。",
    allCategories: "すべてのカテゴリ",
    kids: "キッズ",
    office: "オフィス",
    shirts: "Tシャツ",
    apply: "適用",
    sortNewest: "新着",
    sortPriceAsc: "価格↑",
    sortPriceDesc: "価格↓",
    sortRating: "評価",
    minInr: "最小 ₹",
    maxInr: "最大 ₹",
    showing: "{{shown}} / {{total}} 件 · ページ {{page}}",
    compareRegion: "比較（割引後）",
    reviewsCount: "レビュー",
    search: "検索",
    material: "素材",
    color: "色"
  },
  auth: {
    emailInUse: "このメールは既に登録されています。",
    invalidInput: "メールとパスワードを確認してください。",
    networkError: "サーバーに接続できません。",
    loginFailed: "ログインに失敗しました。"
  }
} as const satisfies DeepPartial<Record<string, unknown>>;

/** Merge overlay with English base (typed loosely — keys must match `en`). */
export function overlay<T extends Record<string, unknown>>(base: T, patch: DeepPartial<T>): T {
  return mergeDeep(base, patch);
}
