// Eid Furniture AI Chatbot

// Knowledge Base for the chatbot
const knowledgeBase = {
    greetings: {
        patterns: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings'],
        responses: [
            "Hello! 👋 Welcome to Eid Furniture. How can I help you today?",
            "Hi there! I'm your Eid Furniture assistant. What can I do for you?",
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
            "📞 **Contact Us**:\n\n• **Phone**: +20 2 2275 1234\n• **Email**: info@eidfurniture.com\n• **Hours**: Sat-Thu 10AM-10PM, Fri 2PM-10PM\n• **Address**: Abbas Al-Akkad St., Nasr City, Cairo\n\nOr fill out our contact form on the website!"
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
            "✨ **Custom Orders**:\n\nYes! We offer custom furniture:\n• Choose your dimensions\n• Select fabrics and colors\n• Custom finishes available\n• Delivery in 4-6 weeks\n\nContact us at custom@eidfurniture.com to discuss your vision!"
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
            "Goodbye! 👋 Thanks for chatting with Eid Furniture. Have a great day!",
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
    "I'm still learning! For complex questions, please contact our support team at +20 2 2275 1234 or info@eidfurniture.com 📞"
];

// Chatbot Class
class EidChatbot {
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
        
        // Initial greeting (delayed)
        setTimeout(() => {
            this.addBotMessage("Hello! 👋 I'm your Eid Furniture assistant. How can I help you today?");
        }, 1000);
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
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=eid" alt="Bot">
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
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=eid" alt="Bot">
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
        const lowerMessage = message.toLowerCase();
        
        // Check each category in knowledge base
        for (const category in knowledgeBase) {
            const { patterns, responses } = knowledgeBase[category];
            
            for (const pattern of patterns) {
                if (lowerMessage.includes(pattern)) {
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
        }
        
        // Check for product-specific queries
        if (this.containsProductQuery(lowerMessage)) {
            return this.getProductResponse(lowerMessage);
        }
        
        // Default response
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    containsProductQuery(message) {
        const productKeywords = ['modern comfort', 'elegant king', 'executive dining', 'ergonomic', 'scandinavian', 'standing desk'];
        return productKeywords.some(keyword => message.includes(keyword));
    }
    
    getProductResponse(message) {
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
    window.eidChatbot = new EidChatbot();
});
