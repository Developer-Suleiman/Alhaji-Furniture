// Internationalization (i18n) Module for Eid Furniture
// Supports English and Arabic with RTL support

const LANG_STORAGE_KEY = 'eidFurnitureLang';

// Translations
const translations = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.products': 'Products',
        'nav.gallery': 'Gallery',
        'nav.reviews': 'Reviews',
        'nav.contact': 'Contact',
        
        // Hero Section
        'hero.slide1.title': 'Elevate Your Living Space',
        'hero.slide1.subtitle': 'Discover timeless elegance with our handcrafted furniture collection',
        'hero.slide2.title': 'Comfort Meets Style',
        'hero.slide2.subtitle': 'Experience luxury living with our premium furniture designs',
        'hero.slide3.title': 'Modern Living Redefined',
        'hero.slide3.subtitle': 'Transform your home into a sanctuary of style and comfort',
        'hero.slide4.title': 'Bedroom Elegance',
        'hero.slide4.subtitle': 'Create your perfect retreat with our luxurious bedroom collections',
        'hero.slide5.title': 'Dining Excellence',
        'hero.slide5.subtitle': 'Gather in style with our stunning dining room furniture sets',
        'hero.shopNow': 'Shop Now',
        'hero.explore': 'Explore Collection',
        
        // Features Section
        'features.freeDelivery': 'Free Delivery',
        'features.freeDeliveryDesc': 'On orders over 5000 EGP',
        'features.warranty': '5 Year Warranty',
        'features.warrantyDesc': 'Quality guaranteed',
        'features.returns': 'Easy Returns',
        'features.returnsDesc': '30-day return policy',
        'features.support': '24/7 Support',
        'features.supportDesc': 'Expert assistance',
        
        // About Section
        'about.subtitle': 'About Us',
        'about.title': 'Crafting Dreams Into Reality Since 1998',
        'about.description': 'At Eid Furniture, we believe that every piece of furniture tells a story. Our master craftsmen combine traditional techniques with modern innovation to create timeless pieces that transform houses into homes.',
        'about.yearsExcellence': 'Years of Excellence',
        'about.feature1': 'Handcrafted Excellence',
        'about.feature2': 'Sustainable Materials',
        'about.feature3': 'Custom Designs Available',
        'about.feature4': 'Premium Quality Guaranteed',
        'about.learnMore': 'Learn More',
        
        // Products Section
        'products.subtitle': 'Our Collection',
        'products.title': 'Featured Products',
        'products.filterAll': 'All',
        'products.filterLiving': 'Living Room',
        'products.filterBedroom': 'Bedroom',
        'products.filterDining': 'Dining',
        'products.filterOffice': 'Office',
        'products.filterWood': 'Wood Materials',
        'products.filterAccessories': 'Accessories',
        'products.loadMore': 'Load More Products',
        'products.addToCart': 'Add to Cart',
        'products.quickView': 'Quick View',
        
        // Categories
        'categories.livingRoom': 'Living Room',
        'categories.bedroom': 'Bedroom',
        'categories.diningRoom': 'Dining Room',
        'categories.office': 'Home Office',
        'categories.outdoor': 'Outdoor',
        
        // Gallery Section
        'gallery.subtitle': 'Inspiration',
        'gallery.title': 'Our Gallery',
        'gallery.modernLiving': 'Modern Living Room',
        'gallery.elegantBedroom': 'Elegant Bedroom',
        'gallery.diningExcellence': 'Dining Excellence',
        'gallery.homeOffice': 'Home Office',
        'gallery.premiumSofas': 'Premium Sofas',
        'gallery.bedroomSets': 'Complete Bedroom Sets',
        
        // Reviews Section
        'reviews.subtitle': 'Customer Reviews',
        'reviews.title': 'What Our Customers Say',
        'reviews.description': 'Real reviews from our valued customers',
        'reviews.writeReview': 'Write a Review',
        'reviews.noReviews': 'No reviews yet',
        'reviews.beFirst': 'Be the first to share your experience with Eid Furniture!',
        'reviews.basedOn': 'Based on',
        'reviews.reviewsText': 'reviews',
        
        // Newsletter Section
        'newsletter.title': 'Subscribe to Our Newsletter',
        'newsletter.description': 'Get exclusive offers, new arrivals, and design inspiration delivered to your inbox.',
        'newsletter.placeholder': 'Enter your email address',
        'newsletter.subscribe': 'Subscribe',
        
        // Contact Section
        'contact.subtitle': 'Get In Touch',
        'contact.title': 'Contact Us',
        'contact.visitShowroom': 'Visit Our Showroom',
        'contact.address': 'Abbas Al-Akkad Street, Nasr City<br>Cairo, Egypt',
        'contact.callUs': 'Call Us',
        'contact.emailUs': 'Email Us',
        'contact.workingHours': 'Working Hours',
        'contact.hours': 'Sat - Thu: 10AM - 10PM<br>Friday: 2PM - 10PM',
        'contact.form.name': 'Your Name',
        'contact.form.email': 'Your Email',
        'contact.form.phone': 'Phone Number',
        'contact.form.selectSubject': 'Select Subject',
        'contact.form.inquiry': 'Product Inquiry',
        'contact.form.custom': 'Custom Order',
        'contact.form.support': 'Support',
        'contact.form.feedback': 'Feedback',
        'contact.form.message': 'Your Message',
        'contact.form.send': 'Send Message',
        
        // Footer
        'footer.description': 'Creating beautiful spaces with premium quality furniture since 1998. Located in the heart of Cairo, Egypt. Our commitment to excellence ensures your home reflects your unique style.',
        'footer.address': 'Abbas Al-Akkad St., Nasr City, Cairo, Egypt',
        'footer.quickLinks': 'Quick Links',
        'footer.categories': 'Categories',
        'footer.customerService': 'Customer Service',
        'footer.shipping': 'Shipping Info',
        'footer.returns': 'Returns & Exchanges',
        'footer.faq': 'FAQ',
        'footer.warranty': 'Warranty',
        'footer.trackOrder': 'Track Order',
        'footer.copyright': '© 2024 Eid Furniture - Cairo, Egypt. All Rights Reserved.',
        
        // Cart
        'cart.title': 'Your Cart',
        'cart.empty': 'Your cart is empty',
        'cart.startShopping': 'Start Shopping',
        'cart.total': 'Total:',
        'cart.checkout': 'Proceed to Checkout',
        'cart.remove': 'Remove',
        
        // Product
        'product.details': 'Product Details',
        
        // Chatbot
        'chatbot.name': 'Eid Assistant',
        'chatbot.online': 'Online',
        'chatbot.products': 'Products',
        'chatbot.delivery': 'Delivery',
        'chatbot.returns': 'Returns',
        'chatbot.support': 'Support',
        'chatbot.placeholder': 'Type your message...',
        'chatbot.welcome': 'Hello! Welcome to Eid Furniture. How can I help you today?',
        
        // Auth
        'auth.welcomeBack': 'Welcome Back!',
        'auth.signIn': 'Sign in to your account',
        'auth.email': 'Email Address',
        'auth.password': 'Password',
        'auth.rememberMe': 'Remember me',
        'auth.forgotPassword': 'Forgot Password?',
        'auth.signInBtn': 'Sign In',
        'auth.orContinue': 'or continue with',
        'auth.noAccount': "Don't have an account?",
        'auth.signUp': 'Sign Up',
        'auth.createAccount': 'Create Account',
        'auth.joinUs': 'Join us and start shopping',
        'auth.firstName': 'First Name',
        'auth.lastName': 'Last Name',
        'auth.phone': 'Phone Number (Optional)',
        'auth.agreeTerms': 'I agree to the Terms of Service and Privacy Policy',
        'auth.subscribeNewsletter': 'Subscribe to newsletter for exclusive offers',
        'auth.orSignUp': 'or sign up with',
        'auth.haveAccount': 'Already have an account?',
        'auth.resetPassword': 'Reset Password',
        'auth.resetDesc': 'Enter your email to receive reset link',
        'auth.sendResetLink': 'Send Reset Link',
        'auth.rememberPassword': 'Remember your password?',
        'auth.myAccount': 'My Account',
        'auth.profile': 'Profile',
        'auth.orders': 'Orders',
        'auth.messages': 'Messages',
        'auth.logout': 'Logout',
        
        // General
        'general.loading': 'Loading...',
        'general.error': 'An error occurred',
        'general.success': 'Success!',
        'general.egp': 'EGP',
        'general.usd': 'USD'
    },
    
    ar: {
        // Navigation
        'nav.home': 'الرئيسية',
        'nav.about': 'من نحن',
        'nav.products': 'المنتجات',
        'nav.gallery': 'المعرض',
        'nav.reviews': 'التقييمات',
        'nav.contact': 'اتصل بنا',
        
        // Hero Section
        'hero.slide1.title': 'ارتقِ بمساحة معيشتك',
        'hero.slide1.subtitle': 'اكتشف الأناقة الخالدة مع مجموعتنا المصنوعة يدوياً',
        'hero.slide2.title': 'الراحة تلتقي بالأناقة',
        'hero.slide2.subtitle': 'عش تجربة الفخامة مع تصاميم الأثاث المميزة',
        'hero.slide3.title': 'الحياة العصرية بمفهوم جديد',
        'hero.slide3.subtitle': 'حوّل منزلك إلى واحة من الأناقة والراحة',
        'hero.slide4.title': 'أناقة غرف النوم',
        'hero.slide4.subtitle': 'اصنع ملاذك المثالي مع مجموعاتنا الفاخرة لغرف النوم',
        'hero.slide5.title': 'تميز غرف الطعام',
        'hero.slide5.subtitle': 'اجتمع بأسلوب راقٍ مع أطقم غرف الطعام المذهلة',
        'hero.shopNow': 'تسوق الآن',
        'hero.explore': 'استكشف المجموعة',
        
        // Features Section
        'features.freeDelivery': 'توصيل مجاني',
        'features.freeDeliveryDesc': 'للطلبات أكثر من 5000 ج.م',
        'features.warranty': 'ضمان 5 سنوات',
        'features.warrantyDesc': 'جودة مضمونة',
        'features.returns': 'إرجاع سهل',
        'features.returnsDesc': 'سياسة إرجاع 30 يوم',
        'features.support': 'دعم على مدار الساعة',
        'features.supportDesc': 'مساعدة متخصصة',
        
        // About Section
        'about.subtitle': 'من نحن',
        'about.title': 'نحول الأحلام إلى حقيقة منذ 1998',
        'about.description': 'في أثاث عيد، نؤمن بأن كل قطعة أثاث تحكي قصة. حرفيونا المهرة يجمعون بين التقنيات التقليدية والابتكار الحديث لصنع قطع خالدة تحول البيوت إلى منازل.',
        'about.yearsExcellence': 'سنوات من التميز',
        'about.feature1': 'حرفية يدوية متميزة',
        'about.feature2': 'مواد مستدامة',
        'about.feature3': 'تصاميم مخصصة متاحة',
        'about.feature4': 'جودة فاخرة مضمونة',
        'about.learnMore': 'اعرف المزيد',
        
        // Products Section
        'products.subtitle': 'مجموعتنا',
        'products.title': 'منتجات مميزة',
        'products.filterAll': 'الكل',
        'products.filterLiving': 'غرفة المعيشة',
        'products.filterBedroom': 'غرفة النوم',
        'products.filterDining': 'غرفة الطعام',
        'products.filterOffice': 'المكتب',
        'products.filterWood': 'الأخشاب',
        'products.filterAccessories': 'الإكسسوارات',
        'products.loadMore': 'تحميل المزيد',
        'products.addToCart': 'أضف للسلة',
        'products.quickView': 'عرض سريع',
        
        // Categories
        'categories.livingRoom': 'غرفة المعيشة',
        'categories.bedroom': 'غرفة النوم',
        'categories.diningRoom': 'غرفة الطعام',
        'categories.office': 'مكتب منزلي',
        'categories.outdoor': 'أثاث خارجي',
        
        // Gallery Section
        'gallery.subtitle': 'إلهام',
        'gallery.title': 'معرضنا',
        'gallery.modernLiving': 'غرفة معيشة عصرية',
        'gallery.elegantBedroom': 'غرفة نوم أنيقة',
        'gallery.diningExcellence': 'تميز غرفة الطعام',
        'gallery.homeOffice': 'مكتب منزلي',
        'gallery.premiumSofas': 'أرائك فاخرة',
        'gallery.bedroomSets': 'أطقم غرف نوم كاملة',
        
        // Reviews Section
        'reviews.subtitle': 'تقييمات العملاء',
        'reviews.title': 'ماذا يقول عملاؤنا',
        'reviews.description': 'تقييمات حقيقية من عملائنا الكرام',
        'reviews.writeReview': 'اكتب تقييم',
        'reviews.noReviews': 'لا توجد تقييمات بعد',
        'reviews.beFirst': 'كن أول من يشارك تجربته مع أثاث عيد!',
        'reviews.basedOn': 'بناءً على',
        'reviews.reviewsText': 'تقييم',
        
        // Newsletter Section
        'newsletter.title': 'اشترك في نشرتنا البريدية',
        'newsletter.description': 'احصل على عروض حصرية وأحدث المنتجات وإلهام التصميم في بريدك.',
        'newsletter.placeholder': 'أدخل بريدك الإلكتروني',
        'newsletter.subscribe': 'اشترك',
        
        // Contact Section
        'contact.subtitle': 'تواصل معنا',
        'contact.title': 'اتصل بنا',
        'contact.visitShowroom': 'زر معرضنا',
        'contact.address': 'شارع عباس العقاد، مدينة نصر<br>القاهرة، مصر',
        'contact.callUs': 'اتصل بنا',
        'contact.emailUs': 'راسلنا',
        'contact.workingHours': 'ساعات العمل',
        'contact.hours': 'السبت - الخميس: 10 صباحاً - 10 مساءً<br>الجمعة: 2 مساءً - 10 مساءً',
        'contact.form.name': 'اسمك',
        'contact.form.email': 'بريدك الإلكتروني',
        'contact.form.phone': 'رقم الهاتف',
        'contact.form.selectSubject': 'اختر الموضوع',
        'contact.form.inquiry': 'استفسار عن منتج',
        'contact.form.custom': 'طلب مخصص',
        'contact.form.support': 'الدعم',
        'contact.form.feedback': 'ملاحظات',
        'contact.form.message': 'رسالتك',
        'contact.form.send': 'إرسال الرسالة',
        
        // Footer
        'footer.description': 'نصنع مساحات جميلة بأثاث عالي الجودة منذ 1998. في قلب القاهرة، مصر. التزامنا بالتميز يضمن أن يعكس منزلك أسلوبك الفريد.',
        'footer.address': 'شارع عباس العقاد، مدينة نصر، القاهرة، مصر',
        'footer.quickLinks': 'روابط سريعة',
        'footer.categories': 'الأقسام',
        'footer.customerService': 'خدمة العملاء',
        'footer.shipping': 'معلومات الشحن',
        'footer.returns': 'الإرجاع والاستبدال',
        'footer.faq': 'الأسئلة الشائعة',
        'footer.warranty': 'الضمان',
        'footer.trackOrder': 'تتبع الطلب',
        'footer.copyright': '© 2024 أثاث عيد - القاهرة، مصر. جميع الحقوق محفوظة.',
        
        // Cart
        'cart.title': 'سلة التسوق',
        'cart.empty': 'سلتك فارغة',
        'cart.startShopping': 'ابدأ التسوق',
        'cart.total': 'المجموع:',
        'cart.checkout': 'إتمام الشراء',
        'cart.remove': 'حذف',
        
        // Product
        'product.details': 'تفاصيل المنتج',
        
        // Chatbot
        'chatbot.name': 'مساعد عيد',
        'chatbot.online': 'متصل',
        'chatbot.products': 'المنتجات',
        'chatbot.delivery': 'التوصيل',
        'chatbot.returns': 'الإرجاع',
        'chatbot.support': 'الدعم',
        'chatbot.placeholder': 'اكتب رسالتك...',
        'chatbot.welcome': 'مرحباً! أهلاً بك في أثاث عيد. كيف يمكنني مساعدتك اليوم؟',
        
        // Auth
        'auth.welcomeBack': 'مرحباً بعودتك!',
        'auth.signIn': 'سجل الدخول لحسابك',
        'auth.email': 'البريد الإلكتروني',
        'auth.password': 'كلمة المرور',
        'auth.rememberMe': 'تذكرني',
        'auth.forgotPassword': 'نسيت كلمة المرور؟',
        'auth.signInBtn': 'تسجيل الدخول',
        'auth.orContinue': 'أو تابع باستخدام',
        'auth.noAccount': 'ليس لديك حساب؟',
        'auth.signUp': 'إنشاء حساب',
        'auth.createAccount': 'إنشاء حساب',
        'auth.joinUs': 'انضم إلينا وابدأ التسوق',
        'auth.firstName': 'الاسم الأول',
        'auth.lastName': 'اسم العائلة',
        'auth.phone': 'رقم الهاتف (اختياري)',
        'auth.agreeTerms': 'أوافق على شروط الخدمة وسياسة الخصوصية',
        'auth.subscribeNewsletter': 'اشترك في النشرة البريدية للعروض الحصرية',
        'auth.orSignUp': 'أو سجل باستخدام',
        'auth.haveAccount': 'لديك حساب بالفعل؟',
        'auth.resetPassword': 'إعادة تعيين كلمة المرور',
        'auth.resetDesc': 'أدخل بريدك الإلكتروني لتلقي رابط إعادة التعيين',
        'auth.sendResetLink': 'إرسال رابط إعادة التعيين',
        'auth.rememberPassword': 'تتذكر كلمة المرور؟',
        'auth.myAccount': 'حسابي',
        'auth.profile': 'الملف الشخصي',
        'auth.orders': 'الطلبات',
        'auth.messages': 'الرسائل',
        'auth.logout': 'تسجيل الخروج',
        
        // General
        'general.loading': 'جاري التحميل...',
        'general.error': 'حدث خطأ',
        'general.success': 'تم بنجاح!',
        'general.egp': 'ج.م',
        'general.usd': 'دولار'
    }
};

// Current language
let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'en';

// Initialize i18n
function initI18n() {
    // Set initial language
    setLanguage(currentLang, false);
    
    // Setup language toggle button
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
}

// Toggle between English and Arabic
function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    setLanguage(newLang, true);
}

// Set language
function setLanguage(lang, animate = true) {
    currentLang = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    
    const html = document.documentElement;
    const body = document.body;
    
    // Add transition class for smooth animation
    if (animate) {
        body.classList.add('lang-transition');
    }
    
    // Set direction and language attribute
    if (lang === 'ar') {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        body.classList.add('rtl');
        body.classList.remove('ltr');
    } else {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        body.classList.add('ltr');
        body.classList.remove('rtl');
    }
    
    // Update toggle button text
    const langText = document.getElementById('langText');
    if (langText) {
        langText.textContent = lang === 'en' ? 'عربي' : 'English';
    }
    
    // Translate all elements with data-i18n attribute
    translatePage();
    
    // Remove transition class after animation
    if (animate) {
        setTimeout(() => {
            body.classList.remove('lang-transition');
        }, 500);
    }
    
    // Dispatch event for other scripts to react
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// Translate all elements on the page
function translatePage() {
    // Translate data-i18n elements
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        
        if (translation) {
            if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else {
                element.innerHTML = translation;
            }
        }
    });
    
    // Translate placeholder attributes
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getTranslation(key);
        if (translation) {
            element.placeholder = translation;
        }
    });
    
    // Update page title
    document.title = currentLang === 'ar' 
        ? 'أثاث عيد - أثاث فاخر عالي الجودة' 
        : 'Eid Furniture - Premium Quality Furniture';
}

// Get translation by key
function getTranslation(key) {
    const langData = translations[currentLang];
    return langData ? langData[key] : null;
}

// Get current language
function getCurrentLanguage() {
    return currentLang;
}

// Check if current language is RTL
function isRTL() {
    return currentLang === 'ar';
}

// Translate a specific key (for dynamic content)
function t(key, fallback = '') {
    return getTranslation(key) || fallback || key;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initI18n);

// Export functions for use in other scripts
window.i18n = {
    t,
    getCurrentLanguage,
    isRTL,
    setLanguage,
    toggleLanguage
};
