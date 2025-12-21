// Firebase Configuration for Alhaji Furniture
// Real-time database for syncing products, orders, and data across all devices



// ============ FIREBASE SETUP INSTRUCTIONS ============
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Go to Project Settings > General > Your apps > Web app
// 4. Register a new web app
// 5. Copy your config values below
// 6. Go to Realtime Database > Create Database > Start in test mode
// 7. Set rules to allow read/write (for development)

// Replace these values with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyDyugsXS2er0XO8RPM-ovwhHT7dKm-noZQ",
  authDomain: "alhaji-furniture.firebaseapp.com",
  projectId: "alhaji-furniture",
  storageBucket: "alhaji-furniture.firebasestorage.app",
  messagingSenderId: "182252082930",
  appId: "1:182252082930:web:93e3b39ac44265177ba26b",
  measurementId: "G-PFFSKDRNF3"
};




// Check if Firebase config is set up
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

// Initialize Firebase (will be done after SDK loads)
let firebaseDB = null;
let firebaseInitialized = false;

function initializeFirebase() {
    if (!isFirebaseConfigured) {
        console.warn('Firebase not configured. Using localStorage fallback.');
        console.info('To enable real-time sync, update firebase-config.js with your Firebase credentials.');
        return false;
    }
    
    try {
        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        firebaseDB = firebase.database();
        firebaseInitialized = true;
        console.log('✅ Firebase initialized successfully - Real-time sync enabled!');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

// ============ REAL-TIME DATABASE OPERATIONS ============

// Products
const FirebaseProducts = {
    ref: () => firebaseDB?.ref('products'),
    
    // Get all products (one-time)
    async getAll() {
        if (!firebaseInitialized) return null;
        try {
            const snapshot = await this.ref().once('value');
            const data = snapshot.val();
            return data ? Object.values(data) : [];
        } catch (error) {
            console.error('Error getting products:', error);
            return null;
        }
    },
    
    // Set all products
    async setAll(products) {
        if (!firebaseInitialized) return false;
        try {
            // Convert array to object with id as key for better Firebase structure
            const productsObj = {};
            products.forEach(p => {
                productsObj[p.id] = p;
            });
            await this.ref().set(productsObj);
            return true;
        } catch (error) {
            console.error('Error setting products:', error);
            return false;
        }
    },
    
    // Add single product
    async add(product) {
        if (!firebaseInitialized) return false;
        try {
            await this.ref().child(product.id).set(product);
            return true;
        } catch (error) {
            console.error('Error adding product:', error);
            return false;
        }
    },
    
    // Update single product
    async update(productId, updates) {
        if (!firebaseInitialized) return false;
        try {
            await this.ref().child(productId).update(updates);
            return true;
        } catch (error) {
            console.error('Error updating product:', error);
            return false;
        }
    },
    
    // Delete single product
    async delete(productId) {
        if (!firebaseInitialized) return false;
        try {
            await this.ref().child(productId).remove();
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            return false;
        }
    },
    
    // Listen for real-time changes
    onChanged(callback) {
        if (!firebaseInitialized) return null;
        return this.ref().on('value', (snapshot) => {
            const data = snapshot.val();
            const products = data ? Object.values(data) : [];
            callback(products);
        });
    },
    
    // Stop listening
    offChanged() {
        if (!firebaseInitialized) return;
        this.ref().off('value');
    }
};

// Orders
const FirebaseOrders = {
    ref: () => firebaseDB?.ref('orders'),
    
    async getAll() {
        if (!firebaseInitialized) return null;
        try {
            const snapshot = await this.ref().once('value');
            const data = snapshot.val();
            return data ? Object.values(data) : [];
        } catch (error) {
            console.error('Error getting orders:', error);
            return null;
        }
    },
    
    async setAll(orders) {
        if (!firebaseInitialized) return false;
        try {
            const ordersObj = {};
            orders.forEach(o => {
                ordersObj[o.id] = o;
            });
            await this.ref().set(ordersObj);
            return true;
        } catch (error) {
            console.error('Error setting orders:', error);
            return false;
        }
    },
    
    async add(order) {
        if (!firebaseInitialized) return false;
        try {
            await this.ref().child(order.id).set(order);
            return true;
        } catch (error) {
            console.error('Error adding order:', error);
            return false;
        }
    },
    
    async update(orderId, updates) {
        if (!firebaseInitialized) return false;
        try {
            await this.ref().child(orderId).update(updates);
            return true;
        } catch (error) {
            console.error('Error updating order:', error);
            return false;
        }
    },
    
    onChanged(callback) {
        if (!firebaseInitialized) return null;
        return this.ref().on('value', (snapshot) => {
            const data = snapshot.val();
            const orders = data ? Object.values(data) : [];
            callback(orders);
        });
    },
    
    offChanged() {
        if (!firebaseInitialized) return;
        this.ref().off('value');
    }
};

// Customers
const FirebaseCustomers = {
    ref: () => firebaseDB?.ref('customers'),
    
    async getAll() {
        if (!firebaseInitialized) return null;
        try {
            const snapshot = await this.ref().once('value');
            const data = snapshot.val();
            return data ? Object.values(data) : [];
        } catch (error) {
            console.error('Error getting customers:', error);
            return null;
        }
    },
    
    async setAll(customers) {
        if (!firebaseInitialized) return false;
        try {
            const customersObj = {};
            customers.forEach(c => {
                customersObj[c.id] = c;
            });
            await this.ref().set(customersObj);
            return true;
        } catch (error) {
            console.error('Error setting customers:', error);
            return false;
        }
    },
    
    async add(customer) {
        if (!firebaseInitialized) return false;
        try {
            await this.ref().child(customer.id).set(customer);
            return true;
        } catch (error) {
            console.error('Error adding customer:', error);
            return false;
        }
    },
    
    onChanged(callback) {
        if (!firebaseInitialized) return null;
        return this.ref().on('value', (snapshot) => {
            const data = snapshot.val();
            const customers = data ? Object.values(data) : [];
            callback(customers);
        });
    },
    
    offChanged() {
        if (!firebaseInitialized) return;
        this.ref().off('value');
    }
};

// Messages
const FirebaseMessages = {
    ref: () => firebaseDB?.ref('messages'),
    
    async getAll() {
        if (!firebaseInitialized) return null;
        try {
            const snapshot = await this.ref().once('value');
            const data = snapshot.val();
            return data ? Object.values(data) : [];
        } catch (error) {
            console.error('Error getting messages:', error);
            return null;
        }
    },
    
    async add(message) {
        if (!firebaseInitialized) return false;
        try {
            await this.ref().child(message.id).set(message);
            return true;
        } catch (error) {
            console.error('Error adding message:', error);
            return false;
        }
    },
    
    async update(messageId, updates) {
        if (!firebaseInitialized) return false;
        try {
            await this.ref().child(messageId).update(updates);
            return true;
        } catch (error) {
            console.error('Error updating message:', error);
            return false;
        }
    },
    
    async delete(messageId) {
        if (!firebaseInitialized) return false;
        try {
            await this.ref().child(messageId).remove();
            return true;
        } catch (error) {
            console.error('Error deleting message:', error);
            return false;
        }
    },
    
    onChanged(callback) {
        if (!firebaseInitialized) return null;
        return this.ref().on('value', (snapshot) => {
            const data = snapshot.val();
            const messages = data ? Object.values(data) : [];
            callback(messages);
        });
    },
    
    offChanged() {
        if (!firebaseInitialized) return;
        this.ref().off('value');
    }
};

// Cart (per user - uses localStorage key as user ID for demo)
const FirebaseCart = {
    getUserId() {
        let visitorId = localStorage.getItem('eidFurnitureVisitorId');
        if (!visitorId) {
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('eidFurnitureVisitorId', visitorId);
        }
        return visitorId;
    },
    
    ref() {
        return firebaseDB?.ref(`carts/${this.getUserId()}`);
    },
    
    async get() {
        if (!firebaseInitialized) return null;
        try {
            const snapshot = await this.ref().once('value');
            return snapshot.val() || [];
        } catch (error) {
            console.error('Error getting cart:', error);
            return null;
        }
    },
    
    async set(cart) {
        if (!firebaseInitialized) return false;
        try {
            await this.ref().set(cart);
            return true;
        } catch (error) {
            console.error('Error setting cart:', error);
            return false;
        }
    },
    
    onChanged(callback) {
        if (!firebaseInitialized) return null;
        return this.ref().on('value', (snapshot) => {
            const cart = snapshot.val() || [];
            callback(cart);
        });
    },
    
    offChanged() {
        if (!firebaseInitialized) return;
        this.ref().off('value');
    }
};

// ============ SYNC STATUS INDICATOR ============
function createSyncIndicator() {
    // Don't create if already exists
    if (document.getElementById('syncIndicator')) return;
    
    const indicator = document.createElement('div');
    indicator.id = 'syncIndicator';
    indicator.innerHTML = `
        <style>
            #syncIndicator {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: var(--bg-card, #1a1a2e);
                border: 1px solid var(--border-color, #333);
                border-radius: 25px;
                padding: 8px 16px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                color: var(--text-secondary, #888);
                z-index: 9999;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
            }
            #syncIndicator.synced {
                border-color: #10b981;
            }
            #syncIndicator.syncing {
                border-color: #f59e0b;
            }
            #syncIndicator.offline {
                border-color: #ef4444;
            }
            #syncIndicator .sync-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #888;
            }
            #syncIndicator.synced .sync-dot {
                background: #10b981;
                box-shadow: 0 0 10px #10b981;
            }
            #syncIndicator.syncing .sync-dot {
                background: #f59e0b;
                animation: pulse 1s infinite;
            }
            #syncIndicator.offline .sync-dot {
                background: #ef4444;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            #syncIndicator:hover {
                transform: translateY(-2px);
            }
        </style>
        <span class="sync-dot"></span>
        <span class="sync-text">Checking...</span>
    `;
    document.body.appendChild(indicator);
}

function updateSyncStatus(status, message) {
    const indicator = document.getElementById('syncIndicator');
    if (!indicator) return;
    
    indicator.className = '';
    indicator.classList.add(status);
    indicator.querySelector('.sync-text').textContent = message;
}

// ============ INITIALIZATION HELPER ============
async function initFirebaseSync() {
    // Only show sync indicator and initialize if Firebase is configured
    if (!isFirebaseConfigured) {
        console.log('📦 Using localStorage (Firebase not configured)');
        return false;
    }
    
    createSyncIndicator();
    updateSyncStatus('syncing', 'Connecting...');
    
    const success = initializeFirebase();
    
    if (success) {
        // Test connection
        try {
            await firebaseDB.ref('.info/connected').once('value');
            updateSyncStatus('synced', 'Real-time sync active');
            
            // Monitor connection status
            firebaseDB.ref('.info/connected').on('value', (snapshot) => {
                if (snapshot.val() === true) {
                    updateSyncStatus('synced', 'Real-time sync active');
                } else {
                    updateSyncStatus('offline', 'Reconnecting...');
                }
            });
            
            return true;
        } catch (error) {
            updateSyncStatus('offline', 'Connection failed');
            return false;
        }
    } else {
        updateSyncStatus('offline', 'Firebase error');
        return false;
    }
}

// Export for use in other files
window.FirebaseProducts = FirebaseProducts;
window.FirebaseOrders = FirebaseOrders;
window.FirebaseCustomers = FirebaseCustomers;
window.FirebaseMessages = FirebaseMessages;
window.FirebaseCart = FirebaseCart;
window.initFirebaseSync = initFirebaseSync;
window.firebaseInitialized = () => firebaseInitialized;
window.isFirebaseConfigured = isFirebaseConfigured;
