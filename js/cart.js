// Shopping Cart Module
let cart = JSON.parse(localStorage.getItem('eidFurnitureCart')) || [];

// Storage keys (same as admin.js)
const CART_STORAGE_KEYS = {
    orders: 'eidFurnitureOrders',
    users: 'eidFurnitureUsers',
    customers: 'eidFurnitureCustomers'
};

// Add item to cart
function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartUI();
    showToast(`${product.name} added to cart!`, 'success');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    renderCartItems();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
        renderCartItems();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('eidFurnitureCart', JSON.stringify(cart));
}

// Update cart UI (count and total)
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const totalAmount = document.querySelector('.total-amount');
    
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = itemCount;
    totalAmount.textContent = `${total.toLocaleString()} EGP`;
    
    // Show/hide empty cart message
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartItems.style.display = 'none';
        cartFooter.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartItems.style.display = 'block';
        cartFooter.style.display = 'flex';
    }
}

// Render cart items in modal
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h5>${item.name}</h5>
                <p>${item.price.toLocaleString()} EGP</p>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </div>
        </div>
    `).join('');
}

// Show toast notification
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('eidFurnitureAuth') || sessionStorage.getItem('eidFurnitureAuth'));
    
    if (!currentUser) {
        showToast('Please login to complete your order', 'error');
        // Open login modal
        setTimeout(() => {
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        }, 500);
        return;
    }
    
    // Show processing message
    showToast('Processing your order...', 'success');
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Create order
    const order = {
        id: 'ORD-' + Date.now(),
        customer: currentUser.name,
        customerId: currentUser.id,
        email: currentUser.email,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
        items: itemCount,
        products: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: total,
        payment: 'Credit Card',
        status: 'pending'
    };
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem(CART_STORAGE_KEYS.orders) || '[]');
    orders.push(order);
    localStorage.setItem(CART_STORAGE_KEYS.orders, JSON.stringify(orders));
    
    // Update customer data
    updateCustomerAfterOrder(currentUser, total);
    
    // Clear cart after 1.5 seconds
    setTimeout(() => {
        cart = [];
        saveCart();
        updateCartUI();
        renderCartItems();
        bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
        showToast('Thank you for your order! Order ID: ' + order.id, 'success');
    }, 1500);
}

// Update customer data after placing order
function updateCustomerAfterOrder(user, orderTotal) {
    // Get or create customers list
    let customers = JSON.parse(localStorage.getItem(CART_STORAGE_KEYS.customers) || '[]');
    
    // Find existing customer or create new
    const existingIndex = customers.findIndex(c => c.id === user.id || c.email === user.email);
    
    if (existingIndex >= 0) {
        // Update existing customer
        customers[existingIndex].orders = (customers[existingIndex].orders || 0) + 1;
        customers[existingIndex].totalSpent = (customers[existingIndex].totalSpent || 0) + orderTotal;
    } else {
        // Add new customer
        customers.push({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            orders: 1,
            totalSpent: orderTotal,
            avatar: user.avatar || null,
            joinedDate: Date.now()
        });
    }
    
    localStorage.setItem(CART_STORAGE_KEYS.customers, JSON.stringify(customers));
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    
    // Cart modal open event
    document.getElementById('cartModal').addEventListener('show.bs.modal', () => {
        renderCartItems();
    });
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', checkout);
});
