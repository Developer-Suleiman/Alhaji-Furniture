// Product Data Management
// All products are managed through the admin panel

// Wishlist Storage Key
const WISHLIST_STORAGE_KEY = 'eidFurnitureWishlist';

// Pagination settings
const PRODUCTS_PER_PAGE = 8;
let currentlyDisplayed = 0;
let currentFilteredProducts = [];

// No default products - admin adds all products
const defaultProducts = [];

// Product Storage Key
const PRODUCTS_STORAGE_KEY = 'eidFurnitureProducts';

// Firebase real-time sync flag
let useFirebaseProducts = false;

// Track if user has interacted (for AudioContext policy)
let userHasInteracted = false;
window.addEventListener('click', () => {
    userHasInteracted = true;
});

// Check if this is a fresh install (no products ever saved)
function isFreshInstall() {
    return localStorage.getItem(PRODUCTS_STORAGE_KEY) === null;
}

// Initialize products from localStorage
function initializeProducts() {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
        try {
            const products = JSON.parse(stored);
            if (Array.isArray(products)) {
                return products;
            }
        } catch (e) {
            console.error('Error parsing products:', e);
        }
    }
    // Initialize with empty array
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify([]));
    return [];
}

// Get products array
let products = initializeProducts();

// Track product count for new product notifications
let lastProductCount = products.length;
let lastProductIds = new Set(products.map(p => p.id));

// Initialize Firebase sync for products (called from index.html)
async function initProductsFirebaseSync() {
    if (typeof window.initFirebaseSync === 'function') {
        const success = await window.initFirebaseSync();
        
        if (success && window.firebaseInitialized && window.firebaseInitialized()) {
            useFirebaseProducts = true;
            console.log('🔥 Firebase real-time sync enabled for products');
            
            // Listen for product changes in real-time
            if (window.FirebaseProducts) {
                window.FirebaseProducts.onChanged((newProducts) => {
                    console.log('🔄 Products updated from Firebase:', newProducts.length);
                    if (newProducts.length > 0) {
                        // Check for new products
                        const newProductIds = new Set(newProducts.map(p => p.id));
                        const addedProducts = newProducts.filter(p => !lastProductIds.has(p.id));
                        
                        // Show notification for each new product
                        addedProducts.forEach(product => {
                            showNewProductNotification(product);
                        });
                        
                        // Update tracking
                        lastProductCount = newProducts.length;
                        lastProductIds = newProductIds;
                        
                        products = newProducts;
                        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
                        // Refresh product display if function exists
                        if (typeof displayProducts === 'function') {
                            displayProducts(products);
                        }
                        if (typeof renderProducts === 'function') {
                            renderProducts(products);
                        }
                    }
                });
                
                // Initial fetch from Firebase
                const firebaseProducts = await window.FirebaseProducts.getAll();
                if (firebaseProducts && firebaseProducts.length > 0) {
                    products = firebaseProducts;
                    lastProductCount = products.length;
                    lastProductIds = new Set(products.map(p => p.id));
                    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
                }
            }
        }
    }
    return products;
}

// ============ NEW PRODUCT NOTIFICATION ============
function showNewProductNotification(product) {
    // Create notification container if it doesn't exist
    let container = document.getElementById('productNotificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'productNotificationContainer';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 380px;
        `;
        document.body.appendChild(container);
        
        // Add notification styles
        if (!document.getElementById('newProductNotifStyles')) {
            const style = document.createElement('style');
            style.id = 'newProductNotifStyles';
            style.textContent = `
                .new-product-notification {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border: 1px solid var(--primary-color, #c9a66b);
                    border-radius: 12px;
                    padding: 16px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.4), 0 0 20px rgba(201, 166, 107, 0.2);
                    animation: slideInRight 0.5s ease, glow 2s ease-in-out infinite;
                    cursor: pointer;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .new-product-notification:hover {
                    transform: translateX(-5px) scale(1.02);
                    box-shadow: 0 15px 50px rgba(0,0,0,0.5), 0 0 30px rgba(201, 166, 107, 0.3);
                }
                .new-product-notification .notif-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                }
                .new-product-notification .notif-badge {
                    background: linear-gradient(135deg, #c9a66b, #d4af37);
                    color: #1a1a2e;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .new-product-notification .notif-close {
                    margin-left: auto;
                    background: none;
                    border: none;
                    color: #888;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                    transition: color 0.3s;
                }
                .new-product-notification .notif-close:hover {
                    color: #fff;
                }
                .new-product-notification .notif-content {
                    display: flex;
                    gap: 12px;
                }
                .new-product-notification .notif-image {
                    width: 70px;
                    height: 70px;
                    border-radius: 8px;
                    object-fit: cover;
                    border: 2px solid rgba(201, 166, 107, 0.3);
                }
                .new-product-notification .notif-details {
                    flex: 1;
                }
                .new-product-notification .notif-name {
                    color: #fff;
                    font-weight: 600;
                    font-size: 14px;
                    margin-bottom: 4px;
                    line-height: 1.3;
                }
                .new-product-notification .notif-category {
                    color: #888;
                    font-size: 12px;
                    margin-bottom: 6px;
                    text-transform: capitalize;
                }
                .new-product-notification .notif-price {
                    color: #c9a66b;
                    font-weight: 700;
                    font-size: 16px;
                }
                .new-product-notification .notif-action {
                    display: inline-block;
                    margin-top: 10px;
                    padding: 6px 14px;
                    background: linear-gradient(135deg, #c9a66b, #d4af37);
                    color: #1a1a2e;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: transform 0.3s, box-shadow 0.3s;
                }
                .new-product-notification .notif-action:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 15px rgba(201, 166, 107, 0.4);
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes glow {
                    0%, 100% { box-shadow: 0 10px 40px rgba(0,0,0,0.4), 0 0 20px rgba(201, 166, 107, 0.2); }
                    50% { box-shadow: 0 10px 40px rgba(0,0,0,0.4), 0 0 30px rgba(201, 166, 107, 0.4); }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                @media (max-width: 480px) {
                    #productNotificationContainer {
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                    .new-product-notification {
                        padding: 12px;
                    }
                    .new-product-notification .notif-image {
                        width: 60px;
                        height: 60px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'new-product-notification';
    notification.innerHTML = `
        <div class="notif-header">
            <span class="notif-badge">🆕 New Product!</span>
            <button class="notif-close" onclick="this.closest('.new-product-notification').remove()">×</button>
        </div>
        <div class="notif-content">
            <img src="${product.image}" alt="${product.name}" class="notif-image" onerror="this.src='https://via.placeholder.com/70?text=New'">
            <div class="notif-details">
                <div class="notif-name">${product.name}</div>
                <div class="notif-category">${product.category}</div>
                <div class="notif-price">${product.price.toLocaleString()} EGP</div>
                <a href="#products" class="notif-action" onclick="scrollToProduct(${product.id})">View Product →</a>
            </div>
        </div>
    `;
    
    // Add click handler to close
    notification.addEventListener('click', (e) => {
        if (e.target.closest('.notif-action')) return;
        if (e.target.closest('.notif-close')) return;
        scrollToProduct(product.id);
        notification.remove();
    });
    
    // Add to container
    container.appendChild(notification);
    
    // Play notification sound (optional)
    playNotificationSound();
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }
    }, 10000);
}

// Scroll to specific product
function scrollToProduct(productId) {
    // First scroll to products section
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Highlight the product card after a short delay
    setTimeout(() => {
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        if (productCard) {
            productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            productCard.style.animation = 'pulse 0.5s ease 3';
            productCard.style.boxShadow = '0 0 30px rgba(201, 166, 107, 0.6)';
            setTimeout(() => {
                productCard.style.animation = '';
                productCard.style.boxShadow = '';
            }, 2000);
        }
    }, 500);
}

// Play notification sound
function playNotificationSound() {
    if (!userHasInteracted) return; // Only play if user has interacted
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
        oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.1); // C#6
        oscillator.frequency.setValueAtTime(1320, audioContext.currentTime + 0.2); // E6
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
    } catch (e) {
        // Audio not supported or blocked
    }
}

// Save products to localStorage (and Firebase if enabled)
async function saveProducts() {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    
    if (useFirebaseProducts && window.FirebaseProducts) {
        await window.FirebaseProducts.setAll(products);
    }
}

// Add new product
async function addProduct(product) {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct = {
        id: newId,
        rating: 5.0,
        reviews: 0,
        ...product
    };
    products.push(newProduct);
    await saveProducts();
    
    if (useFirebaseProducts && window.FirebaseProducts) {
        await window.FirebaseProducts.add(newProduct);
    }
    
    return newProduct;
}

// Update product
function updateProduct(id, updates) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { ...products[index], ...updates };
        saveProducts();
        return products[index];
    }
    return null;
}

// Delete product
function deleteProduct(id) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products.splice(index, 1);
        saveProducts();
        return true;
    }
    return false;
}

// Refresh products from storage (useful when coming from admin)
function refreshProducts() {
    products = initializeProducts();
}

// Render products with pagination support
function renderProducts(productsToRender, append = false) {
    const grid = document.getElementById('productsGrid');
    const loadMoreBtn = document.getElementById('loadMore');
    
    // Store filtered products for load more
    if (!append) {
        currentFilteredProducts = productsToRender;
        currentlyDisplayed = 0;
    }
    
    // Show empty state if no products
    if (!productsToRender || productsToRender.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="empty-products-state">
                    <i class="fas fa-couch fa-4x mb-4 text-muted opacity-50"></i>
                    <h3 class="text-muted">No Products Available</h3>
                    <p class="text-muted">Check back soon for our amazing furniture collection!</p>
                </div>
            </div>
        `;
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
    }
    
    // Calculate which products to show
    const startIndex = append ? currentlyDisplayed : 0;
    const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, productsToRender.length);
    const productsToShow = productsToRender.slice(startIndex, endIndex);
    
    // Clear grid if not appending
    if (!append) {
        grid.innerHTML = '';
    }
    
    productsToShow.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.setAttribute('data-category', product.category);
        card.setAttribute('data-product-id', product.id);
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-actions">
                    <button class="quick-view-btn" data-id="${product.id}" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="wishlist-btn" data-id="${product.id}" title="Add to Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="add-to-cart-btn" data-id="${product.id}" title="Add to Cart">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">${product.price.toLocaleString()} EGP</span>
                    ${product.originalPrice > product.price ? `<span class="original-price">${product.originalPrice.toLocaleString()} EGP</span>` : ''}
                </div>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span>(${product.reviews || 0} reviews)</span>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    // Update displayed count
    currentlyDisplayed = endIndex;
    
    // Show/hide load more button based on remaining products
    if (loadMoreBtn) {
        if (currentlyDisplayed < productsToRender.length) {
            loadMoreBtn.style.display = 'inline-block';
            // Update button text to show remaining count
            const remaining = productsToRender.length - currentlyDisplayed;
            loadMoreBtn.innerHTML = `<i class="fas fa-plus-circle me-2"></i>Load More (${remaining} remaining)`;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    // Add event listeners
    attachProductEventListeners();
}

// Generate star rating
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Attach event listeners to product buttons
function attachProductEventListeners() {
    // Quick view buttons
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.dataset.id);
            showQuickView(productId);
        });
    });
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.dataset.id);
            addToCart(productId);
        });
    });
    
    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = parseInt(btn.dataset.id);
        
        // Check if already in wishlist and update UI
        if (isInWishlist(productId)) {
            btn.classList.add('active');
            const icon = btn.querySelector('i');
            if (icon) icon.style.color = '#dc3545';
        }
        
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            toggleWishlist(id, e.currentTarget);
        });
    });
}

// ===== Wishlist Functions =====

// Get wishlist from localStorage
function getWishlist() {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Save wishlist to localStorage
function saveWishlist(wishlist) {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    updateWishlistCount();
}

// Check if product is in wishlist
function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.some(item => item.id === productId);
}

// Toggle product in wishlist
function toggleWishlist(productId, btnElement) {
    const wishlist = getWishlist();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    const icon = btnElement?.querySelector('i');
    
    if (existingIndex > -1) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        if (btnElement) {
            btnElement.classList.remove('active');
            if (icon) icon.style.color = '';
        }
        showToast('Removed from wishlist', 'info');
    } else {
        // Add to wishlist
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            category: product.category,
            addedAt: Date.now()
        });
        if (btnElement) {
            btnElement.classList.add('active');
            if (icon) icon.style.color = '#dc3545';
        }
        showToast('Added to wishlist!', 'success');
    }
    
    saveWishlist(wishlist);
    renderWishlistItems();
}

// Update wishlist count badge
function updateWishlistCount() {
    const wishlist = getWishlist();
    const count = wishlist.length;
    
    // Update all wishlist count badges
    document.querySelectorAll('.wishlist-count, #wishlistTabBadge').forEach(badge => {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    });
}

// Render wishlist items in account modal
function renderWishlistItems() {
    const wishlistContainer = document.getElementById('wishlistItems');
    const emptyWishlist = document.getElementById('emptyWishlist');
    const wishlist = getWishlist();
    
    if (!wishlistContainer) return;
    
    if (wishlist.length === 0) {
        wishlistContainer.style.display = 'none';
        if (emptyWishlist) emptyWishlist.style.display = 'block';
        return;
    }
    
    if (emptyWishlist) emptyWishlist.style.display = 'none';
    wishlistContainer.style.display = 'block';
    
    wishlistContainer.innerHTML = `
        <div class="wishlist-header mb-3">
            <span class="text-muted">${wishlist.length} item${wishlist.length > 1 ? 's' : ''} in your wishlist</span>
            <button class="btn btn-sm btn-outline-danger" onclick="clearWishlist()">
                <i class="fas fa-trash"></i> Clear All
            </button>
        </div>
        <div class="wishlist-grid">
            ${wishlist.map(item => `
                <div class="wishlist-item" data-id="${item.id}">
                    <div class="wishlist-item-image">
                        <img src="${item.image}" alt="${item.name}">
                        <button class="remove-wishlist-btn" onclick="removeFromWishlist(${item.id})" title="Remove">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="wishlist-item-info">
                        <h6>${item.name}</h6>
                        <p class="wishlist-item-category">${item.category}</p>
                        <div class="wishlist-item-price">
                            <span class="current-price">${item.price.toLocaleString()} EGP</span>
                            ${item.originalPrice ? `<span class="original-price">${item.originalPrice.toLocaleString()} EGP</span>` : ''}
                        </div>
                        <button class="btn btn-primary btn-sm w-100 mt-2" onclick="addWishlistItemToCart(${item.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Remove single item from wishlist
function removeFromWishlist(productId) {
    const wishlist = getWishlist();
    const newWishlist = wishlist.filter(item => item.id !== productId);
    saveWishlist(newWishlist);
    
    // Update button state on product card
    const btn = document.querySelector(`.wishlist-btn[data-id="${productId}"]`);
    if (btn) {
        btn.classList.remove('active');
        const icon = btn.querySelector('i');
        if (icon) icon.style.color = '';
    }
    
    renderWishlistItems();
    showToast('Removed from wishlist', 'info');
}

// Clear entire wishlist
function clearWishlist() {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
        saveWishlist([]);
        
        // Update all wishlist button states
        document.querySelectorAll('.wishlist-btn.active').forEach(btn => {
            btn.classList.remove('active');
            const icon = btn.querySelector('i');
            if (icon) icon.style.color = '';
        });
        
        renderWishlistItems();
        showToast('Wishlist cleared', 'info');
    }
}

// Add wishlist item to cart
function addWishlistItemToCart(productId) {
    if (typeof addToCart === 'function') {
        addToCart(productId);
    }
}

// Show quick view modal
function showQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const content = document.getElementById('quickViewContent');
    content.innerHTML = `
        <div class="quick-view-content">
            <div class="quick-view-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="quick-view-info">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span>(${product.reviews} reviews)</span>
                </div>
                <p class="price">${product.price.toLocaleString()} EGP</p>
                <p class="description">${product.description}</p>
                <div class="quantity-selector">
                    <button class="qty-minus">-</button>
                    <input type="number" value="1" min="1" max="10" id="quickViewQty">
                    <button class="qty-plus">+</button>
                </div>
                <button class="btn btn-primary add-to-cart-quick" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    // Quantity controls
    const qtyInput = content.querySelector('#quickViewQty');
    content.querySelector('.qty-minus').addEventListener('click', () => {
        if (qtyInput.value > 1) qtyInput.value--;
    });
    content.querySelector('.qty-plus').addEventListener('click', () => {
        if (qtyInput.value < 10) qtyInput.value++;
    });
    
    // Add to cart from quick view
    content.querySelector('.add-to-cart-quick').addEventListener('click', () => {
        addToCart(productId, parseInt(qtyInput.value));
        bootstrap.Modal.getInstance(document.getElementById('quickViewModal')).hide();
    });
    
    const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    modal.show();
}

// Filter products by category
function filterProducts(category) {
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// Get product by ID
function getProductById(id) {
    return products.find(p => p.id === id);
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', () => {
    // Refresh products from localStorage (in case admin made changes)
    refreshProducts();
    renderProducts(products); // Will show first 8 products
    
    // Initialize wishlist count
    updateWishlistCount();
    
    // Filter button clicks
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            filterProducts(btn.dataset.filter);
        });
    });
    
    // Load more button - append next batch of products
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Append more products to the grid
            renderProducts(currentFilteredProducts, true);
            
            // Smooth scroll to see new products
            const grid = document.getElementById('productsGrid');
            const cards = grid.querySelectorAll('.product-card');
            if (cards.length > PRODUCTS_PER_PAGE) {
                const targetCard = cards[cards.length - PRODUCTS_PER_PAGE];
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
    
    // Refresh products when page becomes visible (coming from admin)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            refreshProducts();
            const activeFilter = document.querySelector('.filter-btn.active');
            if (activeFilter) {
                filterProducts(activeFilter.dataset.filter);
            } else {
                renderProducts(products);
            }
        }
    });
    
    // Listen for storage changes from other tabs (admin panel)
    window.addEventListener('storage', (e) => {
        if (e.key === PRODUCTS_STORAGE_KEY) {
            refreshProducts();
            const activeFilter = document.querySelector('.filter-btn.active');
            if (activeFilter) {
                filterProducts(activeFilter.dataset.filter);
            } else {
                renderProducts(products);
            }
        }
    });
});

// Handle window resize for responsive adjustments
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate any size-dependent elements
        const grid = document.getElementById('productsGrid');
        if (grid) {
            grid.style.opacity = '0';
            setTimeout(() => {
                grid.style.opacity = '1';
            }, 50);
        }
    }, 250);
});
