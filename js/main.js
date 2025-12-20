// Main JavaScript file for Alhaji Furniture

// Storage keys
const REVIEWS_STORAGE_KEY = 'alhajiFurnitureReviews';
const ORDERS_STORAGE_KEY = 'alhajiFurnitureOrders';

document.addEventListener('DOMContentLoaded', () => {
    // Hide preloader
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
    }, 1500);

    // Initialize all components
    initNavbar();
    initHeroSlider();
    initReviewsSection();
    initGallery();
    initScrollAnimations();
    initBackToTop();
    initContactForm();
    initNewsletterForm();
    loadReviews();
    initTouchSupport();
    initLazyLoading();
});

// ===== Touch Support for Mobile =====
function initTouchSupport() {
    // Add touch feedback to buttons
    document.querySelectorAll('.btn, .filter-btn, .product-actions button').forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        btn.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
    
    // Swipe support for hero slider
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        heroSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        heroSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                const nextBtn = document.querySelector('.slider-nav .next');
                const prevBtn = document.querySelector('.slider-nav .prev');
                
                if (diff > 0 && nextBtn) {
                    nextBtn.click();
                } else if (diff < 0 && prevBtn) {
                    prevBtn.click();
                }
            }
        }
    }
}

// ===== Lazy Loading Images =====
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== Load Reviews =====
function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    const noReviews = document.getElementById('noReviews');
    const avgRatingEl = document.getElementById('avgRating');
    const avgStarsEl = document.getElementById('avgStars');
    const totalReviewsEl = document.getElementById('totalReviews');
    const ratingBreakdown = document.getElementById('ratingBreakdown');
    
    if (!reviewsList) return;
    
    const reviews = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY) || '[]');
    const approvedReviews = reviews.filter(r => r.approved !== false);
    
    // Update summary
    if (approvedReviews.length > 0) {
        const avgRating = (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1);
        
        if (avgRatingEl) avgRatingEl.textContent = avgRating;
        if (avgStarsEl) avgStarsEl.innerHTML = generateStarsMain(parseFloat(avgRating));
        if (totalReviewsEl) totalReviewsEl.textContent = approvedReviews.length;
        
        // Rating breakdown
        if (ratingBreakdown) {
            let breakdownHTML = '';
            for (let i = 5; i >= 1; i--) {
                const count = approvedReviews.filter(r => r.rating === i).length;
                const percent = approvedReviews.length > 0 ? (count / approvedReviews.length * 100) : 0;
                breakdownHTML += `
                    <div class="rating-bar">
                        <span>${i} <i class="fas fa-star text-warning"></i></span>
                        <div class="rating-bar-fill"><div style="width: ${percent}%"></div></div>
                        <span>${count}</span>
                    </div>
                `;
            }
            ratingBreakdown.innerHTML = breakdownHTML;
        }
        
        // Hide no reviews, show list
        if (noReviews) noReviews.style.display = 'none';
        
        // Render reviews
        const reviewsHTML = approvedReviews.slice(0, 6).map(review => {
            const avatarHtml = review.avatar 
                ? `<img src="${review.avatar}" alt="${review.name}" class="review-avatar">`
                : `<div class="review-avatar-default"><i class="fas fa-user"></i></div>`;
            
            return `
                <div class="review-card">
                    <div class="review-header">
                        ${avatarHtml}
                        <div class="review-info">
                            <h5>${review.name || 'Anonymous'}</h5>
                            <div class="review-stars">${generateStarsMain(review.rating)}</div>
                        </div>
                    </div>
                    ${review.title ? `<h6 class="review-title">${review.title}</h6>` : ''}
                    <p class="review-text">"${review.text}"</p>
                    <span class="review-date">${formatReviewDateMain(review.timestamp)}</span>
                </div>
            `;
        }).join('');
        
        reviewsList.innerHTML = reviewsHTML;
    } else {
        // Show no reviews message
        if (noReviews) noReviews.style.display = 'block';
        if (avgRatingEl) avgRatingEl.textContent = '0.0';
        if (totalReviewsEl) totalReviewsEl.textContent = '0';
    }
    
    // Populate product dropdown in review modal
    populateProductDropdown();
}

function generateStarsMain(rating) {
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

function formatReviewDateMain(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function populateProductDropdown() {
    const dropdown = document.getElementById('reviewProduct');
    if (!dropdown) return;
    
    const products = JSON.parse(localStorage.getItem('eidFurnitureProducts') || '[]');
    
    dropdown.innerHTML = '<option value="">Select a product</option>';
    products.forEach(product => {
        dropdown.innerHTML += `<option value="${product.id}">${product.name}</option>`;
    });
}

// Open review modal
function openReviewModal() {
    const currentUser = JSON.parse(localStorage.getItem('eidFurnitureAuth') || sessionStorage.getItem('eidFurnitureAuth') || 'null');
    
    if (!currentUser) {
        showToast('Please login to write a review', 'error');
        setTimeout(() => {
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        }, 500);
        return;
    }
    
    const reviewModal = new bootstrap.Modal(document.getElementById('reviewModal'));
    reviewModal.show();
    
    // Initialize star rating
    initStarRatingInput();
}

function initStarRatingInput() {
    const stars = document.querySelectorAll('#starRating i');
    const ratingInput = document.getElementById('reviewRating');
    
    if (!stars.length) return;
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.dataset.rating;
            ratingInput.value = rating;
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
    });
}

// Handle review form submission
document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const rating = parseInt(document.getElementById('reviewRating').value);
            const title = document.getElementById('reviewTitle')?.value.trim() || '';
            const text = document.getElementById('reviewText').value.trim();
            const productId = document.getElementById('reviewProduct')?.value || '';
            
            const currentUser = JSON.parse(localStorage.getItem('eidFurnitureAuth') || sessionStorage.getItem('eidFurnitureAuth') || 'null');
            
            if (rating === 0) {
                showToast('Please select a rating', 'error');
                return;
            }
            
            if (text.length < 10) {
                showToast('Please write at least 10 characters', 'error');
                return;
            }
            
            // Create review
            const review = {
                id: Date.now(),
                userId: currentUser?.id,
                name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Anonymous',
                email: currentUser?.email,
                avatar: currentUser?.avatar || null,
                rating: rating,
                title: title,
                text: text,
                productId: productId,
                timestamp: Date.now(),
                approved: true
            };
            
            // Save review
            let reviews = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY) || '[]');
            reviews.unshift(review);
            localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
            
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('reviewModal')).hide();
            
            // Reset form
            reviewForm.reset();
            document.getElementById('reviewRating').value = '0';
            document.querySelectorAll('#starRating i').forEach(s => {
                s.classList.remove('fas');
                s.classList.add('far');
            });
            
            showToast('Thank you for your review!', 'success');
            loadReviews();
        });
    }
});

// ===== Customer Reviews Functions =====
function loadCustomerReviews() {
    loadReviews();
}

// ===== Reviews Section Initialization (replaces testimonials) =====
function initReviewsSection() {
    // Add review styles if not already added
    addReviewStyles();
}

function addReviewStyles() {
    if (document.getElementById('reviewStyles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'reviewStyles';
    styles.textContent = `
        .review-card {
            background: #ffffff;
            border-radius: 15px;
            padding: 25px;
            height: 100%;
            transition: all 0.3s ease;
            border: 1px solid rgba(201, 166, 107, 0.15);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        }
        .review-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(201, 166, 107, 0.2);
            border-color: rgba(201, 166, 107, 0.3);
        }
        .review-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
        }
        .review-avatar {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #c9a66b;
        }
        .review-info h5 {
            margin: 0;
            color: #2c3e50;
            font-weight: 600;
            font-size: 1.1rem;
        }
        .review-title {
            color: #2c3e50;
            font-weight: 600;
            font-size: 1rem;
            margin-bottom: 10px;
        }
        .review-stars {
            color: #ffc107;
            font-size: 0.95rem;
        }
        .review-stars i {
            margin-right: 2px;
        }
        .review-text {
            color: #555;
            font-style: italic;
            line-height: 1.7;
            margin-bottom: 15px;
            font-size: 0.95rem;
        }
        .review-date {
            font-size: 0.85rem;
            color: #888;
        }
        .review-product {
            font-size: 0.85rem;
            color: #c9a66b;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #eee;
        }
        .review-product i {
            margin-right: 5px;
        }
    `;
    document.head.appendChild(styles);
}

// ===== Navbar Functions =====
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navbarCollapse).hide();
                }
            }
        });
    });
}

// ===== Hero Slider Functions =====
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const slideBgs = document.querySelectorAll('.slide-bg');
    const prevBtn = document.querySelector('.slider-nav .prev');
    const nextBtn = document.querySelector('.slider-nav .next');
    const dotsContainer = document.querySelector('.slider-dots');
    const progressBar = document.querySelector('.slider-progress-bar');
    const counterCurrent = document.querySelector('.slide-counter .current');
    const counterTotal = document.querySelector('.slide-counter .total');
    
    let currentSlide = 0;
    let slideInterval = null;
    let isPaused = false;
    let isTransitioning = false; // Prevent rapid slide changes
    const slideDuration = 7000; // 7 seconds per slide - synced with Ken Burns CSS animation
    const transitionDuration = 1200; // Match CSS transition duration (1.2s)
    
    // Set total count
    if (counterTotal) {
        counterTotal.textContent = String(slides.length).padStart(2, '0');
    }
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    function updateSlider(direction = 'next') {
        // Prevent changing slides while transitioning
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Remove active from all slides
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            dots[index].classList.remove('active');
        });
        
        // Add active class to current slide - CSS handles Ken Burns automatically
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        // Update counter with smooth animation
        if (counterCurrent) {
            counterCurrent.style.transform = 'translateY(-10px)';
            counterCurrent.style.opacity = '0';
            setTimeout(() => {
                counterCurrent.textContent = String(currentSlide + 1).padStart(2, '0');
                counterCurrent.style.transform = 'translateY(0)';
                counterCurrent.style.opacity = '1';
            }, 150);
        }
        
        // Reset and restart progress bar
        resetProgressBar();
        
        // Allow next transition after current one completes
        setTimeout(() => {
            isTransitioning = false;
        }, transitionDuration);
    }
    
    function resetProgressBar() {
        if (progressBar) {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            
            // Force reflow
            progressBar.offsetHeight;
            
            // Start progress animation
            setTimeout(() => {
                progressBar.style.transition = `width ${slideDuration}ms linear`;
                progressBar.style.width = '100%';
            }, 50);
        }
    }
    
    function nextSlide() {
        if (isTransitioning) return;
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider('next');
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider('prev');
    }
    
    function goToSlide(index) {
        if (index === currentSlide || isTransitioning) return;
        const direction = index > currentSlide ? 'next' : 'prev';
        currentSlide = index;
        updateSlider(direction);
        resetInterval();
    }
    
    function startInterval() {
        if (isPaused) return;
        // Clear any existing interval first to prevent duplicates
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
        slideInterval = setInterval(nextSlide, slideDuration);
        resetProgressBar();
    }
    
    function resetInterval() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
        if (!isPaused) {
            startInterval();
        }
    }
    
    function pauseSlider() {
        isPaused = true;
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
        if (progressBar) {
            const computedWidth = window.getComputedStyle(progressBar).width;
            progressBar.style.transition = 'none';
            progressBar.style.width = computedWidth;
        }
    }
    
    function resumeSlider() {
        if (!isPaused) return; // Already running
        isPaused = false;
        startInterval();
    }
    
    // Navigation button events
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const heroSection = document.querySelector('.hero-section');
        const heroRect = heroSection.getBoundingClientRect();
        
        // Only handle keys when hero is in view
        if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetInterval();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetInterval();
            }
        }
    });
    
    // Start auto-slide
    startInterval();
    
    // Initialize counter animation style
    if (counterCurrent) {
        counterCurrent.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    }
    
    // Intersection Observer to pause when not visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                resumeSlider();
            } else {
                pauseSlider();
            }
        });
    }, { threshold: 0.3 });
    
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
}

// ===== Gallery Functions =====
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    const images = [];
    
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        images.push(img.src);
        
        item.querySelector('.gallery-btn').addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox(img.src);
        });
    });
    
    function openLightbox(src) {
        lightboxImage.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImage.src = images[currentImageIndex];
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentImageIndex];
    }
    
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.feature-box, .about-content, .about-image, .product-card, .gallery-item, .contact-item, .contact-form'
    );
    
    animatedElements.forEach(el => el.classList.add('animate-on-scroll'));
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// ===== Back to Top Button =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Contact Form =====
const MESSAGES_STORAGE_KEY = 'eidFurnitureMessages';

function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Validate form
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const phone = form.querySelector('#phone').value.trim();
        const message = form.querySelector('#message').value.trim();
        const subject = form.querySelector('#subject').value;
        
        if (!name || !email || !message || !subject) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Save message to localStorage for admin panel
            saveMessageToStorage({
                name,
                email,
                phone,
                subject,
                message
            });
            
            showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
        } catch (error) {
            showToast('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// Save contact message to localStorage
function saveMessageToStorage(data) {
    // Get existing messages
    let messages = [];
    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (stored) {
        messages = JSON.parse(stored);
    }
    
    // Map subject value to readable text
    const subjectMap = {
        'inquiry': 'Product Inquiry',
        'custom': 'Custom Order Request',
        'support': 'Support Request',
        'feedback': 'Feedback'
    };
    
    // Create new message
    const newMessage = {
        id: Date.now(),
        sender: data.name,
        email: data.email,
        phone: data.phone || '',
        subject: subjectMap[data.subject] || data.subject,
        message: data.message,
        timestamp: Date.now(),
        read: false,
        replies: []
    };
    
    // Add to beginning of array (newest first)
    messages.unshift(newMessage);
    
    // Save back to localStorage
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    
    // Trigger notification sound/visual if possible
    console.log('New message saved:', newMessage);
}

// ===== Newsletter Form =====
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = form.querySelector('input').value.trim();
        const submitBtn = form.querySelector('button');
        
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showToast('Successfully subscribed to our newsletter!', 'success');
            form.reset();
        } catch (error) {
            showToast('Failed to subscribe. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Subscribe';
        }
    });
}

// ===== Utility Functions =====
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Counter Animation for Stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// ===== Footer Links Handlers =====
document.addEventListener('DOMContentLoaded', () => {
    initFooterCategoryLinks();
    initFooterServiceLinks();
    initTrackOrderForm();
});

// Category links - filter products by category
function initFooterCategoryLinks() {
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const category = link.dataset.category;
            
            // Scroll to products section first
            setTimeout(() => {
                // Click the corresponding filter button
                const filterBtn = document.querySelector(`.filter-btn[data-category="${category}"]`);
                if (filterBtn) {
                    filterBtn.click();
                } else {
                    // If no exact match, try to filter products directly
                    if (typeof filterProducts === 'function') {
                        filterProducts(category);
                    }
                }
            }, 500);
        });
    });
}

// Service links - show info modals
function initFooterServiceLinks() {
    const serviceContent = {
        'shipping': {
            title: '<i class="fas fa-truck"></i> Shipping Information',
            content: `
                <div class="info-section">
                    <h5>Delivery Areas</h5>
                    <p>We deliver to all areas within Cairo and Greater Cairo. For other governorates, please contact us for delivery options.</p>
                    
                    <h5 class="mt-4">Shipping Costs</h5>
                    <ul>
                        <li><strong>Cairo & Giza:</strong> Free shipping on orders over 5,000 EGP</li>
                        <li><strong>Greater Cairo:</strong> 150-300 EGP depending on location</li>
                        <li><strong>Other Governorates:</strong> Contact us for a quote</li>
                    </ul>
                    
                    <h5 class="mt-4">Delivery Time</h5>
                    <ul>
                        <li><strong>In-stock items:</strong> 3-5 business days</li>
                        <li><strong>Custom orders:</strong> 2-4 weeks</li>
                        <li><strong>Assembly service:</strong> Available upon request (additional fee may apply)</li>
                    </ul>
                    
                    <h5 class="mt-4">Delivery Process</h5>
                    <ol>
                        <li>Our team will contact you to confirm delivery date and time</li>
                        <li>Delivery to your door (ground floor or elevator buildings)</li>
                        <li>Optional assembly service available</li>
                        <li>Packaging removal included</li>
                    </ol>
                </div>
            `
        },
        'returns': {
            title: '<i class="fas fa-exchange-alt"></i> Returns & Exchanges',
            content: `
                <div class="info-section">
                    <h5>Return Policy</h5>
                    <p>We want you to be completely satisfied with your purchase. If you're not happy, we offer hassle-free returns within our policy guidelines.</p>
                    
                    <h5 class="mt-4">Return Conditions</h5>
                    <ul>
                        <li>Items must be returned within <strong>14 days</strong> of delivery</li>
                        <li>Items must be in original condition, unused and unassembled</li>
                        <li>Original packaging must be intact</li>
                        <li>Custom-made items are non-returnable</li>
                    </ul>
                    
                    <h5 class="mt-4">Exchange Policy</h5>
                    <ul>
                        <li>Exchanges available within <strong>30 days</strong></li>
                        <li>Size/color exchanges subject to availability</li>
                        <li>Price differences will be adjusted</li>
                    </ul>
                    
                    <h5 class="mt-4">How to Return</h5>
                    <ol>
                        <li>Contact our customer service at +20 2 2275 1234</li>
                        <li>Provide your order number and reason for return</li>
                        <li>Schedule a pickup date</li>
                        <li>Refund processed within 5-7 business days after inspection</li>
                    </ol>
                    
                    <div class="alert alert-warning mt-3">
                        <i class="fas fa-exclamation-triangle"></i> Note: Return shipping fees may apply for non-defective items.
                    </div>
                </div>
            `
        },
        'faq': {
            title: '<i class="fas fa-question-circle"></i> Frequently Asked Questions',
            content: `
                <div class="info-section">
                    <div class="accordion" id="faqAccordion">
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                                    How do I place an order?
                                </button>
                            </h2>
                            <div id="faq1" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    Browse our products, add items to your cart, and proceed to checkout. You can also visit our showroom in Nasr City or call us to place an order.
                                </div>
                            </div>
                        </div>
                        
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                                    Do you offer custom furniture?
                                </button>
                            </h2>
                            <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    Yes! We specialize in custom furniture. Contact us with your specifications and our team will provide a quote and timeline.
                                </div>
                            </div>
                        </div>
                        
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                                    What payment methods do you accept?
                                </button>
                            </h2>
                            <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    We accept Cash on Delivery, Visa, MasterCard, Fawry, and bank transfers. Installment plans available through select banks.
                                </div>
                            </div>
                        </div>
                        
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                                    Can I visit your showroom?
                                </button>
                            </h2>
                            <div id="faq4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    Absolutely! Visit us at Abbas Al-Akkad Street, Nasr City, Cairo. We're open Saturday to Thursday, 10 AM to 10 PM.
                                </div>
                            </div>
                        </div>
                        
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">
                                    Do you offer assembly services?
                                </button>
                            </h2>
                            <div id="faq5" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    Yes, we offer professional assembly services for an additional fee. Our skilled technicians will set up your furniture perfectly.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        'warranty': {
            title: '<i class="fas fa-shield-alt"></i> Warranty Information',
            content: `
                <div class="info-section">
                    <h5>Our Warranty Promise</h5>
                    <p>At Alhaji Furniture, we stand behind the quality of our products. All furniture comes with our comprehensive warranty coverage.</p>
                    
                    <h5 class="mt-4">Warranty Coverage</h5>
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Product Category</th>
                                <th>Warranty Period</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Sofas & Living Room</td>
                                <td>3 Years</td>
                            </tr>
                            <tr>
                                <td>Beds & Mattresses</td>
                                <td>5 Years</td>
                            </tr>
                            <tr>
                                <td>Dining Tables & Chairs</td>
                                <td>3 Years</td>
                            </tr>
                            <tr>
                                <td>Office Furniture</td>
                                <td>2 Years</td>
                            </tr>
                            <tr>
                                <td>Outdoor Furniture</td>
                                <td>1 Year</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <h5 class="mt-4">What's Covered</h5>
                    <ul>
                        <li>Manufacturing defects</li>
                        <li>Structural frame issues</li>
                        <li>Hardware failures (hinges, handles, etc.)</li>
                        <li>Spring and cushion defects</li>
                    </ul>
                    
                    <h5 class="mt-4">What's Not Covered</h5>
                    <ul>
                        <li>Normal wear and tear</li>
                        <li>Damage from misuse or accidents</li>
                        <li>Fabric fading from sunlight</li>
                        <li>Unauthorized modifications</li>
                    </ul>
                    
                    <h5 class="mt-4">How to Claim Warranty</h5>
                    <ol>
                        <li>Contact us with your order number and photos of the issue</li>
                        <li>Our team will assess the claim within 48 hours</li>
                        <li>If approved, we'll arrange repair or replacement</li>
                    </ol>
                </div>
            `
        }
    };
    
    document.querySelectorAll('.service-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const service = link.dataset.service;
            
            // Track order opens its own modal
            if (service === 'track-order') {
                return; // Let the data-bs-toggle handle it
            }
            
            e.preventDefault();
            
            const content = serviceContent[service];
            if (content) {
                const modalTitle = document.getElementById('infoModalTitle');
                const modalBody = document.getElementById('infoModalBody');
                
                if (modalTitle && modalBody) {
                    modalTitle.innerHTML = content.title;
                    modalBody.innerHTML = content.content;
                    
                    const infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
                    infoModal.show();
                }
            } else {
                // If no specific content, scroll to contact section
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Track Order Form Handler
function initTrackOrderForm() {
    const form = document.getElementById('trackOrderForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const orderId = document.getElementById('trackOrderId').value.trim().toUpperCase();
        const email = document.getElementById('trackOrderEmail').value.trim().toLowerCase();
        
        // Get orders from localStorage
        const orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
        
        // Find matching order - check multiple ID formats and email field
        const order = orders.find(o => {
            const normalizedOrderId = String(o.id).toUpperCase();
            const orderIdMatch = normalizedOrderId === orderId || 
                               `ORD-${o.id}` === orderId ||
                               normalizedOrderId === orderId.replace('ORD-', '') ||
                               orderId.includes(normalizedOrderId);
            const emailMatch = (o.email && o.email.toLowerCase() === email) ||
                              (o.customer?.email && o.customer.email.toLowerCase() === email);
            return orderIdMatch && emailMatch;
        });
        
        const resultDiv = document.getElementById('trackOrderResult');
        const statusContent = document.getElementById('orderStatusContent');
        
        if (order) {
            // Order found - show status
            const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
            const currentStep = statusSteps.indexOf(order.status) + 1 || 1;
            
            statusContent.innerHTML = `
                <div class="order-info mb-3">
                    <p><strong>Order ID:</strong> ORD-${order.id}</p>
                    <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> ${order.total?.toLocaleString()} EGP</p>
                </div>
                
                <div class="status-tracker">
                    ${statusSteps.map((step, index) => `
                        <div class="status-step ${index < currentStep ? 'completed' : ''} ${index === currentStep - 1 ? 'current' : ''}">
                            <div class="step-icon">
                                ${index < currentStep ? '<i class="fas fa-check"></i>' : (index + 1)}
                            </div>
                            <div class="step-label">${step}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="status-message mt-3">
                    <p class="mb-0">
                        <i class="fas fa-info-circle text-primary"></i>
                        <strong>Current Status:</strong> ${order.status || 'Pending'}
                    </p>
                </div>
            `;
            
            resultDiv.style.display = 'block';
            showToast('Order found! Check the status below.', 'success');
        } else {
            // Order not found
            statusContent.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>Order not found!</strong>
                    <p class="mb-0 mt-2">Please check your order ID and email address. If you continue to have issues, please contact our support team at +20 2 2275 1234.</p>
                </div>
            `;
            resultDiv.style.display = 'block';
            showToast('Order not found. Please check your details.', 'error');
        }
    });
}
