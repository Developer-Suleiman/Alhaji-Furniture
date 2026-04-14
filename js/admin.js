// Robust event listener for Save Product button (guaranteed for deployment)
document.addEventListener('DOMContentLoaded', function() {
    function attachSaveProductListener() {
        const saveBtn = document.getElementById('saveProduct');
        if (saveBtn) {
            saveBtn.onclick = async function() {
                try {
                    if (typeof firebase === 'undefined' || !window.firebaseInitialized || !window.firebaseInitialized()) {
                        showAdminToast('Firebase is not connected. Please check your internet or Firebase config.', 'error');
                        console.error('Firebase not initialized or unavailable.');
                        return;
                    }
                    await saveProduct();
                } catch (err) {
                    showAdminToast('Error saving product: ' + (err.message || err), 'error');
                    console.error('Error in saveProduct:', err);
                }
            };
        } else {
            // Try again in 500ms if not found (handles dynamic modals)
            setTimeout(attachSaveProductListener, 500);
        }
    }
    attachSaveProductListener();
});
// Guarantee Save Product button event listener is attached after DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveProduct');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            try {
                await saveProduct();
            } catch (err) {
                showAdminToast('Error saving product: ' + (err.message || err), 'error');
                console.error('Error in saveProduct:', err);
            }
        });
    }
});
// Admin Panel JavaScript

// ============ FIREBASE REAL-TIME SYNC ============
let useFirebase = false;
let firebaseListenersActive = false;

// ============ STORAGE KEYS ============
const STORAGE_KEYS = {
    products: 'eidFurnitureProducts',
    orders: 'eidFurnitureOrders',
    customers: 'eidFurnitureCustomers',
    messages: 'eidFurnitureMessages',
    reviews: 'eidFurnitureReviews',
    users: 'eidFurnitureUsers',
    adminAuth: 'eidFurnitureAdminAuth'
};

// Legacy keys for backward compatibility
const PRODUCTS_STORAGE_KEY = STORAGE_KEYS.products;
const ORDERS_STORAGE_KEY = STORAGE_KEYS.orders;
const CUSTOMERS_STORAGE_KEY = STORAGE_KEYS.customers;
const MESSAGES_STORAGE_KEY = STORAGE_KEYS.messages;
const REVIEWS_STORAGE_KEY = STORAGE_KEYS.reviews;
const ADMIN_AUTH_KEY = STORAGE_KEYS.adminAuth;

// ============ ADMIN AUTHENTICATION ============
const DEFAULT_ADMIN_CREDENTIALS = {
    email: 'admin@hajifurniture.com',
    password: 'admin123'
};

// Load saved credentials from localStorage, fallback to defaults
function getAdminCredentials() {
    const saved = localStorage.getItem('eidFurnitureAdminCredentials');
    if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
    }
    return { ...DEFAULT_ADMIN_CREDENTIALS };
}

function saveAdminCredentials(creds) {
    localStorage.setItem('eidFurnitureAdminCredentials', JSON.stringify(creds));
}

// Mutable credentials object
let ADMIN_CREDENTIALS = getAdminCredentials();

// Check admin authentication
function checkAdminAuth() {
    const isAuthenticated = sessionStorage.getItem(ADMIN_AUTH_KEY) || localStorage.getItem(ADMIN_AUTH_KEY);
    const loginOverlay = document.getElementById('adminLoginOverlay');
    
    if (!isAuthenticated) {
        loginOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        loginOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Handle admin login
function setupAdminLogin() {
    const loginForm = document.getElementById('adminLoginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('adminEmail');
        const passwordInput = document.getElementById('adminPassword');
        const remember = document.getElementById('rememberAdmin').checked;
        const errorDiv = document.getElementById('loginError');
        
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        
        console.log('Login attempt:', email); // Debug log
        
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            // Login successful
            console.log('Login successful!');
            if (remember) {
                localStorage.setItem(ADMIN_AUTH_KEY, 'true');
            } else {
                sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
            }
            
            document.getElementById('adminLoginOverlay').style.display = 'none';
            document.body.style.overflow = 'auto';
            errorDiv.style.display = 'none';
            
            // Initialize admin panel
            initializeAdminPanel();
        } else {
            // Login failed
            console.log('Login failed. Expected:', ADMIN_CREDENTIALS.email, 'Got:', email);
            errorDiv.style.display = 'flex';
            passwordInput.value = '';
        }
    });
}

// Logout admin
function logoutAdmin() {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    window.location.reload();
}

// Navigate to section (used by profile dropdown)
function navigateToSection(sectionId) {
    event.preventDefault();
    
    // Update active nav item
    const currentActive = document.querySelector('.nav-item.active');
    if (currentActive) currentActive.classList.remove('active');
    
    const targetNav = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
    if (targetNav) targetNav.classList.add('active');
    
    // Show corresponding section
    const currentSection = document.querySelector('.content-section.active');
    if (currentSection) currentSection.classList.remove('active');
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');
    
    // Close profile dropdown by clicking elsewhere
    document.body.click();
}

// Initialize profile form handlers
function initProfileHandlers() {
    const profileForm = document.getElementById('adminProfileForm');
    const passwordForm = document.getElementById('changePasswordForm');
    
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('adminFullName').value.trim();
            const phone = document.getElementById('adminPhone').value.trim();
            const email = document.getElementById('adminProfileEmail').value.trim();
            
            // Save profile to localStorage
            localStorage.setItem('eidFurnitureAdminProfile', JSON.stringify({ name, phone }));
            
            // Save email to credentials
            if (email && email !== ADMIN_CREDENTIALS.email) {
                ADMIN_CREDENTIALS.email = email;
                saveAdminCredentials(ADMIN_CREDENTIALS);
            }
            
            // Update header
            const nameEl = document.querySelector('.admin-profile .name');
            if (nameEl && name) nameEl.textContent = name;
            
            showAdminToast('Profile updated successfully!', 'success');
        });
    }
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const current = document.getElementById('currentPassword').value;
            const newPass = document.getElementById('newPassword').value;
            const confirm = document.getElementById('confirmPassword').value;
            
            if (current !== ADMIN_CREDENTIALS.password) {
                showAdminToast('Current password is incorrect', 'error');
                return;
            }
            
            if (newPass.length < 6) {
                showAdminToast('New password must be at least 6 characters', 'error');
                return;
            }
            
            if (newPass !== confirm) {
                showAdminToast('Passwords do not match', 'error');
                return;
            }
            
            // Save new password
            ADMIN_CREDENTIALS.password = newPass;
            saveAdminCredentials(ADMIN_CREDENTIALS);
            showAdminToast('Password updated successfully!', 'success');
            passwordForm.reset();
        });
    }
    
    // Load saved profile data
    const savedProfile = JSON.parse(localStorage.getItem('eidFurnitureAdminProfile') || '{}');
    if (savedProfile.name) {
        const nameInput = document.getElementById('adminFullName');
        if (nameInput) nameInput.value = savedProfile.name;
        
        const nameEl = document.querySelector('.admin-profile .name');
        if (nameEl) nameEl.textContent = savedProfile.name;
    }
    if (savedProfile.phone) {
        const phoneInput = document.getElementById('adminPhone');
        if (phoneInput) phoneInput.value = savedProfile.phone;
    }
    // Load saved email from credentials
    const profileEmailInput = document.getElementById('adminProfileEmail');
    if (profileEmailInput) profileEmailInput.value = ADMIN_CREDENTIALS.email;
}

// ============ PRODUCTS MANAGEMENT ============
// No default products - all products are admin-managed
const defaultProducts = [];

// Get products - with Firebase fallback to localStorage
function getProducts() {
    console.log('getProducts called');
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    console.log('Stored products:', stored ? 'exists' : 'null');
    
    if (stored) {
        try {
            const products = JSON.parse(stored);
            console.log('Parsed products count:', products ? products.length : 0);
            // Always return an array
            if (Array.isArray(products)) {
                return products;
            }
        } catch (e) {
            console.error('Error parsing products:', e);
        }
    }
    
    // No products found - initialize empty array in localStorage and return it
    console.log('No products found, initializing empty array');
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify([]));
    return [];
}

// Save products - to both localStorage and Firebase
async function saveProductsToStorage(productsArray) {
    // Always save to localStorage (offline backup)
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsArray));
    
    // Save to Firebase if available
    if (useFirebase && window.FirebaseProducts) {
        try {
            await window.FirebaseProducts.setAll(productsArray);
            console.log('✅ Products synced to Firebase');
        } catch (error) {
            console.error('Firebase sync error:', error);
        }
    }
}

// Add single product with Firebase sync
async function addProductWithSync(product) {
    adminProducts.push(product);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(adminProducts));
    
    if (useFirebase && window.FirebaseProducts) {
        await window.FirebaseProducts.add(product);
    }
}

// Update single product with Firebase sync  
async function updateProductWithSync(productId, updates) {
    const index = adminProducts.findIndex(p => p.id === productId);
    if (index !== -1) {
        adminProducts[index] = { ...adminProducts[index], ...updates };
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(adminProducts));
        
        if (useFirebase && window.FirebaseProducts) {
            await window.FirebaseProducts.update(productId, updates);
        }
    }
}

// Delete product with Firebase sync
async function deleteProductWithSync(productId) {
    adminProducts = adminProducts.filter(p => p.id !== productId);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(adminProducts));
    
    if (useFirebase && window.FirebaseProducts) {
        await window.FirebaseProducts.delete(productId);
    }
}

let adminProducts = getProducts();

// ============ ORDERS MANAGEMENT ============
function getOrders() {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

function saveOrders(ordersArray) {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(ordersArray));
}

let orders = getOrders();

// ============ CUSTOMERS MANAGEMENT ============
function getCustomers() {
    const stored = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // Get from registered users
    const users = JSON.parse(localStorage.getItem('eidFurnitureUsers') || '[]');
    return users.map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        phone: u.phone || '',
        orders: 0,
        totalSpent: 0,
        avatar: u.avatar || null,
        joinedAt: u.createdAt
    }));
}

function saveCustomers(customersArray) {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customersArray));
}

let customers = getCustomers();

// ============ MESSAGES MANAGEMENT ============
function getMessages() {
    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

function saveMessages(messagesArray) {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messagesArray));
}

// Format timestamp to relative time
function formatRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(timestamp).toLocaleDateString();
}

// Current messages array (loaded from storage)
let messages = getMessages();

// Initialize Admin Panel on page load
document.addEventListener('DOMContentLoaded', () => {
    // Setup login form handler first
    setupAdminLogin();
    
    // Check admin authentication
    checkAdminAuth();
    
    // Always initialize sidebar for mobile reliability
    initSidebar();
    // Only initialize full admin panel if authenticated
    const isAuthenticated = sessionStorage.getItem(ADMIN_AUTH_KEY) || localStorage.getItem(ADMIN_AUTH_KEY);
    if (isAuthenticated) {
        initializeAdminPanel();
    }
});

// Initialize all admin panel components
function initializeAdminPanel() {
    initSidebar();
    initNavigation();
    initProfileHandlers();
    initNotifications();
    initGlobalSearch();
    loadDashboard();
    loadProducts();
    loadOrders();
    loadCustomers();
    loadMessages();
    initCharts();
    initMessageRefresh();


    // Disable Save Product button until Firebase is ready and attach event listener after
    const saveBtn = document.getElementById('saveProduct');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Connecting...';
    }

    // Initialize Firebase real-time sync
    initFirebaseRealTimeSync().then(() => {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Product';
            // Remove any previous listeners to avoid duplicates
            saveBtn.replaceWith(saveBtn.cloneNode(true));
            const newSaveBtn = document.getElementById('saveProduct');
            newSaveBtn.addEventListener('click', async () => {
                try {
                    await saveProduct();
                } catch (err) {
                    showAdminToast('Error saving product: ' + (err.message || err), 'error');
                    console.error('Error in saveProduct:', err);
                }
            });
        }
    }).catch((err) => {
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Sync Failed';
        }
        showAdminToast('Firebase sync failed: ' + (err.message || err), 'error');
        console.error('Firebase sync failed:', err);
    });

    // Setup admin logout button
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutAdmin);
    }
}

// Initialize Firebase real-time sync
async function initFirebaseRealTimeSync() {
    // Check if Firebase is available and configured
    if (typeof window.initFirebaseSync === 'function') {
        const success = await window.initFirebaseSync();
        
        if (success && window.firebaseInitialized && window.firebaseInitialized()) {
            useFirebase = true;
            console.log('🔥 Firebase real-time sync enabled for admin panel');
            
            // Setup real-time listeners
            setupFirebaseListeners();
            
            // Initial sync from Firebase
            await syncFromFirebase();
        } else {
            console.log('📦 Using localStorage (Firebase not configured)');
        }
    }
}

// Setup Firebase real-time listeners
function setupFirebaseListeners() {
    if (firebaseListenersActive) return;
    
    // Products listener - auto-update when data changes
    if (window.FirebaseProducts) {
        window.FirebaseProducts.onChanged((products) => {
            console.log('🔄 Products updated from Firebase:', products.length);
            if (products.length > 0) {
                adminProducts = products;
                localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
                loadProducts();
                loadDashboard();
                showSyncNotification('Products synced');
            }
        });
    }
    
    // Orders listener
    if (window.FirebaseOrders) {
        window.FirebaseOrders.onChanged((orders) => {
            console.log('🔄 Orders updated from Firebase:', orders.length);
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
            loadOrders();
            loadDashboard();
        });
    }
    
    // Messages listener
    if (window.FirebaseMessages) {
        window.FirebaseMessages.onChanged((msgs) => {
            console.log('🔄 Messages updated from Firebase:', msgs.length);
            localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(msgs));
            messages = msgs;
            loadMessages();
            updateUnreadCount();
        });
    }
    
    // Customers listener
    if (window.FirebaseCustomers) {
        window.FirebaseCustomers.onChanged((customers) => {
            console.log('🔄 Customers updated from Firebase:', customers.length);
            localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
            loadCustomers();
            loadDashboard();
        });
    }
    
    firebaseListenersActive = true;
}

// Initial sync from Firebase to localStorage
async function syncFromFirebase() {
    try {
        // Sync products
        const products = await window.FirebaseProducts.getAll();
        if (products && products.length > 0) {
            adminProducts = products;
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
        } else {
            // If Firebase is empty, push local data to Firebase
            await window.FirebaseProducts.setAll(adminProducts);
        }
        
        // Sync orders
        const orders = await window.FirebaseOrders.getAll();
        if (orders && orders.length > 0) {
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
        } else {
            const localOrders = getOrders();
            if (localOrders.length > 0) {
                await window.FirebaseOrders.setAll(localOrders);
            }
        }
        
        // Sync messages
        const msgs = await window.FirebaseMessages.getAll();
        if (msgs && msgs.length > 0) {
            localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(msgs));
            messages = msgs;
        }
        
        // Sync customers
        const customers = await window.FirebaseCustomers.getAll();
        if (customers && customers.length > 0) {
            localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
        }
        
        // Reload UI
        loadProducts();
        loadOrders();
        loadCustomers();
        loadMessages();
        loadDashboard();
        
        console.log('✅ Initial sync from Firebase complete');
    } catch (error) {
        console.error('Firebase sync error:', error);
    }
}

// Show sync notification
function showSyncNotification(message) {
    // Create subtle notification
    const notification = document.createElement('div');
    notification.className = 'sync-notification';
    notification.innerHTML = `<i class="fas fa-sync"></i> ${message}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 13px;
        z-index: 9999;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2s forwards;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
    `;
    
    // Add animation styles
    if (!document.getElementById('syncAnimStyles')) {
        const style = document.createElement('style');
        style.id = 'syncAnimStyles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
}

// ===== Global Search =====
function initGlobalSearch() {
    const searchInput = document.getElementById('globalSearch');
    const searchDropdown = document.getElementById('searchResultsDropdown');
    
    if (!searchInput || !searchDropdown) return;
    
    let debounceTimer;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            searchDropdown.classList.remove('show');
            return;
        }
        
        debounceTimer = setTimeout(() => {
            performGlobalSearch(query);
        }, 300);
    });
    
    searchInput.addEventListener('focus', (e) => {
        if (e.target.value.trim().length >= 2) {
            performGlobalSearch(e.target.value.trim());
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.classList.remove('show');
        }
    });
    
    // Handle keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchDropdown.classList.remove('show');
            searchInput.blur();
        }
    });
}

function performGlobalSearch(query) {
    const searchDropdown = document.getElementById('searchResultsDropdown');
    const searchLower = query.toLowerCase();
    
    const results = {
        products: [],
        orders: [],
        customers: [],
        messages: []
    };
    
    // Search products
    const products = getProducts();
    results.products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
    ).slice(0, 3);
    
    // Search orders
    const orders = getOrders();
    results.orders = orders.filter(o => 
        o.id.toLowerCase().includes(searchLower) ||
        o.customer.toLowerCase().includes(searchLower)
    ).slice(0, 3);
    
    // Search customers
    const users = JSON.parse(localStorage.getItem('eidFurnitureUsers') || '[]');
    results.customers = users.filter(u => 
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
    ).slice(0, 3);
    
    // Search messages
    const messages = getMessages();
    results.messages = messages.filter(m => 
        m.name.toLowerCase().includes(searchLower) ||
        m.subject.toLowerCase().includes(searchLower) ||
        m.email.toLowerCase().includes(searchLower)
    ).slice(0, 3);
    
    // Render results
    renderSearchResults(results, searchDropdown);
}

function renderSearchResults(results, dropdown) {
    const hasResults = results.products.length || results.orders.length || 
                       results.customers.length || results.messages.length;
    
    if (!hasResults) {
        dropdown.innerHTML = `
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <p>No results found</p>
            </div>
        `;
        dropdown.classList.add('show');
        return;
    }
    
    let html = '';
    
    // Products
    if (results.products.length) {
        html += '<div class="search-category">Products</div>';
        results.products.forEach(p => {
            html += `
                <div class="search-result-item" data-section="products" data-id="${p.id}">
                    <div class="search-result-icon product">
                        <i class="fas fa-couch"></i>
                    </div>
                    <div class="search-result-info">
                        <div class="title">${p.name}</div>
                        <div class="subtitle">${getCategoryDisplayName(p.category)} • ${p.price.toLocaleString()} EGP</div>
                    </div>
                </div>
            `;
        });
    }
    
    // Orders
    if (results.orders.length) {
        html += '<div class="search-category">Orders</div>';
        results.orders.forEach(o => {
            html += `
                <div class="search-result-item" data-section="orders" data-id="${o.id}">
                    <div class="search-result-icon order">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <div class="search-result-info">
                        <div class="title">Order #${o.id.slice(-6)}</div>
                        <div class="subtitle">${o.customer} • ${o.total.toLocaleString()} EGP</div>
                    </div>
                </div>
            `;
        });
    }
    
    // Customers
    if (results.customers.length) {
        html += '<div class="search-category">Customers</div>';
        results.customers.forEach(c => {
            html += `
                <div class="search-result-item" data-section="customers" data-id="${c.id}">
                    <div class="search-result-icon customer">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="search-result-info">
                        <div class="title">${c.name}</div>
                        <div class="subtitle">${c.email}</div>
                    </div>
                </div>
            `;
        });
    }
    
    // Messages
    if (results.messages.length) {
        html += '<div class="search-category">Messages</div>';
        results.messages.forEach(m => {
            html += `
                <div class="search-result-item" data-section="messages" data-id="${m.id}">
                    <div class="search-result-icon message">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="search-result-info">
                        <div class="title">${m.subject}</div>
                        <div class="subtitle">From: ${m.name}</div>
                    </div>
                </div>
            `;
        });
    }
    
    dropdown.innerHTML = html;
    dropdown.classList.add('show');
    
    // Add click handlers
    dropdown.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            dropdown.classList.remove('show');
            document.getElementById('globalSearch').value = '';
            navigateToSection(section);
        });
    });
}

// ===== Notification System =====
function initNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const viewAllBtn = document.getElementById('viewAllNotifications');
    
    if (!notificationBtn || !notificationDropdown) return;
    
    // Toggle dropdown
    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle('show');
        if (notificationDropdown.classList.contains('show')) {
            loadNotifications();
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
            notificationDropdown.classList.remove('show');
        }
    });
    
    // Mark all as read
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            markAllNotificationsRead();
            loadNotifications();
        });
    }
    
    // View all notifications
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            notificationDropdown.classList.remove('show');
            navigateToSection('messages');
        });
    }
    
    // Load initial notifications
    loadNotifications();
    updateNotificationBadge();
}

function getNotifications() {
    const orders = getOrders();
    const messages = getMessages();
    const reviews = JSON.parse(localStorage.getItem('eidFurnitureReviews') || '[]');
    
    const notifications = [];
    
    // Recent orders (last 5 pending/processing)
    const recentOrders = orders
        .filter(o => o.status === 'pending' || o.status === 'processing')
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        .slice(0, 3);
    
    recentOrders.forEach(order => {
        notifications.push({
            id: `order-${order.id}`,
            type: 'order',
            icon: 'fa-shopping-bag',
            message: `New order #${order.id.slice(-6)} from ${order.customer}`,
            amount: order.total,
            time: order.createdAt || order.date,
            read: false,
            section: 'orders'
        });
    });
    
    // Unread messages (last 3)
    const unreadMessages = messages
        .filter(m => !m.read && !m.archived)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    
    unreadMessages.forEach(msg => {
        notifications.push({
            id: `msg-${msg.id}`,
            type: 'message',
            icon: 'fa-envelope',
            message: `New message from ${msg.name}: "${msg.subject}"`,
            time: msg.date,
            read: false,
            section: 'messages'
        });
    });
    
    // Recent reviews (last 2)
    const recentReviews = reviews
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 2);
    
    recentReviews.forEach(review => {
        notifications.push({
            id: `review-${review.id}`,
            type: 'review',
            icon: 'fa-star',
            message: `${review.name} left a ${review.rating}-star review`,
            time: review.date,
            read: true,
            section: 'reviews'
        });
    });
    
    // Sort by time
    notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    return notifications;
}

function loadNotifications() {
    const notificationList = document.getElementById('notificationList');
    if (!notificationList) return;
    
    const notifications = getNotifications();
    
    if (notifications.length === 0) {
        notificationList.innerHTML = `
            <div class="notification-empty">
                <i class="fas fa-bell-slash"></i>
                <p>No notifications</p>
            </div>
        `;
        return;
    }
    
    notificationList.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.read ? '' : 'unread'}" data-section="${notif.section}">
            <div class="notification-icon ${notif.type}">
                <i class="fas ${notif.icon}"></i>
            </div>
            <div class="notification-content">
                <p>${notif.message}</p>
                <span class="time">${formatTimeAgo(notif.time)}</span>
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    notificationList.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            document.getElementById('notificationDropdown').classList.remove('show');
            navigateToSection(section);
        });
    });
    
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    
    const notifications = getNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;
    
    badge.textContent = unreadCount;
    badge.setAttribute('data-count', unreadCount);
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
}

function markAllNotificationsRead() {
    // Mark all messages as read
    const messages = getMessages();
    messages.forEach(m => m.read = true);
    localStorage.setItem('eidFurnitureMessages', JSON.stringify(messages));
    
    updateNotificationBadge();
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
}

// Auto-refresh messages every 5 seconds// Auto-refresh messages every 5 seconds to catch new customer messages
function initMessageRefresh() {
    // Check for new messages periodically
    setInterval(() => {
        const currentMessages = getMessages();
        const unreadCount = currentMessages.filter(m => !m.read && !m.archived).length;
        
        // Update badge
        const messageBadge = document.querySelector('.nav-item[data-section="messages"] .badge');
        if (messageBadge) {
            const currentBadgeCount = parseInt(messageBadge.textContent) || 0;
            if (unreadCount !== currentBadgeCount) {
                messageBadge.textContent = unreadCount;
                messageBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
                
                // If there are more messages than before, show notification
                if (unreadCount > currentBadgeCount) {
                    showNewMessageNotification(unreadCount - currentBadgeCount);
                }
            }
        }
        
        // If messages section is active, refresh the list
        if (document.getElementById('messages').classList.contains('active')) {
            const currentMsgCount = messages.length;
            messages = getMessages();
            
            // Only refresh UI if message count changed
            if (messages.length !== currentMsgCount) {
                loadMessages();
            }
        } else {
            // Just update the messages array
            messages = getMessages();
        }
    }, 5000);
    
    // Also listen for storage events from other tabs
    window.addEventListener('storage', (e) => {
        if (e.key === MESSAGES_STORAGE_KEY) {
            messages = getMessages();
            loadMessages();
            showNewMessageNotification(1);
        }
    });
}

// Show notification for new messages
function showNewMessageNotification(count) {
    showAdminToast(`${count} new message${count > 1 ? 's' : ''} received!`, 'info');
    
    // Play notification sound if available
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleogAAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleogAAAAA');
        audio.volume = 0.3;
        audio.play().catch(() => {});
    } catch (e) {}
}

// Sidebar Toggle
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    });
    
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
}

// Navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            
            // Update active nav item
            document.querySelector('.nav-item.active').classList.remove('active');
            item.classList.add('active');
            
            // Show corresponding section
            document.querySelector('.content-section.active').classList.remove('active');
            document.getElementById(section).classList.add('active');
            
            // Close mobile sidebar
            document.getElementById('sidebar').classList.remove('open');
            document.querySelector('.sidebar-overlay').classList.remove('active');
        });
    });
}

// Load Dashboard with REAL data
function loadDashboard() {
    // Get real data from storage
    adminProducts = getProducts();
    const realOrders = getOrders();
    const realCustomers = getCustomers();
    // const realStats = calculateRealStats(); // Disabled: function not defined
    const realStats = { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, totalProducts: 0 };
    
    // Update stat cards with real data
    const totalRevenueEl = document.getElementById('totalRevenue');
    const totalOrdersEl = document.getElementById('totalOrders');
    const totalCustomersEl = document.getElementById('totalCustomers');
    const totalProductsEl = document.getElementById('totalProducts');
    
    if (totalRevenueEl) totalRevenueEl.textContent = realStats.totalRevenue.toLocaleString() + ' EGP';
    if (totalOrdersEl) totalOrdersEl.textContent = realStats.totalOrders;
    if (totalCustomersEl) totalCustomersEl.textContent = realStats.totalCustomers;
    if (totalProductsEl) totalProductsEl.textContent = realStats.totalProducts;
    
    // Also update old selector format for backward compatibility
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const label = card.querySelector('.stat-info p')?.textContent?.toLowerCase() || '';
        const valueEl = card.querySelector('.stat-info h3');
        if (valueEl) {
            if (label.includes('revenue')) valueEl.textContent = realStats.totalRevenue.toLocaleString() + ' EGP';
            else if (label.includes('order')) valueEl.textContent = realStats.totalOrders;
            else if (label.includes('customer')) valueEl.textContent = realStats.totalCustomers;
            else if (label.includes('product')) valueEl.textContent = realStats.totalProducts;
        }
    });
    
    // Load recent orders (real data)
    const recentOrdersTable = document.getElementById('recentOrders');
    
    if (realOrders.length === 0) {
        recentOrdersTable.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="fas fa-inbox fa-2x mb-2 d-block opacity-50"></i>
                    No orders yet. Orders will appear here when customers make purchases.
                </td>
            </tr>
        `;
    } else {
        recentOrdersTable.innerHTML = realOrders.slice(0, 5).map(order => `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.customer}</td>
                <td>${order.items} item${order.items > 1 ? 's' : ''}</td>
                <td>${order.total.toLocaleString()} EGP</td>
                <td><span class="status-badge status-${order.status}">${capitalizeFirst(order.status)}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn-view" onclick="viewOrder('${order.id}')" title="View"><i class="fas fa-eye"></i></button>
                        <button class="btn-edit" onclick="updateOrderStatus('${order.id}')" title="Update Status"><i class="fas fa-edit"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// View order details
function viewOrder(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    showAdminToast(`Order ${orderId}: ${order.items} items, Total: ${order.total} EGP`, 'info');
}

// Update order status
function updateOrderStatus(orderId) {
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStatusIndex = statuses.indexOf(orders[orderIndex].status);
    const nextStatus = statuses[(currentStatusIndex + 1) % statuses.length];
    
    orders[orderIndex].status = nextStatus;
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    
    loadDashboard();
    loadOrders();
    showAdminToast(`Order ${orderId} status updated to ${capitalizeFirst(nextStatus)}`, 'success');
}

// Load Products
function loadProducts() {
    console.log('loadProducts called');
    // Refresh from localStorage
    adminProducts = getProducts();
    console.log('adminProducts count:', adminProducts ? adminProducts.length : 0);
    
    const productsTable = document.getElementById('productsTable');
    console.log('productsTable element:', productsTable ? 'found' : 'NOT FOUND');
    
    if (!productsTable) {
        console.error('productsTable element not found!');
        return;
    }
    
    // Always attach event listeners FIRST, before any early returns
    // Product search
    const searchInput = document.getElementById('productSearch');
    if (searchInput) {
        searchInput.removeEventListener('input', handleProductSearch);
        searchInput.addEventListener('input', handleProductSearch);
    }
    
    // Image file input handler
    const imageFileInput = document.getElementById('productImageFile');
    if (imageFileInput) {
        imageFileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('productImage').value = e.target.result;
                    const preview = document.getElementById('imagePreview');
                    const previewImg = document.getElementById('imagePreviewImg');
                    previewImg.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Save product handler - CRITICAL: must always be attached
    const saveBtn = document.getElementById('saveProduct');
    if (saveBtn) {
        console.log('✅ Attaching saveProduct event listener');
        saveBtn.removeEventListener('click', saveProduct);
        saveBtn.addEventListener('click', saveProduct);
    } else {
        console.error('❌ saveProduct button NOT FOUND!');
    }
    
    if (!adminProducts || adminProducts.length === 0) {
        console.warn('No products to display');
        productsTable.innerHTML = '<tr><td colspan="7" class="text-center">No products found. Click "Add Product" to add your first product!</td></tr>';
        return;
    }
    
    productsTable.innerHTML = adminProducts.map(product => {
        const status = product.stock > 0 ? 'instock' : 'outstock';
        return `
        <tr data-id="${product.id}">
            <td><input type="checkbox"></td>
            <td>
                <div class="product-cell">
                    <img src="${product.image}" alt="${product.name}">
                    <span class="product-name">${product.name}</span>
                </div>
            </td>
            <td>${getCategoryDisplayName(product.category)}</td>
            <td>${product.price.toLocaleString()} EGP</td>
            <td>${product.stock || 0}</td>
            <td><span class="status-badge status-${status}">${status === 'instock' ? 'In Stock' : 'Out of Stock'}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-view" title="View" onclick="viewProduct(${product.id})"><i class="fas fa-eye"></i></button>
                    <button class="btn-edit" title="Edit" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" title="Delete" onclick="deleteProductAdmin(${product.id})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `}).join('');
}

// Handle product search
function handleProductSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    filterProducts(searchTerm);
}

// View Product
function viewProduct(id) {
    const product = adminProducts.find(p => p.id === id);
    if (product) {
        alert(`Product: ${product.name}\nPrice: ${product.price} EGP\nStock: ${product.stock}\nCategory: ${product.category}\nDescription: ${product.description || 'No description'}`);
    }
}

// Edit Product
function editProduct(id) {
    const product = adminProducts.find(p => p.id === id);
    if (!product) return;
    
    // Fill form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productOriginalPrice').value = product.originalPrice || '';
    document.getElementById('productStock').value = product.stock || 0;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productImage').value = product.image;
    document.getElementById('productBadge').value = product.badge || '';
    
    // Show image preview when editing
    if (product.image) {
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('imagePreviewImg');
        previewImg.src = product.image;
        preview.style.display = 'block';
    }
    
    // Store editing ID
    document.getElementById('productForm').dataset.editingId = id;
    document.querySelector('#productModal .modal-title').textContent = 'Edit Product';
    
    // Open modal
    new bootstrap.Modal(document.getElementById('productModal')).show();
}

// Delete Product - with Firebase sync
async function deleteProductAdmin(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const index = adminProducts.findIndex(p => p.id === id);
    if (index !== -1) {
        adminProducts.splice(index, 1);
        
        // Save to localStorage
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(adminProducts));
        
        // Sync to Firebase
        if (useFirebase && window.FirebaseProducts) {
            await window.FirebaseProducts.delete(id);
            showAdminToast('Product deleted and synced!', 'success');
        } else {
            showAdminToast('Product deleted!', 'success');
        }
        
        loadProducts();
        loadDashboard();
    }
}

// Filter Products
function filterProducts(searchTerm) {
    const filtered = adminProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    
    const productsTable = document.getElementById('productsTable');
    productsTable.innerHTML = filtered.map(product => {
        const status = product.stock > 0 ? 'instock' : 'outstock';
        return `
        <tr data-id="${product.id}">
            <td><input type="checkbox"></td>
            <td>
                <div class="product-cell">
                    <img src="${product.image}" alt="${product.name}">
                    <span class="product-name">${product.name}</span>
                </div>
            </td>
            <td>${getCategoryDisplayName(product.category)}</td>
            <td>${product.price.toLocaleString()} EGP</td>
            <td>${product.stock || 0}</td>
            <td><span class="status-badge status-${status}">${status === 'instock' ? 'In Stock' : 'Out of Stock'}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-view" title="View" onclick="viewProduct(${product.id})"><i class="fas fa-eye"></i></button>
                    <button class="btn-edit" title="Edit" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" title="Delete" onclick="deleteProductAdmin(${product.id})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `}).join('');
}

// Save Product (Add or Update) - with Firebase sync
async function saveProduct() {
        console.log('saveProduct called');
    console.log('🔵 saveProduct() called!');
    
    const form = document.getElementById('productForm');
    console.log('Form element:', form);
    
    const editingId = form.dataset.editingId;
    const isEditing = !!editingId; // Store before we delete it
    console.log('Is Editing:', isEditing, 'Editing ID:', editingId);
    

    // Gather fields and values
    const fields = [
        { id: 'productName', label: 'Name', required: true },
        { id: 'productCategory', label: 'Category', required: true },
        { id: 'productPrice', label: 'Price', required: true },
        { id: 'productImage', label: 'Image', required: !document.getElementById('productForm').dataset.editingId },
        { id: 'productDescription', label: 'Description', required: true },
        { id: 'productStock', label: 'Stock', required: true },
    ];
    let firstInvalid = null;
    let missing = [];
    let formData = {};
    fields.forEach(f => {
        const el = document.getElementById(f.id);
        let value = el.value.trim();
        if (f.id === 'productPrice') value = parseFloat(value);
        if (f.id === 'productStock') value = parseInt(value);
        formData[f.id.replace('product', '').toLowerCase()] = value;
        // Remove previous highlight
        el.classList.remove('is-invalid');
        if (f.required && (!value || (f.id === 'productPrice' && isNaN(value)) || (f.id === 'productStock' && isNaN(value)))) {
            missing.push(f.label);
            el.classList.add('is-invalid');
            if (!firstInvalid) firstInvalid = el;
        }
    });
    if (missing.length > 0) {
        showAdminToast('Validation failed: ' + missing.join(', '), 'error');
        console.error('Validation failed: missing fields:', missing);
    }
    // Add optional fields
    formData.originalprice = parseFloat(document.getElementById('productOriginalPrice').value) || null;
    formData.badge = document.getElementById('productBadge').value.trim();

    // If missing, show detailed error
    if (missing.length > 0) {
        showAdminToast('Please fill in: ' + missing.join(', '), 'error');
        if (firstInvalid) firstInvalid.focus();
        return;
    }

    // Rename keys to match original structure
    formData = {
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        originalPrice: parseFloat(document.getElementById('productOriginalPrice').value) || null,
        stock: parseInt(document.getElementById('productStock').value) || 0,
        description: document.getElementById('productDescription').value.trim(),
        image: document.getElementById('productImage').value.trim() || undefined,
        badge: document.getElementById('productBadge').value.trim(),
    };
    
    console.log('✅ Validation passed!');
    
    let savedProduct = null;
    
    if (isEditing) {
        // Update existing product
        const index = adminProducts.findIndex(p => p.id === parseInt(editingId));
        if (index !== -1) {
            const updatedProduct = { 
                ...adminProducts[index], 
                ...formData 
            };
            adminProducts[index] = updatedProduct;
            savedProduct = updatedProduct;
            
            // Sync to Firebase
            if (useFirebase && window.FirebaseProducts) {
                await window.FirebaseProducts.update(parseInt(editingId), updatedProduct);
            }
        }
        delete form.dataset.editingId;
        document.querySelector('#productModal .modal-title').textContent = 'Add New Product';
    } else {
        // Add new product - make sure we keep existing products
        const newId = Math.max(...adminProducts.map(p => p.id), 0) + 1;
        const newProduct = {
            id: newId,
            rating: 5.0,
            reviews: 0,
            ...formData
        };
        
        // Important: Push to existing array, don't replace
        adminProducts.push(newProduct);
        savedProduct = newProduct;
        
        // Sync to Firebase
        if (useFirebase && window.FirebaseProducts) {
            await window.FirebaseProducts.add(newProduct);
        }
    }
    
    // Save to localStorage (shared with main site)
    console.log('💾 Saving to localStorage, adminProducts count:', adminProducts.length);
    console.log('💾 Products to save:', JSON.stringify(adminProducts));
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(adminProducts));
    console.log('💾 Saved! Verifying localStorage:', localStorage.getItem(PRODUCTS_STORAGE_KEY));
    
    // Close modal first
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    if (modal) modal.hide();
    form.reset();
    // Reset image preview and file input
    const preview = document.getElementById('imagePreview');
    if (preview) preview.style.display = 'none';
    const fileInput = document.getElementById('productImageFile');
    if (fileInput) fileInput.value = '';
    
    // Show success notification with product details
    console.log('🎉 Showing notification and reloading...');
    showProductSavedNotification(savedProduct, isEditing);
    
    // Reload table and dashboard
    loadProducts();
    loadDashboard();
}

// Show beautiful product saved notification
function showProductSavedNotification(product, isUpdate = false) {
    // Remove any existing notification
    const existing = document.getElementById('productSavedNotification');
    if (existing) existing.remove();
    
    // Add styles if not exists
    if (!document.getElementById('productNotifStyles')) {
        const style = document.createElement('style');
        style.id = 'productNotifStyles';
        style.textContent = `
            .product-saved-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.8);
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #10b981;
                border-radius: 20px;
                padding: 30px 40px;
                z-index: 100000;
                box-shadow: 0 25px 80px rgba(0,0,0,0.5), 0 0 40px rgba(16, 185, 129, 0.3);
                opacity: 0;
                animation: notifPopIn 0.5s ease forwards;
                text-align: center;
                max-width: 400px;
                width: 90%;
            }
            @keyframes notifPopIn {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                50% { transform: translate(-50%, -50%) scale(1.05); }
                100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            @keyframes notifPopOut {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
            .product-saved-notification .notif-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #10b981, #059669);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                animation: iconBounce 0.6s ease 0.3s;
            }
            @keyframes iconBounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
            .product-saved-notification .notif-icon i {
                font-size: 36px;
                color: white;
            }
            .product-saved-notification .notif-title {
                font-size: 24px;
                font-weight: 700;
                color: #10b981;
                margin-bottom: 10px;
            }
            .product-saved-notification .notif-product-name {
                font-size: 18px;
                color: #fff;
                margin-bottom: 5px;
            }
            .product-saved-notification .notif-product-price {
                font-size: 22px;
                font-weight: 700;
                color: #c9a66b;
                margin-bottom: 15px;
            }
            .product-saved-notification .notif-product-img {
                width: 100px;
                height: 100px;
                border-radius: 12px;
                object-fit: cover;
                margin-bottom: 15px;
                border: 3px solid rgba(201, 166, 107, 0.3);
            }
            .product-saved-notification .notif-sync-badge {
                display: inline-block;
                background: rgba(16, 185, 129, 0.2);
                color: #10b981;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 12px;
                margin-top: 10px;
            }
            .product-saved-notification .notif-sync-badge i {
                margin-right: 5px;
            }
            .product-saved-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                z-index: 99999;
                opacity: 0;
                animation: fadeIn 0.3s ease forwards;
            }
            @keyframes fadeIn {
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                to { opacity: 0; }
            }
            .confetti {
                position: fixed;
                width: 10px;
                height: 10px;
                z-index: 100001;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'product-saved-overlay';
    overlay.id = 'productSavedOverlay';
    document.body.appendChild(overlay);
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'product-saved-notification';
    notification.id = 'productSavedNotification';
    
    const syncBadge = useFirebase ? `
        <div class="notif-sync-badge">
            <i class="fas fa-sync"></i> Synced to all devices
        </div>
    ` : '';
    
    notification.innerHTML = `
        <div class="notif-icon">
            <i class="fas fa-check"></i>
        </div>
        <div class="notif-title">${isUpdate ? 'Product Updated!' : 'Product Added!'}</div>
        <img src="${product.image}" class="notif-product-img" alt="${product.name}" onerror="this.style.display='none'">
        <div class="notif-product-name">${product.name}</div>
        <div class="notif-product-price">${product.price.toLocaleString()} EGP</div>
        ${syncBadge}
    `;
    
    document.body.appendChild(notification);
    
    // Create confetti effect
    createConfetti();
    
    // Play success sound
    playSuccessSound();
    
    // Auto close after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'notifPopOut 0.4s ease forwards';
        overlay.style.animation = 'fadeOut 0.4s ease forwards';
        setTimeout(() => {
            notification.remove();
            overlay.remove();
        }, 400);
    }, 3000);
    
    // Click to close
    overlay.onclick = () => {
        notification.style.animation = 'notifPopOut 0.4s ease forwards';
        overlay.style.animation = 'fadeOut 0.4s ease forwards';
        setTimeout(() => {
            notification.remove();
            overlay.remove();
        }, 400);
    };
}

// Create confetti effect
function createConfetti() {
    const colors = ['#10b981', '#c9a66b', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.width = (Math.random() * 8 + 5) + 'px';
        confetti.style.height = (Math.random() * 8 + 5) + 'px';
        
        document.body.appendChild(confetti);
        
        // Animate falling
        const duration = Math.random() * 2 + 2;
        const rotation = Math.random() * 720 - 360;
        const drift = Math.random() * 200 - 100;
        
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(100vh) translateX(${drift}px) rotate(${rotation}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => confetti.remove();
    }
}

// Play success sound
function playSuccessSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a pleasant success chord
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (C major chord)
        
        frequencies.forEach((freq, i) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05 + (i * 0.1));
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
            
            oscillator.start(audioContext.currentTime + (i * 0.1));
            oscillator.stop(audioContext.currentTime + 1);
        });
    } catch (e) {
        // Audio not supported
    }
}

// Load Orders
function loadOrders() {
    const ordersTable = document.getElementById('ordersTable');
    const realOrders = getOrders();
    
    if (realOrders.length === 0) {
        ordersTable.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-5">
                    <i class="fas fa-shopping-cart fa-3x mb-3 d-block opacity-50"></i>
                    <h5>No Orders Yet</h5>
                    <p>Orders will appear here when customers make purchases.</p>
                </td>
            </tr>
        `;
    } else {
        ordersTable.innerHTML = realOrders.map(order => `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>${order.items}</td>
                <td>${order.total.toLocaleString()} EGP</td>
                <td>${order.payment || 'Credit Card'}</td>
                <td><span class="status-badge status-${order.status}">${capitalizeFirst(order.status)}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn-view" onclick="viewOrder('${order.id}')" title="View"><i class="fas fa-eye"></i></button>
                        <button class="btn-edit" onclick="updateOrderStatus('${order.id}')" title="Update Status"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" onclick="deleteOrder('${order.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Delete order
function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    let orders = getOrders();
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    
    loadOrders();
    loadDashboard();
    showAdminToast('Order deleted successfully', 'success');
}

// Load Customers (from registered users)
function loadCustomers() {
    const customersTable = document.getElementById('customersTable');
    const realCustomers = getCustomers();
    
    if (realCustomers.length === 0) {
        customersTable.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-5">
                    <i class="fas fa-users fa-3x mb-3 d-block opacity-50"></i>
                    <h5>No Customers Yet</h5>
                    <p>Customers will appear here when they register on the website.</p>
                </td>
            </tr>
        `;
    } else {
        customersTable.innerHTML = realCustomers.map(customer => {
            const avatarHtml = customer.avatar 
                ? `<img src="${customer.avatar}" alt="${customer.name}" style="border-radius: 50%;">`
                : `<div class="customer-avatar-default"><i class="fas fa-user"></i></div>`;
            return `
            <tr>
                <td>
                    <div class="product-cell">
                        ${avatarHtml}
                        <span class="product-name">${customer.name}</span>
                    </div>
                </td>
                <td>${customer.email}</td>
                <td>${customer.phone || 'N/A'}</td>
                <td>${customer.orders || 0}</td>
                <td>${(customer.totalSpent || 0).toLocaleString()} EGP</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-view" onclick="viewCustomer('${customer.id}')" title="View"><i class="fas fa-eye"></i></button>
                        <button class="btn-delete" onclick="deleteCustomer('${customer.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `}).join('');
    }
}

// View customer details
function viewCustomer(customerId) {
    const customers = getCustomers();
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    showAdminToast(`Customer: ${customer.name} (${customer.email}) - Orders: ${customer.orders || 0}`, 'info');
}

// Delete customer
function deleteCustomer(customerId) {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    let customers = getCustomers();
    customers = customers.filter(c => c.id !== customerId);
    localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
    
    // Also remove from users
    let users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
    users = users.filter(u => u.id !== customerId);
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    
    loadCustomers();
    loadDashboard();
    showAdminToast('Customer deleted successfully', 'success');
}

// Load Messages
function loadMessages() {
    // Refresh messages from storage
    messages = getMessages();
    
    const messagesList = document.getElementById('messagesList');
    if (!messagesList) return;
    
    // Filter out archived messages and sort by timestamp (newest first)
    const activeMessages = messages.filter(m => !m.archived);
    const sortedMessages = [...activeMessages].sort((a, b) => b.timestamp - a.timestamp);
    
    // Update unread badge in sidebar
    const unreadCount = activeMessages.filter(m => !m.read).length;
    const messageBadge = document.querySelector('.nav-item[data-section="messages"] .badge');
    if (messageBadge) {
        messageBadge.textContent = unreadCount;
        messageBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
    
    if (sortedMessages.length === 0) {
        messagesList.innerHTML = `
            <div class="empty-messages">
                <i class="fas fa-inbox"></i>
                <p>No messages yet</p>
            </div>
        `;
        return;
    }
    
    messagesList.innerHTML = sortedMessages.map(msg => `
        <div class="message-item ${msg.read ? '' : 'unread'}" data-id="${msg.id}">
            <div class="message-avatar">
                <div class="message-avatar-default"><i class="fas fa-user"></i></div>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <h5>${msg.sender}</h5>
                    <span class="time">${formatRelativeTime(msg.timestamp)}</span>
                </div>
                <p class="subject">${msg.subject}</p>
                <p class="preview">${msg.message.substring(0, 50)}...</p>
                ${msg.replies && msg.replies.length > 0 ? `<span class="reply-badge"><i class="fas fa-reply"></i> ${msg.replies.length} repl${msg.replies.length > 1 ? 'ies' : 'y'}</span>` : ''}
            </div>
            ${!msg.read ? '<span class="unread-dot"></span>' : ''}
        </div>
    `).join('');
    
    // Add click events
    document.querySelectorAll('.message-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            showMessage(id);
            
            // Mark as read
            markMessageAsRead(id);
            
            // Mark as active
            document.querySelectorAll('.message-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            item.classList.remove('unread');
            item.querySelector('.unread-dot')?.remove();
        });
    });
}

// Mark message as read
function markMessageAsRead(id) {
    const messageIndex = messages.findIndex(m => m.id === id);
    if (messageIndex !== -1 && !messages[messageIndex].read) {
        messages[messageIndex].read = true;
        saveMessages(messages);
        
        // Update badge
        const unreadCount = messages.filter(m => !m.read && !m.archived).length;
        const messageBadge = document.querySelector('.nav-item[data-section="messages"] .badge');
        if (messageBadge) {
            messageBadge.textContent = unreadCount;
            messageBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }
}

// Show Message Detail
function showMessage(id) {
    const message = messages.find(m => m.id === id);
    if (!message) return;
    
    const messageDetail = document.getElementById('messageDetail');
    
    // Build replies HTML
    const repliesHtml = message.replies && message.replies.length > 0 
        ? message.replies.map(reply => `
            <div class="reply-item ${reply.from === 'admin' ? 'admin-reply' : 'customer-reply'}">
                <div class="reply-header">
                    <strong>${reply.from === 'admin' ? 'You (Admin)' : message.sender}</strong>
                    <span class="reply-time">${formatRelativeTime(reply.timestamp)}</span>
                </div>
                <p>${reply.message}</p>
            </div>
        `).join('')
        : '';
    
    messageDetail.innerHTML = `
        <div class="message-detail-header">
            <div class="message-detail-info">
                <div class="detail-avatar-default"><i class="fas fa-user"></i></div>
                <div>
                    <h4>${message.subject}</h4>
                    <p class="sender-info">
                        <strong>${message.sender}</strong>
                        <span class="text-muted">• ${message.email}</span>
                        ${message.phone ? `<span class="text-muted">• ${message.phone}</span>` : ''}
                    </p>
                    <p class="message-time">
                        <i class="fas fa-clock"></i> ${formatRelativeTime(message.timestamp)}
                        <span class="text-muted">(${new Date(message.timestamp).toLocaleString()})</span>
                    </p>
                </div>
            </div>
            <div class="message-actions">
                <button class="btn btn-sm btn-outline-danger" onclick="deleteMessage(${message.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary" onclick="archiveMessage(${message.id})" title="Archive">
                    <i class="fas fa-archive"></i>
                </button>
            </div>
        </div>
        
        <div class="conversation-thread">
            <div class="original-message">
                <div class="message-bubble customer">
                    <p>${message.message}</p>
                </div>
            </div>
            
            ${repliesHtml ? `<div class="replies-section">${repliesHtml}</div>` : ''}
        </div>
        
        <div class="message-reply">
            <div class="reply-input-container">
                <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Admin" class="admin-avatar">
                <div class="reply-input-wrapper">
                    <textarea class="form-control" id="replyMessage" rows="3" placeholder="Type your reply to ${message.sender}..."></textarea>
                    <div class="reply-actions">
                        <div class="reply-options">
                            <button class="btn btn-sm btn-outline-secondary" title="Use template">
                                <i class="fas fa-file-alt"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" title="Attach file">
                                <i class="fas fa-paperclip"></i>
                            </button>
                        </div>
                        <button class="btn btn-primary" onclick="sendReply(${message.id})">
                            <i class="fas fa-paper-plane"></i> Send Reply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Send Reply to Message
function sendReply(messageId) {
    const replyInput = document.getElementById('replyMessage');
    const replyText = replyInput.value.trim();
    
    if (!replyText) {
        showAdminToast('Please enter a reply message', 'error');
        return;
    }
    
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    // Add reply to message
    if (!messages[messageIndex].replies) {
        messages[messageIndex].replies = [];
    }
    
    messages[messageIndex].replies.push({
        from: 'admin',
        message: replyText,
        timestamp: Date.now()
    });
    
    // Save to storage
    saveMessages(messages);
    
    // Refresh the message detail view
    showMessage(messageId);
    
    // Refresh messages list to update reply badge
    loadMessages();
    
    // Re-select the current message item
    document.querySelector(`.message-item[data-id="${messageId}"]`)?.classList.add('active');
    
    showAdminToast('Reply sent successfully!', 'success');
}

// Delete Message
function deleteMessage(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    messages = messages.filter(m => m.id !== id);
    saveMessages(messages);
    loadMessages();
    
    // Clear detail view
    document.getElementById('messageDetail').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-envelope-open"></i>
            <p>Select a message to read</p>
        </div>
    `;
    
    showAdminToast('Message deleted', 'info');
}

// Archive Message (mark as archived)
function archiveMessage(id) {
    const messageIndex = messages.findIndex(m => m.id === id);
    if (messageIndex !== -1) {
        messages[messageIndex].archived = true;
        saveMessages(messages);
        loadMessages();
        showAdminToast('Message archived', 'info');
    }
}

// Admin Toast Notification
function showAdminToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.admin-toast').forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize Charts with REAL data
function initCharts() {
    const realOrders = getOrders();
    const products = getProducts();
    
    // Calculate real sales data (last 7 days)
    const salesData = calculateSalesData(realOrders);
    
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: salesData.labels,
                datasets: [{
                    label: 'Sales',
                    data: salesData.values,
                    borderColor: '#c9a66b',
                    backgroundColor: 'rgba(201, 166, 107, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => value.toLocaleString() + ' EGP'
                        }
                    }
                }
            }
        });
    }
    
    // Category Chart - based on real products
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        const categoryData = calculateCategoryData(products);
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: categoryData.labels.length > 0 ? categoryData.labels : ['No Products'],
                datasets: [{
                    data: categoryData.values.length > 0 ? categoryData.values : [1],
                    backgroundColor: categoryData.values.length > 0 
                        ? ['#c9a66b', '#2c3e50', '#28a745', '#17a2b8', '#ffc107', '#dc3545']
                        : ['#e0e0e0']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Revenue Chart (Analytics) - monthly revenue from orders
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        const monthlyRevenue = calculateMonthlyRevenue(realOrders);
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: monthlyRevenue.labels,
                datasets: [{
                    label: 'Revenue',
                    data: monthlyRevenue.values,
                    backgroundColor: '#c9a66b'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => (value >= 1000 ? (value / 1000) + 'k' : value) + ' EGP'
                        }
                    }
                }
            }
        });
    }
    
    // Traffic Chart (Analytics) - Show message about no tracking data
    const trafficCtx = document.getElementById('trafficChart');
    if (trafficCtx) {
        new Chart(trafficCtx, {
            type: 'pie',
            data: {
                labels: ['Direct Traffic'],
                datasets: [{
                    data: [100],
                    backgroundColor: ['#c9a66b']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Load top products table
    loadTopProducts();
}

// Calculate sales data for last 7 days
function calculateSalesData(orders) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const labels = [];
    const values = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(days[date.getDay()]);
        
        // Sum orders for this day
        const dayStart = new Date(date.setHours(0, 0, 0, 0)).getTime();
        const dayEnd = new Date(date.setHours(23, 59, 59, 999)).getTime();
        
        const dayTotal = orders
            .filter(o => o.timestamp >= dayStart && o.timestamp <= dayEnd)
            .reduce((sum, o) => sum + (o.total || 0), 0);
        
        values.push(dayTotal);
    }
    
    return { labels, values };
}

// Calculate category distribution from products
function calculateCategoryData(products) {
    const categories = {};
    products.forEach(p => {
        const cat = p.category || 'Other';
        categories[cat] = (categories[cat] || 0) + 1;
    });
    
    return {
        labels: Object.keys(categories),
        values: Object.values(categories)
    };
}

// Calculate monthly revenue
function calculateMonthlyRevenue(orders) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const labels = [];
    const values = [];
    
    // Show last 6 months
    for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        labels.push(months[monthIndex]);
        
        // Calculate revenue for this month
        const monthOrders = orders.filter(o => {
            const orderDate = new Date(o.timestamp);
            return orderDate.getMonth() === monthIndex;
        });
        
        const monthTotal = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        values.push(monthTotal);
    }
    
    return { labels, values };
}

// Load Top Products (based on real order data)
function loadTopProducts() {
    const topProductsTable = document.getElementById('topProductsTable');
    if (!topProductsTable) return;
    
    const orders = getOrders();
    const products = getProducts();
    
    if (orders.length === 0) {
        topProductsTable.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-4">
                    <i class="fas fa-chart-bar fa-2x mb-2 d-block opacity-50"></i>
                    No sales data yet. Top products will appear after orders are placed.
                </td>
            </tr>
        `;
        return;
    }
    
    // Calculate product sales from orders
    const productSales = {};
    orders.forEach(order => {
        if (order.products) {
            order.products.forEach(item => {
                const key = item.name || item.id;
                if (!productSales[key]) {
                    productSales[key] = { name: item.name, sold: 0, revenue: 0 };
                }
                productSales[key].sold += item.quantity || 1;
                productSales[key].revenue += (item.price || 0) * (item.quantity || 1);
            });
        }
    });
    
    // Sort by revenue and take top 5
    const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    
    if (topProducts.length === 0) {
        topProductsTable.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-4">
                    No product sales data available yet.
                </td>
            </tr>
        `;
        return;
    }
    
    topProductsTable.innerHTML = topProducts.map(product => `
        <tr>
            <td><strong>${product.name}</strong></td>
            <td>${product.sold}</td>
            <td>${product.revenue.toLocaleString()} EGP</td>
            <td>
                <span class="text-success">
                    <i class="fas fa-check-circle"></i>
                </span>
            </td>
        </tr>
    `).join('');
}

// Utility Functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Category display names mapping
function getCategoryDisplayName(category) {
    const categoryNames = {
        'living': 'Living Room',
        'bedroom': 'Bedroom',
        'dining': 'Dining',
        'office': 'Office',
        'wood': 'Wood Materials',
        'accessories': 'Accessories'
    };
    return categoryNames[category] || capitalizeFirst(category);
}
