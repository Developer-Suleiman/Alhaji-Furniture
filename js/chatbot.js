// Alhaji Furniture AI Chatbot

// ── Arabic Knowledge Base ──────────────────────────────────────────────────
const knowledgeBaseAr = {
    greetings: {
        patterns: ['مرحبا', 'مرحباً', 'أهلا', 'أهلاً', 'هلا', 'السلام', 'صباح الخير', 'مساء الخير', 'هاي', 'هلو'],
        responses: [
            "أهلاً وسهلاً! 👋 مرحباً بك في أثاث الحاجي. كيف يمكنني مساعدتك اليوم؟",
            "مرحباً! أنا مساعدك في أثاث الحاجي. بماذا يمكنني خدمتك؟",
            "أهلاً بك! 🪑 أنا هنا لأساعدك في إيجاد الأثاث المثالي. ماذا تبحث عن؟"
        ]
    },
    products: {
        patterns: ['منتجات', 'أثاث', 'ماذا عندكم', 'ماذا لديكم', 'مجموعة', 'قطع', 'عرض', 'أرني', 'كتالوج'],
        responses: [
            "لدينا مجموعة واسعة من الأثاث الفاخر! 🛋️\n\n• **غرفة المعيشة**: أرائك، كراسي، طاولات\n• **غرفة النوم**: أسرة، طاولات سرير، خزائن\n• **غرفة الطعام**: طاولات، كراسي، بار\n• **المكتب**: مكاتب، كراسي مكتب، أرفف\n\nهل تريد استكشاف قسم بعينه؟"
        ]
    },
    living: {
        patterns: ['غرفة معيشة', 'غرفة المعيشة', 'أريكة', 'كنبة', 'أنتريه', 'صالة', 'صالون', 'طقم جلوس'],
        responses: [
            "مجموعة غرفة المعيشة لدينا تشمل:\n\n🛋️ **أريكة الراحة العصرية** - 25,000 ج.م\n🪑 **كرسي إسكندنافي** - 12,000 ج.م\n🛋️ **أريكة زاوية L** - 38,000 ج.م\n\nجميع القطع مضمونة 5 سنوات! هل تريد تفاصيل أكثر؟"
        ]
    },
    bedroom: {
        patterns: ['غرفة نوم', 'غرفة النوم', 'سرير', 'تخت', 'مرتبة', 'خزانة', 'دولاب', 'كومودينو'],
        responses: [
            "حوّل غرفة نومك مع مجموعتنا:\n\n🛏️ **سرير كينج أنيق** - 18,000 ج.م\n🪑 **كومودينو فاخر** - 5,000 ج.م\n🚪 **خزانة مع مرايا** - 26,000 ج.م\n\nالتركيب مجاني! هل تريد معرفة المزيد؟"
        ]
    },
    dining: {
        patterns: ['غرفة طعام', 'غرفة الطعام', 'طاولة طعام', 'طاولة سفرة', 'سفرة', 'كراسي طعام', 'أوضة سفرة'],
        responses: [
            "مجموعة غرف الطعام لدينا:\n\n🍽️ **طاولة طعام فخمة** - 30,000 ج.م (تتسع لـ 8 أشخاص)\n🪑 **طقم كراسي طعام** - 14,000 ج.م (4 كراسي)\n🪑 **طقم كراسي بار** - 8,000 ج.م (كرسيان)\n\nمثالية للتجمعات العائلية! هل تحتاج أبعاد معينة؟"
        ]
    },
    office: {
        patterns: ['مكتب', 'كرسي مكتب', 'رف كتب', 'مكتبة', 'أوضة مكتب', 'ديسك', 'شغل', 'هوم أوفيس'],
        responses: [
            "اصنع مساحة عمل مثالية:\n\n💺 **كرسي مكتب إرغونومي** - 9,000 ج.م\n🖥️ **مكتب قائم برو** - 16,000 ج.م\n📚 **رف كتب** - 7,000 ج.م\n\nمصممة للراحة والإنتاجية! هل تريد التفاصيل؟"
        ]
    },
    pricing: {
        patterns: ['سعر', 'أسعار', 'تكلفة', 'كم سعر', 'كم الثمن', 'غالي', 'رخيص', 'ميزانية', 'تكلف كام', 'بكام'],
        responses: [
            "تتراوح أسعارنا بين الاقتصادي والفاخر:\n\n💰 **اقتصادي**: 5,000 - 10,000 ج.م\n💎 **متوسط**: 10,000 - 20,000 ج.م\n👑 **فاخر**: 20,000+ ج.م\n\nنوفر أيضاً خيارات تقسيط وعروض موسمية! ما هي ميزانيتك؟"
        ]
    },
    delivery: {
        patterns: ['توصيل', 'شحن', 'توصيل مجاني', 'متى يوصل', 'كم يأخذ التوصيل', 'يوصلوا فين'],
        responses: [
            "📦 **معلومات التوصيل**:\n\n• **توصيل مجاني** للطلبات فوق 5,000 ج.م\n• التوصيل العادي: 3-5 أيام عمل\n• التوصيل السريع: 1-2 يوم (+500 ج.م)\n• خدمة التوصيل الراقي: تشمل التركيب\n\nنوصل لجميع أنحاء القاهرة ومصر! ما موقعك؟"
        ]
    },
    returns: {
        patterns: ['استرداد', 'إرجاع', 'ارجاع', 'استبدال', 'رد فلوس', 'مش عاجبني', 'سياسة الإرجاع'],
        responses: [
            "🔄 **سياسة الإرجاع**:\n\n• إرجاع مجاني خلال **30 يوماً**\n• يجب أن تكون القطعة بحالتها الأصلية\n• استلام مجاني للقطع المعيبة\n• استرداد كامل خلال 5-7 أيام عمل\n\nهل تريد بدء عملية إرجاع؟ تواصل مع فريق الدعم!"
        ]
    },
    warranty: {
        patterns: ['ضمان', 'كفالة', 'غطاء', 'تلف', 'معطل', 'مكسور'],
        responses: [
            "🛡️ **تغطية الضمان**:\n\n• ضمان **5 سنوات** على جميع قطع الأثاث\n• يغطي عيوب التصنيع\n• إصلاح أو استبدال مجاني\n• ضمان ممتد متاح (+سنتان)\n\nرضاك هو أولويتنا!"
        ]
    },
    payment: {
        patterns: ['دفع', 'طريقة الدفع', 'بطاقة', 'تقسيط', 'فيزا', 'ماستر', 'كاش', 'كريدت'],
        responses: [
            "💳 **طرق الدفع**:\n\n• بطاقات الائتمان/الخصم (Visa, Mastercard, Amex)\n• PayPal\n• Apple Pay و Google Pay\n• **تقسيط**: 0% فائدة لـ 12 شهراً\n• الدفع الآن واستلام لاحقاً (Afterpay)\n\nجميع المعاملات آمنة! أي طريقة تناسبك؟"
        ]
    },
    contact: {
        patterns: ['تواصل', 'تواصل معنا', 'هاتف', 'تليفون', 'بريد', 'ايميل', 'دعم', 'خدمة عملاء', 'كلم حد', 'موظف'],
        responses: [
            "📞 **تواصل معنا**:\n\n• **هاتف**: 1234 2275 2 20+\n• **بريد**: info@hajifurniture.com\n• **المواعيد**: السبت-الخميس 10ص-10م، الجمعة 2م-10م\n• **العنوان**: شارع عباس العقاد، مدينة نصر، القاهرة\n\nأو املأ نموذج التواصل على الموقع!"
        ]
    },
    location: {
        patterns: ['موقع', 'عنوان', 'فين', 'المحل', 'المعرض', 'الفرع', 'أزورهم', 'زيارة'],
        responses: [
            "📍 **زر معرضنا**:\n\nشارع عباس العقاد\nمدينة نصر\nالقاهرة، مصر\n\n**المواعيد**:\n• السبت-الخميس: 10ص - 10م\n• الجمعة: 2م - 10م\n\nتعال وشاهد أثاثنا بنفسك!"
        ]
    },
    custom: {
        patterns: ['مخصص', 'تخصيص', 'طلب خاص', 'حسب الطلب', 'قياس خاص', 'لون مختلف', 'تفصيل'],
        responses: [
            "✨ **الطلبات المخصصة**:\n\nنعم! نوفر أثاثاً مخصصاً:\n• اختر أبعادك\n• اختر الأقمشة والألوان\n• تشطيبات مخصصة متاحة\n• التسليم خلال 4-6 أسابيع\n\nتواصل معنا على custom@hajifurniture.com لنناقش تصورك!"
        ]
    },
    discount: {
        patterns: ['خصم', 'عرض', 'تخفيض', 'كوبون', 'بروموكود', 'عروض', 'تنزيلات', 'أوفر'],
        responses: [
            "🏷️ **العروض الحالية**:\n\n• **WELCOME10**: خصم 10% على أول طلب\n• **FREESHIP**: شحن مجاني للطلبات فوق 5,000 ج.م\n• تخفيضات موسمية تصل لـ 40%\n• المشتركون في النشرة البريدية يحصلون على عروض حصرية!\n\nاشترك في نشرتنا للمزيد من العروض!"
        ]
    },
    quality: {
        patterns: ['جودة', 'خامة', 'خشب', 'قماش', 'جلد', 'متين', 'تحمل', 'صناعة'],
        responses: [
            "🌟 **وعدنا بالجودة**:\n\n• بناء من الأخشاب الصلبة\n• أقمشة فاخرة وجلد أصلي\n• مواد صديقة للبيئة ومستدامة\n• صنع يدوي بأيدي حرفيين مهرة\n• اختبار جودة صارم\n\n25+ سنة من التميز!"
        ]
    },
    thanks: {
        patterns: ['شكرا', 'شكراً', 'ممنون', 'متشكر', 'يعطيك العافية', 'تسلم', 'مشكور'],
        responses: [
            "العفو! 😊 هل هناك أي شيء آخر يمكنني مساعدتك به؟",
            "بكل سرور! لا تتردد في السؤال إن كان لديك أي استفسار آخر!",
            "يسعدني خدمتك! 🪑 أخبرني إن احتجت أي شيء آخر!"
        ]
    },
    goodbye: {
        patterns: ['مع السلامة', 'باي', 'وداعاً', 'إلى اللقاء', 'تصبح على خير', 'أوداعك', 'خلاص'],
        responses: [
            "مع السلامة! 👋 شكراً للتواصل مع أثاث الحاجي. أتمنى لك يوماً رائعاً!",
            "إلى اللقاء! لا تنسَ الاطلاع على أحدث مجموعتنا! 🛋️",
            "باي! لا تتردد في العودة في أي وقت. تسوق سعيد! 🏠"
        ]
    },
    order_status: {
        patterns: ['حالة الطلب', 'أين طلبي', 'تتبع', 'تتبع الطلب', 'طلبي فين', 'وصل طلبي'],
        responses: [
            "📦 **تتبع طلبك**:\n\nللتحقق من حالة طلبك:\n1. زر موقعنا\n2. انقر على 'تتبع الطلب' في الأسفل\n3. أدخل رقم الطلب والبريد الإلكتروني\n\nأو تواصل مع الدعم برقم طلبك!"
        ]
    },
    assembly: {
        patterns: ['تركيب', 'تجميع', 'تركيب الأثاث', 'إزاي يتركب', 'خدمة التركيب'],
        responses: [
            "🔧 **خدمات التركيب**:\n\n• بنفسك: تعليمات سهلة مرفقة\n• **التركيب الاحترافي**: (+500 ج.م)\n• فيديوهات تعليمية متاحة أونلاين\n• جميع الأدوات مضمّنة في الطرد\n\nهل تحتاج مساعدة في التركيب؟ نحن هنا!"
        ]
    }
};

// Arabic default responses
const defaultResponsesAr = [
    "لم أفهم تماماً. هل يمكنك إعادة الصياغة؟ أو اسأل عن منتجاتنا، التوصيل، الإرجاع، أو تواصل معنا! 🤔",
    "عفواً، لم أستوعب ذلك جيداً. حاول السؤال عن:\n• مجموعة الأثاث\n• خيارات التوصيل\n• سياسة الإرجاع\n• تواصل مع الدعم",
    "ما زلت أتعلم! للأسئلة المعقدة، تواصل مع فريق الدعم على 1234 2275 2 20+ أو info@hajifurniture.com 📞"
];

// ── English Knowledge Base ─────────────────────────────────────────────────
const knowledgeBase = {
    greetings: {
        patterns: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings'],
        responses: [
            "Hello! 👋 Welcome to Alhaji Furniture. How can I help you today?",
            "Hi there! I'm your Alhaji Furniture assistant. What can I do for you?",
            "Welcome! 🪑 I'm here to help you find the perfect furniture. What are you looking for?"
        ]
    },
    products: {
        patterns: ['products', 'furniture', 'what do you sell', 'what do you have', 'catalog', 'collection', 'items', 'show me'],
        responses: [
            "We have a wide range of premium furniture! 🛋️\n\n• **Living Room**: Sofas, armchairs, coffee tables\n• **Bedroom**: Beds, nightstands, wardrobes\n• **Dining**: Tables, chairs, bar stools\n• **Office**: Desks, office chairs, bookshelves\n\nWould you like to explore a specific category?",
        ]
    },
    living: {
        patterns: ['living room', 'sofa', 'couch', 'armchair', 'living'],
        responses: [
            "Our living room collection features:\n\n🛋️ **Modern Comfort Sofa** - 25,000 EGP\n🪑 **Scandinavian Armchair** - 12,000 EGP\n🛋️ **L-Shaped Sectional** - 38,000 EGP\n\nAll come with a 5-year warranty! Would you like more details on any item?"
        ]
    },
    bedroom: {
        patterns: ['bedroom', 'bed', 'mattress', 'nightstand', 'wardrobe'],
        responses: [
            "Transform your bedroom with our collection:\n\n🛏️ **Elegant King Bed Frame** - 18,000 EGP\n🪑 **Luxury Bedside Table** - 5,000 EGP\n🚪 **Wardrobe with Mirror** - 26,000 EGP\n\nFree assembly included! Want me to show you more?"
        ]
    },
    dining: {
        patterns: ['dining', 'table', 'dining table', 'chairs', 'bar stool'],
        responses: [
            "Our dining collection includes:\n\n🍽️ **Executive Dining Table** - 30,000 EGP (seats 8)\n🪑 **Modern Dining Chairs Set** - 14,000 EGP (set of 4)\n🪑 **Bar Stools Set** - 8,000 EGP (set of 2)\n\nPerfect for family gatherings! Need any specific dimensions?"
        ]
    },
    office: {
        patterns: ['office', 'desk', 'office chair', 'work', 'bookshelf', 'standing desk'],
        responses: [
            "Create your perfect workspace:\n\n💺 **Ergonomic Office Chair** - 9,000 EGP\n🖥️ **Standing Desk Pro** - 16,000 EGP\n📚 **Bookshelf Unit** - 7,000 EGP\n\nAll designed for comfort and productivity! Interested in any item?"
        ]
    },
    pricing: {
        patterns: ['price', 'cost', 'how much', 'expensive', 'cheap', 'affordable', 'budget'],
        responses: [
            "Our prices range from budget-friendly to premium:\n\n💰 **Budget**: 5,000 - 10,000 EGP\n💎 **Mid-range**: 10,000 - 20,000 EGP\n👑 **Premium**: 20,000+ EGP\n\nWe also offer financing options and seasonal sales! What's your budget range?"
        ]
    },
    delivery: {
        patterns: ['delivery', 'shipping', 'deliver', 'ship', 'how long', 'when arrive'],
        responses: [
            "📦 **Delivery Information**:\n\n• **Free delivery** on orders over 5,000 EGP\n• Standard delivery: 3-5 business days\n• Express delivery: 1-2 business days (+500 EGP)\n• White glove service available: includes assembly\n\nWe deliver across Cairo and Egypt! What's your location?"
        ]
    },
    returns: {
        patterns: ['return', 'refund', 'exchange', 'money back', 'return policy'],
        responses: [
            "🔄 **Our Return Policy**:\n\n• **30-day** hassle-free returns\n• Items must be in original condition\n• Free return pickup for defective items\n• Full refund within 5-7 business days\n\nNeed to start a return? Contact our support team!"
        ]
    },
    warranty: {
        patterns: ['warranty', 'guarantee', 'protection', 'damage'],
        responses: [
            "🛡️ **Warranty Coverage**:\n\n• **5-year warranty** on all furniture\n• Covers manufacturing defects\n• Free repairs or replacement\n• Extended warranty available (+2 years)\n\nYour satisfaction is our priority!"
        ]
    },
    payment: {
        patterns: ['payment', 'pay', 'credit card', 'financing', 'installment', 'paypal'],
        responses: [
            "💳 **Payment Options**:\n\n• Credit/Debit cards (Visa, Mastercard, Amex)\n• PayPal\n• Apple Pay & Google Pay\n• **Financing**: 0% APR for 12 months\n• Afterpay: Buy now, pay later\n\nAll transactions are secure! Which method works for you?"
        ]
    },
    contact: {
        patterns: ['contact', 'phone', 'email', 'support', 'customer service', 'help', 'talk to human', 'speak to someone'],
        responses: [
            "📞 **Contact Us**:\n\n• **Phone**: +20 2 2275 1234\n• **Email**: info@hajifurniture.com\n• **Hours**: Sat-Thu 10AM-10PM, Fri 2PM-10PM\n• **Address**: Abbas Al-Akkad St., Nasr City, Cairo\n\nOr fill out our contact form on the website!"
        ]
    },
    location: {
        patterns: ['location', 'store', 'showroom', 'address', 'where', 'visit'],
        responses: [
            "📍 **Visit Our Showroom**:\n\nAbbas Al-Akkad Street\nNasr City\nCairo, Egypt\n\n**Hours**:\n• Sat-Thu: 10AM - 10PM\n• Friday: 2PM - 10PM\n\nCome see and feel our furniture in person!"
        ]
    },
    custom: {
        patterns: ['custom', 'customize', 'special order', 'made to order', 'bespoke'],
        responses: [
            "✨ **Custom Orders**:\n\nYes! We offer custom furniture:\n• Choose your dimensions\n• Select fabrics and colors\n• Custom finishes available\n• Delivery in 4-6 weeks\n\nContact us at custom@hajifurniture.com to discuss your vision!"
        ]
    },
    discount: {
        patterns: ['discount', 'coupon', 'promo', 'sale', 'offer', 'deal'],
        responses: [
            "🏷️ **Current Offers**:\n\n• **WELCOME10**: 10% off first order\n• **FREESHIP**: Free shipping on 5,000+ EGP\n• Seasonal sales up to 40% off\n• Newsletter subscribers get exclusive deals!\n\nSubscribe to our newsletter for more offers!"
        ]
    },
    quality: {
        patterns: ['quality', 'material', 'wood', 'fabric', 'leather', 'durable'],
        responses: [
            "🌟 **Our Quality Promise**:\n\n• Solid hardwood construction\n• Premium fabrics & genuine leather\n• Eco-friendly, sustainable materials\n• Handcrafted by skilled artisans\n• Rigorous quality testing\n\n25+ years of excellence!"
        ]
    },
    thanks: {
        patterns: ['thank', 'thanks', 'thank you', 'appreciate', 'helpful'],
        responses: [
            "You're welcome! 😊 Is there anything else I can help you with?",
            "My pleasure! Feel free to ask if you have more questions!",
            "Happy to help! 🪑 Let me know if you need anything else!"
        ]
    },
    goodbye: {
        patterns: ['bye', 'goodbye', 'see you', 'later', 'exit', 'quit'],
        responses: [
            "Goodbye! 👋 Thanks for chatting with Alhaji Furniture. Have a great day!",
            "See you soon! Don't forget to check out our latest collection! 🛋️",
            "Bye! Feel free to come back anytime. Happy furniture shopping! 🏠"
        ]
    },
    order_status: {
        patterns: ['order status', 'track order', 'where is my order', 'tracking', 'my order'],
        responses: [
            "📦 **Track Your Order**:\n\nTo check your order status:\n1. Visit our website\n2. Click 'Track Order' in footer\n3. Enter your order number and email\n\nOr contact support with your order number!"
        ]
    },
    assembly: {
        patterns: ['assembly', 'assemble', 'put together', 'installation', 'setup'],
        responses: [
            "🔧 **Assembly Services**:\n\n• DIY: Easy-to-follow instructions included\n• **White Glove**: Professional assembly (+500 EGP)\n• Video tutorials available online\n• All tools included in package\n\nNeed help with assembly? We're here for you!"
        ]
    }
};

// Default responses when no pattern matches
const defaultResponses = [
    "I'm not sure I understand. Could you rephrase that? Or ask about our products, delivery, returns, or contact information! 🤔",
    "Hmm, I didn't quite catch that. Try asking about:\n• Our furniture collection\n• Delivery options\n• Return policy\n• Contact support",
    "I'm still learning! For complex questions, please contact our support team at +20 2 2275 1234 or info@hajifurniture.com 📞"
];

// Chatbot Class
class HajiChatbot {
    constructor() {
        this.container = document.getElementById('chatbot');
        this.toggle = document.getElementById('chatbotToggle');
        this.window = document.getElementById('chatbotWindow');
        this.closeBtn = document.getElementById('chatbotClose');
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.input = document.getElementById('chatbotInput');
        this.sendBtn = document.getElementById('chatbotSend');
        this.suggestions = document.getElementById('chatbotSuggestions');
        this.badge = document.querySelector('.chatbot-badge');
        
        this.isOpen = false;
        this.isTyping = false;
        this.conversationHistory = [];
        
        this.init();
    }
    
    init() {
        // Toggle chatbot
        this.toggle.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat());
        
        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.input.value = btn.dataset.query;
                this.sendMessage();
            });
        });
        
        // Initial greeting (delayed) – respects current language
        setTimeout(() => {
            const isAr = typeof getCurrentLanguage === 'function' && getCurrentLanguage() === 'ar';
            this.addBotMessage(isAr
                ? "أهلاً! 👋 أنا مساعدك في أثاث الحاجي. كيف يمكنني مساعدتك اليوم؟"
                : "Hello! 👋 I'm your Alhaji Furniture assistant. How can I help you today?"
            );
        }, 1000);

        // Re-greet and update placeholder when language changes
        window.addEventListener('languageChanged', (e) => {
            const lang = e.detail.language;
            if (this.input) {
                this.input.placeholder = lang === 'ar' ? 'اكتب رسالتك...' : 'Type your message...';
            }
        });
    }
    
    toggleChat() {
        this.isOpen = !this.isOpen;
        this.window.classList.toggle('open', this.isOpen);
        this.toggle.classList.toggle('hidden', this.isOpen);
        
        if (this.isOpen) {
            this.badge.style.display = 'none';
            this.input.focus();
        }
    }
    
    sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addUserMessage(message);
        this.input.value = '';
        
        // Hide suggestions after first message
        this.suggestions.style.display = 'none';
        
        // Show typing indicator
        this.showTyping();
        
        // Process and respond (with delay for realism)
        setTimeout(() => {
            this.hideTyping();
            const response = this.getResponse(message);
            this.addBotMessage(response);
        }, 1000 + Math.random() * 1000);
    }
    
    addUserMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message user-message';
        messageEl.innerHTML = `
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
        
        this.conversationHistory.push({ role: 'user', content: message });
    }
    
    addBotMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message bot-message';
        messageEl.innerHTML = `
            <div class="message-avatar">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=haji" alt="Bot">
            </div>
            <div class="message-content">
                <p>${this.formatMessage(message)}</p>
            </div>
        `;
        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
        
        this.conversationHistory.push({ role: 'bot', content: message });
    }
    
    showTyping() {
        this.isTyping = true;
        const typingEl = document.createElement('div');
        typingEl.className = 'message bot-message typing';
        typingEl.id = 'typingIndicator';
        typingEl.innerHTML = `
            <div class="message-avatar">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=haji" alt="Bot">
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        this.messagesContainer.appendChild(typingEl);
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.isTyping = false;
        const typingEl = document.getElementById('typingIndicator');
        if (typingEl) typingEl.remove();
    }
    
    getResponse(message) {
        const isAr = typeof getCurrentLanguage === 'function' && getCurrentLanguage() === 'ar';
        const activeKB = isAr ? knowledgeBaseAr : knowledgeBase;
        const activeDefaults = isAr ? defaultResponsesAr : defaultResponses;
        // Arabic is case-insensitive by nature; English needs toLowerCase
        const normalised = isAr ? message : message.toLowerCase();

        // Check each category in the active knowledge base
        for (const category in activeKB) {
            const { patterns, responses } = activeKB[category];
            for (const pattern of patterns) {
                if (normalised.includes(pattern)) {
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
        }

        // Check for product-specific queries
        if (this.containsProductQuery(normalised, isAr)) {
            return this.getProductResponse(normalised, isAr);
        }

        // Default response
        return activeDefaults[Math.floor(Math.random() * activeDefaults.length)];
    }

    containsProductQuery(message, isAr = false) {
        if (isAr) {
            const arKeywords = ['أريكة الراحة', 'سرير كينج أنيق', 'طاولة طعام فخمة', 'كرسي إرغونومي', 'مكتب قائم'];
            return arKeywords.some(keyword => message.includes(keyword));
        }
        const productKeywords = ['modern comfort', 'elegant king', 'executive dining', 'ergonomic', 'scandinavian', 'standing desk'];
        return productKeywords.some(keyword => message.includes(keyword));
    }

    getProductResponse(message, isAr = false) {
        if (isAr) {
            if (message.includes('أريكة') || message.includes('كنبة')) {
                return "🛋️ **أريكة الراحة العصرية** - 25,000 ج.م\n\n• تنجيد مخمل فاخر\n• تصميم 3 مقاعد\n• إطار خشبي صلب\n• متاحة بـ 5 ألوان\n• ⭐ 4.8/5 (124 تقييم)\n\nهل تريد إضافتها للسلة؟";
            }
            if (message.includes('سرير') || message.includes('تخت')) {
                return "🛏️ **سرير كينج أنيق** - 18,000 ج.م\n\n• بناء من خشب البلوط الصلب\n• تصميم عصري بسيط\n• سهل التركيب\n• يناسب مرتبة كينج قياسية\n• ⭐ 4.9/5 (89 تقييم)\n\nهل تريد إضافته للسلة؟";
            }
            return "اختيار رائع! هذه من قطعنا الشهيرة. هل تريد تفاصيل أكثر أو تريد إضافتها للسلة؟";
        }
        if (message.includes('modern comfort') || message.includes('sofa')) {
            return "🛋️ **Modern Comfort Sofa** - 25,000 EGP\n\n• Premium velvet upholstery\n• 3-seater design\n• Solid wood frame\n• Available in 5 colors\n• ⭐ 4.8/5 (124 reviews)\n\nWould you like to add it to your cart?";
        }
        if (message.includes('elegant king') || message.includes('bed frame')) {
            return "🛏️ **Elegant King Bed Frame** - 18,000 EGP\n\n• Solid oak construction\n• Modern minimalist design\n• Easy assembly\n• Fits standard king mattress\n• ⭐ 4.9/5 (89 reviews)\n\nShall I add it to your cart?";
        }
        return "Great choice! That's one of our popular items. Would you like more details or help adding it to your cart?";
    }
    
    formatMessage(message) {
        // Convert markdown-like formatting to HTML
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '&bull; ');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.hajiChatbot = new HajiChatbot();
});
