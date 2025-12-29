document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    const prevButton = slider.querySelector('.slider-nav.prev');
    const nextButton = slider.querySelector('.slider-nav.next');
    
    let currentSlide = 0;
    let isAnimating = false;
    let autoplayInterval;
    const autoplayDelay = 5000; // 5 seconds

    // Initialize first slide
    slides[0].classList.add('active');

    function goToSlide(index) {
        if (isAnimating) return;
        isAnimating = true;

        // Remove active class from current slide and dot
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        // Update current slide index
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;

        // Add active class to new slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');

        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, 500); // Match this with your CSS transition time
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Event Listeners
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            prevSlide();
            resetAutoplay();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function() {
            nextSlide();
            resetAutoplay();
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            if (currentSlide !== index) {
                goToSlide(index);
                resetAutoplay();
            }
        });
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoplay();
        }
    }

    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Start autoplay
    startAutoplay();

    // Pause autoplay when user hovers over slider
    slider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    slider.addEventListener('mouseleave', startAutoplay);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });

    // Initialize collections slider
    const collectionsSlider = document.querySelector('.collections-slider');
    if (collectionsSlider) {
        let currentCollection = 0;
        const collections = collectionsSlider.querySelectorAll('.collection-slide');
        const totalCollections = collections.length;

        // Hide all collections except the first one
        collections.forEach((collection, index) => {
            if (index !== 0) {
                collection.style.display = 'none';
            }
        });

        // Function to show next collection
        function showNextCollection() {
            collections[currentCollection].style.display = 'none';
            currentCollection = (currentCollection + 1) % totalCollections;
            collections[currentCollection].style.display = 'block';
            collections[currentCollection].style.animation = 'fadeIn 1s';
        }

        // Auto-advance collections every 4 seconds
        setInterval(showNextCollection, 4000);
    }

    // Collection Slider
    const collectionSlider = document.querySelector('.collection-slider');
    if (!collectionSlider) return;

    const slideGroups = collectionSlider.querySelectorAll('.slide-group');
    const dotsCollection = collectionSlider.querySelectorAll('.dot');
    const prevBtn = collectionSlider.querySelector('.slider-nav.prev');
    const nextBtn = collectionSlider.querySelector('.slider-nav.next');
    let currentIndex = 0;

    function showSlide(index) {
        slideGroups.forEach(group => group.classList.remove('active'));
        dotsCollection.forEach(dot => dot.classList.remove('active'));
        
        slideGroups[index].classList.add('active');
        dotsCollection[index].classList.add('active');
    }

    function nextSlideCollection() {
        currentIndex = (currentIndex + 1) % slideGroups.length;
        showSlide(currentIndex);
    }

    function prevSlideCollection() {
        currentIndex = (currentIndex - 1 + slideGroups.length) % slideGroups.length;
        showSlide(currentIndex);
    }

    // Event Listeners
    nextBtn.addEventListener('click', nextSlideCollection);
    prevBtn.addEventListener('click', prevSlideCollection);

    dotsCollection.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showSlide(currentIndex);
        });
    });

    // Auto advance slides every 5 seconds
    let autoSlideInterval = setInterval(nextSlideCollection, 5000);

    // Pause auto-advance on hover
    collectionSlider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    collectionSlider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlideCollection, 5000);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlideCollection();
        } else if (e.key === 'ArrowRight') {
            nextSlideCollection();
        }
    });

    // Touch events
    let touchStartXCollection = 0;
    let touchEndXCollection = 0;

    collectionSlider.addEventListener('touchstart', (e) => {
        touchStartXCollection = e.changedTouches[0].screenX;
    }, false);

    collectionSlider.addEventListener('touchend', (e) => {
        touchEndXCollection = e.changedTouches[0].screenX;
        handleSwipeCollection();
    }, false);

    function handleSwipeCollection() {
        const swipeThresholdCollection = 50;
        const swipeLengthCollection = touchEndXCollection - touchStartXCollection;

        if (Math.abs(swipeLengthCollection) > swipeThresholdCollection) {
            if (swipeLengthCollection > 0) {
                prevSlideCollection();
            } else {
                nextSlideCollection();
            }
        }
    }

    // Product Slider
    const productSlider = document.querySelector('.product-slider');
    if (!productSlider) return;

    const productSlideGroups = productSlider.querySelectorAll('.slide-group');
    const productDots = productSlider.querySelectorAll('.dot');
    const productPrevBtn = productSlider.querySelector('.slider-nav.prev');
    const productNextBtn = productSlider.querySelector('.slider-nav.next');
    let productCurrentIndex = 0;

    function showProductSlide(index) {
        productSlideGroups.forEach(group => group.classList.remove('active'));
        productDots.forEach(dot => dot.classList.remove('active'));
        
        productSlideGroups[index].classList.add('active');
        productDots[index].classList.add('active');
    }

    function nextProductSlide() {
        productCurrentIndex = (productCurrentIndex + 1) % productSlideGroups.length;
        showProductSlide(productCurrentIndex);
    }

    function prevProductSlide() {
        productCurrentIndex = (productCurrentIndex - 1 + productSlideGroups.length) % productSlideGroups.length;
        showProductSlide(productCurrentIndex);
    }

    // Event Listeners
    productNextBtn.addEventListener('click', nextProductSlide);
    productPrevBtn.addEventListener('click', prevProductSlide);

    productDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            productCurrentIndex = index;
            showProductSlide(productCurrentIndex);
        });
    });

    // Auto advance slides every 5 seconds
    let productAutoSlideInterval = setInterval(nextProductSlide, 5000);

    // Pause auto-advance on hover
    productSlider.addEventListener('mouseenter', () => {
        clearInterval(productAutoSlideInterval);
    });

    productSlider.addEventListener('mouseleave', () => {
        productAutoSlideInterval = setInterval(nextProductSlide, 5000);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevProductSlide();
        } else if (e.key === 'ArrowRight') {
            nextProductSlide();
        }
    });

    // Touch events
    let productTouchStartX = 0;
    let productTouchEndX = 0;

    productSlider.addEventListener('touchstart', (e) => {
        productTouchStartX = e.changedTouches[0].screenX;
    }, false);

    productSlider.addEventListener('touchend', (e) => {
        productTouchEndX = e.changedTouches[0].screenX;
        handleProductSwipe();
    }, false);

    function handleProductSwipe() {
        const swipeThreshold = 50;
        const swipeLength = productTouchEndX - productTouchStartX;

        if (Math.abs(swipeLength) > swipeThreshold) {
            if (swipeLength > 0) {
                prevProductSlide();
            } else {
                nextProductSlide();
            }
        }
    }

    // Wishlist button functionality
    const wishlistBtns = productSlider.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const svg = this.querySelector('svg');
            const isFilled = svg.getAttribute('fill') === 'currentColor';
            
            if (isFilled) {
                svg.setAttribute('fill', 'none');
            } else {
                svg.setAttribute('fill', 'currentColor');
            }
        });
    });
});

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style); 