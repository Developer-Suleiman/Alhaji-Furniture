// Authentication System for Alhaji Furniture

// Storage Keys
const AUTH_STORAGE_KEY = 'alhajiFurnitureAuth';
const USERS_STORAGE_KEY = 'alhajiFurnitureUsers';

// Current User State
let currentUser = null;

// Initialize Auth System
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    setupAuthForms();
    setupPasswordStrength();
});

// Initialize Authentication
function initAuth() {
    // Check if user is already logged in (check both localStorage and sessionStorage)
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
        currentUser = JSON.parse(savedAuth);
        updateUIForLoggedInUser();
    }
}

// Setup Form Event Listeners
function setupAuthForms() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Forgot Password Form
    const forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
    }

    // Profile Form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Security Form
    const securityForm = document.getElementById('securityForm');
    if (securityForm) {
        securityForm.addEventListener('submit', handleSecurityUpdate);
    }

    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // My Account Button
    const myAccountBtn = document.getElementById('myAccountBtn');
    if (myAccountBtn) {
        myAccountBtn.addEventListener('click', () => {
            new bootstrap.Modal(document.getElementById('accountModal')).show();
        });
    }

    // My Orders Button
    const myOrdersBtn = document.getElementById('myOrdersBtn');
    if (myOrdersBtn) {
        myOrdersBtn.addEventListener('click', () => {
            const accountModal = new bootstrap.Modal(document.getElementById('accountModal'));
            accountModal.show();
            // Switch to orders tab
            setTimeout(() => {
                document.querySelector('[data-bs-target="#ordersTab"]').click();
            }, 300);
        });
    }

    // Wishlist Button
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            const accountModal = new bootstrap.Modal(document.getElementById('accountModal'));
            accountModal.show();
            // Switch to wishlist tab
            setTimeout(() => {
                const wishlistTabBtn = document.querySelector('[data-bs-target="#wishlistTab"]');
                if (wishlistTabBtn) wishlistTabBtn.click();
                // Render wishlist items
                if (typeof renderWishlistItems === 'function') {
                    renderWishlistItems();
                }
            }, 300);
        });
    }

    // Settings Button
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            const accountModal = new bootstrap.Modal(document.getElementById('accountModal'));
            accountModal.show();
            // Switch to security tab
            setTimeout(() => {
                document.querySelector('[data-bs-target="#securityTab"]').click();
            }, 300);
        });
    }
    
    // Avatar Upload
    const avatarUpload = document.getElementById('avatarUpload');
    if (avatarUpload) {
        avatarUpload.addEventListener('change', handleAvatarUpload);
    }
}

// Handle Avatar Upload
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showToast('Image must be smaller than 2MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageData = event.target.result;
        
        // Update current user avatar
        if (currentUser) {
            currentUser.avatar = imageData;
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
            
            // Update user in users array
            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].avatar = imageData;
                saveUsers(users);
            }
            
            // Update UI
            updateUIForLoggedInUser();
            showToast('Profile photo updated successfully!', 'success');
        }
    };
    reader.readAsDataURL(file);
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Check if admin credentials
    if (email === 'admin@eidfurniture.com' && password === 'admin123') {
        // Admin login - redirect to admin panel
        if (rememberMe) {
            localStorage.setItem('eidFurnitureAdminAuth', 'true');
        } else {
            sessionStorage.setItem('eidFurnitureAdminAuth', 'true');
        }
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        
        // Show message and redirect
        showToast('Welcome Admin! Redirecting to Admin Panel...', 'success');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
        return;
    }

    // Get users from storage
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email);

    if (!user) {
        showToast('No account found with this email', 'error');
        return;
    }

    if (user.password !== hashPassword(password)) {
        showToast('Incorrect password', 'error');
        return;
    }

    // Login successful
    currentUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        avatar: user.avatar || null,
        createdAt: user.createdAt
    };

    // Save to localStorage
    if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    }

    // Update UI
    updateUIForLoggedInUser();

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();

    // Clear form
    document.getElementById('loginForm').reset();

    // Show success message
    showToast(`Welcome back, ${currentUser.firstName}!`, 'success');
}

// Handle Registration
function handleRegister(e) {
    e.preventDefault();

    const firstName = document.getElementById('registerFirstName').value.trim();
    const lastName = document.getElementById('registerLastName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validation
    if (!agreeTerms) {
        showToast('Please agree to the Terms of Service', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    if (password.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
    }

    // Check if email already exists
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        showToast('An account with this email already exists', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        phone,
        password: hashPassword(password),
        avatar: null,
        createdAt: new Date().toISOString(),
        orders: [],
        addresses: [],
        wishlist: []
    };

    // Save user
    users.push(newUser);
    saveUsers(users);

    // Auto login
    currentUser = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        avatar: newUser.avatar,
        createdAt: newUser.createdAt
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));

    // Update UI
    updateUIForLoggedInUser();

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();

    // Clear form
    document.getElementById('registerForm').reset();

    // Show success message
    showToast(`Welcome to Alhaji Furniture, ${firstName}!`, 'success');
}

// Handle Forgot Password
function handleForgotPassword(e) {
    e.preventDefault();

    const email = document.getElementById('resetEmail').value.trim();
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        showToast('No account found with this email', 'error');
        return;
    }

    // Simulate sending email (in real app, this would call backend API)
    showToast('Password reset link sent to your email!', 'success');

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal')).hide();

    // Clear form
    document.getElementById('forgotPasswordForm').reset();
}

// Handle Logout
function handleLogout(e) {
    e.preventDefault();

    const userName = currentUser?.firstName || 'User';

    // Clear auth data
    currentUser = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);

    // Update UI
    updateUIForLoggedOutUser();

    // Show message
    showToast(`Goodbye, ${userName}! See you soon.`, 'info');
}

// Handle Profile Update
function handleProfileUpdate(e) {
    e.preventDefault();

    if (!currentUser) return;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) return;

    // Update user data
    const firstName = document.getElementById('profileFirstName').value.trim();
    const lastName = document.getElementById('profileLastName').value.trim();
    const phone = document.getElementById('profilePhone').value.trim();
    const dob = document.getElementById('profileDOB').value;

    users[userIndex].firstName = firstName;
    users[userIndex].lastName = lastName;
    users[userIndex].phone = phone;
    users[userIndex].dob = dob;

    saveUsers(users);

    // Update current user
    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.phone = phone;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));

    // Update UI
    updateUIForLoggedInUser();

    showToast('Profile updated successfully!', 'success');
}

// Handle Security Update (Password Change)
function handleSecurityUpdate(e) {
    e.preventDefault();

    if (!currentUser) return;

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    // Validation
    if (newPassword !== confirmNewPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) return;

    // Verify current password
    if (users[userIndex].password !== hashPassword(currentPassword)) {
        showToast('Current password is incorrect', 'error');
        return;
    }

    // Update password
    users[userIndex].password = hashPassword(newPassword);
    saveUsers(users);

    // Clear form
    document.getElementById('securityForm').reset();

    showToast('Password updated successfully!', 'success');
}

// Update UI for Logged In User
function updateUIForLoggedInUser() {
    const authButtons = document.getElementById('authButtons');
    const userDropdown = document.getElementById('userDropdown');

    if (authButtons) authButtons.style.display = 'none';
    if (userDropdown) userDropdown.style.display = 'block';

    // Update user info in dropdown
    const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
    
    document.getElementById('userName').textContent = currentUser.firstName;
    
    // Handle avatar display
    const userAvatar = document.getElementById('userAvatar');
    const userAvatarIcon = document.getElementById('userAvatarIcon');
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    const dropdownAvatarIcon = document.getElementById('dropdownAvatarIcon');
    
    if (currentUser.avatar) {
        // User has custom avatar
        if (userAvatar) {
            userAvatar.src = currentUser.avatar;
            userAvatar.style.display = 'block';
        }
        if (userAvatarIcon) userAvatarIcon.style.display = 'none';
        if (dropdownAvatar) {
            dropdownAvatar.src = currentUser.avatar;
            dropdownAvatar.style.display = 'block';
        }
        if (dropdownAvatarIcon) dropdownAvatarIcon.style.display = 'none';
    } else {
        // Use default icon
        if (userAvatar) userAvatar.style.display = 'none';
        if (userAvatarIcon) userAvatarIcon.style.display = 'block';
        if (dropdownAvatar) dropdownAvatar.style.display = 'none';
        if (dropdownAvatarIcon) dropdownAvatarIcon.style.display = 'block';
    }
    
    document.getElementById('dropdownName').textContent = fullName;
    document.getElementById('dropdownEmail').textContent = currentUser.email;

    // Update account modal
    const profileAvatar = document.getElementById('profileAvatar');
    const profileAvatarIcon = document.getElementById('profileAvatarIcon');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileFirstName = document.getElementById('profileFirstName');
    const profileLastName = document.getElementById('profileLastName');
    const profileEmailInput = document.getElementById('profileEmailInput');
    const profilePhone = document.getElementById('profilePhone');

    if (currentUser.avatar) {
        if (profileAvatar) {
            profileAvatar.src = currentUser.avatar;
            profileAvatar.style.display = 'block';
        }
        if (profileAvatarIcon) profileAvatarIcon.style.display = 'none';
    } else {
        if (profileAvatar) profileAvatar.style.display = 'none';
        if (profileAvatarIcon) profileAvatarIcon.style.display = 'block';
    }
    
    if (profileName) profileName.textContent = fullName;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profileFirstName) profileFirstName.value = currentUser.firstName;
    if (profileLastName) profileLastName.value = currentUser.lastName;
    if (profileEmailInput) profileEmailInput.value = currentUser.email;
    if (profilePhone) profilePhone.value = currentUser.phone || '';
}

// Update UI for Logged Out User
function updateUIForLoggedOutUser() {
    const authButtons = document.getElementById('authButtons');
    const userDropdown = document.getElementById('userDropdown');

    if (authButtons) authButtons.style.display = 'flex';
    if (userDropdown) userDropdown.style.display = 'none';
}

// Password Strength Checker
function setupPasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    if (!passwordInput) return;

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthUI(strength);
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;

    return Math.min(strength, 100);
}

function updatePasswordStrengthUI(strength) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    if (!strengthFill || !strengthText) return;

    strengthFill.style.width = `${strength}%`;

    if (strength < 30) {
        strengthFill.style.background = '#e74c3c';
        strengthText.textContent = 'Weak password';
        strengthText.style.color = '#e74c3c';
    } else if (strength < 60) {
        strengthFill.style.background = '#f39c12';
        strengthText.textContent = 'Fair password';
        strengthText.style.color = '#f39c12';
    } else if (strength < 80) {
        strengthFill.style.background = '#3498db';
        strengthText.textContent = 'Good password';
        strengthText.style.color = '#3498db';
    } else {
        strengthFill.style.background = '#27ae60';
        strengthText.textContent = 'Strong password';
        strengthText.style.color = '#27ae60';
    }
}

// Toggle Password Visibility
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Social Login (Placeholder - would connect to OAuth providers)
function socialLogin(provider) {
    showToast(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`, 'info');
    
    // In a real implementation, this would:
    // 1. Redirect to OAuth provider
    // 2. Handle callback with user data
    // 3. Create/login user account
}

// Helper Functions
function getUsers() {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with demo user
    const demoUsers = [{
        id: 1,
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@eidfurniture.com',
        phone: '+20 10 1234 5678',
        password: hashPassword('demo1234'),
        avatar: null,
        createdAt: new Date().toISOString(),
        orders: [],
        addresses: [],
        wishlist: []
    }];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(demoUsers));
    return demoUsers;
}

function saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Simple hash function (for demo purposes - use bcrypt in production)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

// Toast Notification
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.auth-toast');
    existingToasts.forEach(toast => toast.remove());

    // Create toast
    const toast = document.createElement('div');
    toast.className = `auth-toast auth-toast-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };

    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;

    document.body.appendChild(toast);

    // Show animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });

    // Auto hide
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// Check if user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Require authentication (for protected actions)
function requireAuth(callback) {
    if (isLoggedIn()) {
        callback();
    } else {
        showToast('Please login to continue', 'info');
        new bootstrap.Modal(document.getElementById('loginModal')).show();
    }
}

// Load user's messages (from contact form submissions)
function loadUserMessages() {
    const messagesContainer = document.getElementById('userMessagesList');
    if (!messagesContainer || !currentUser) return;
    
    // Get all messages from storage
    const allMessages = JSON.parse(localStorage.getItem('eidFurnitureMessages') || '[]');
    
    // Filter messages by user's email
    const userMessages = allMessages.filter(m => m.email === currentUser.email);
    
    if (userMessages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-envelope"></i>
                <h5>No messages yet</h5>
                <p>Send us a message through the contact form</p>
                <a href="#contact" class="btn btn-primary" data-bs-dismiss="modal">Contact Us</a>
            </div>
        `;
        return;
    }
    
    // Sort by timestamp (newest first)
    userMessages.sort((a, b) => b.timestamp - a.timestamp);
    
    messagesContainer.innerHTML = userMessages.map(msg => {
        const hasReplies = msg.replies && msg.replies.length > 0;
        const lastReply = hasReplies ? msg.replies[msg.replies.length - 1] : null;
        
        return `
            <div class="user-message-card ${hasReplies ? 'has-reply' : ''}" data-id="${msg.id}">
                <div class="message-card-header">
                    <div class="message-subject-info">
                        <h5>${msg.subject}</h5>
                        <span class="message-date">${new Date(msg.timestamp).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</span>
                    </div>
                    <span class="message-status ${hasReplies ? 'replied' : 'pending'}">
                        <i class="fas ${hasReplies ? 'fa-check-circle' : 'fa-clock'}"></i>
                        ${hasReplies ? 'Replied' : 'Pending'}
                    </span>
                </div>
                <div class="message-card-body">
                    <p class="original-message">${msg.message}</p>
                    ${hasReplies ? `
                        <div class="admin-reply-section">
                            <div class="reply-divider">
                                <span><i class="fas fa-reply"></i> Admin Reply</span>
                            </div>
                            ${msg.replies.map(reply => `
                                <div class="admin-reply">
                                    <p>${reply.message}</p>
                                    <small class="reply-time">${new Date(reply.timestamp).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</small>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Load user orders in account modal
function loadUserOrders() {
    const ordersContainer = document.getElementById('userOrders');
    if (!ordersContainer || !currentUser) return;
    
    const allOrders = JSON.parse(localStorage.getItem('eidFurnitureOrders') || '[]');
    const userOrders = allOrders.filter(o => 
        o.email === currentUser.email || 
        o.customerId === currentUser.id
    );
    
    if (userOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h5>No orders yet</h5>
                <p>Start shopping to see your orders here</p>
                <a href="#products" class="btn btn-primary" data-bs-dismiss="modal">Shop Now</a>
            </div>
        `;
        return;
    }
    
    // Sort by timestamp (newest first)
    userOrders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    ordersContainer.innerHTML = userOrders.map(order => `
        <div class="order-card" data-id="${order.id}">
            <div class="order-header">
                <div class="order-id"><strong>Order:</strong> ${order.id}</div>
                <span class="badge bg-${getStatusColor(order.status)}">${order.status || 'Pending'}</span>
            </div>
            <div class="order-details">
                <p><strong>Date:</strong> ${order.date || new Date(order.timestamp).toLocaleDateString()}</p>
                <p><strong>Items:</strong> ${order.items || order.products?.length || 0} items</p>
                <p><strong>Total:</strong> ${(order.total || 0).toLocaleString()} EGP</p>
            </div>
            ${order.products ? `
                <div class="order-products">
                    ${order.products.slice(0, 3).map(p => `
                        <span class="product-pill">${p.name} x${p.quantity}</span>
                    `).join('')}
                    ${order.products.length > 3 ? `<span class="more">+${order.products.length - 3} more</span>` : ''}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function getStatusColor(status) {
    const colors = {
        'pending': 'warning',
        'processing': 'info',
        'shipped': 'primary',
        'delivered': 'success',
        'cancelled': 'danger'
    };
    return colors[status?.toLowerCase()] || 'secondary';
}

// Update UI to load messages when account modal opens
document.addEventListener('DOMContentLoaded', () => {
    const accountModal = document.getElementById('accountModal');
    if (accountModal) {
        accountModal.addEventListener('show.bs.modal', () => {
            if (currentUser) {
                loadUserMessages();
                loadUserOrders();
            }
        });
    }
    
    // Also update when messages tab is clicked
    const messagesTabBtn = document.querySelector('[data-bs-target="#messagesTab"]');
    if (messagesTabBtn) {
        messagesTabBtn.addEventListener('click', loadUserMessages);
    }
    
    // Load orders when orders tab is clicked
    const ordersTabBtn = document.querySelector('[data-bs-target="#ordersTab"]');
    if (ordersTabBtn) {
        ordersTabBtn.addEventListener('click', loadUserOrders);
    }
});
