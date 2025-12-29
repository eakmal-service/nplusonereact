/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
(function() {
    const siteNavigation = document.getElementById('site-navigation');
    const mobileButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    // Return early if the navigation doesn't exist.
    if (!siteNavigation || !mobileButton || !mobileMenu) {
        return;
    }

    // Toggle mobile menu
    mobileButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        mobileButton.setAttribute('aria-expanded', mobileButton.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    });

    // Handle sticky header
    let header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('header-scrolled');
            header.classList.add('header-transparent');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('header-scrolled')) {
            // Scrolling down
            header.classList.remove('header-transparent');
            header.classList.add('header-scrolled');
        } else if (currentScroll < lastScroll && header.classList.contains('header-scrolled')) {
            // Scrolling up
            if (currentScroll <= 0) {
                header.classList.remove('header-scrolled');
                header.classList.add('header-transparent');
            }
        }

        lastScroll = currentScroll;
    });

    // Handle dropdowns
    document.querySelectorAll('.nav-menu > li').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.sub-menu')?.classList.add('active');
        });

        item.addEventListener('mouseleave', function() {
            this.querySelector('.sub-menu')?.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !mobileButton.contains(event.target)) {
            mobileMenu.classList.remove('active');
            mobileButton.setAttribute('aria-expanded', 'false');
        }
    });

    // Handle quick view
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.productId;

            fetch(wpAjax.ajaxUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'nplusone_quick_view',
                    product_id: productId,
                    nonce: wpAjax.nonce
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const modal = document.getElementById('quick-view-' + productId);
                    modal.innerHTML = data.data;
                    modal.style.display = 'block';
                }
            });
        });
    });

    // Initialize sliders
    if (typeof Swiper !== 'undefined') {
        // Hero slider
        new Swiper('.hero-slider', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            autoplay: {
                delay: 5000,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

        // Collections slider
        new Swiper('.collections-slider', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 3000,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 4,
                },
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('is-active');
            mobileMenu.setAttribute('aria-hidden', isExpanded);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Close mobile menu on window resize if it's open
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && mobileMenu.classList.contains('is-active')) {
                mobileMenu.classList.remove('is-active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }

    // Handle header scroll behavior
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.transform = 
                currentScrollY > lastScrollY 
                    ? 'translateY(-100%)' // Hide header when scrolling down
                    : 'translateY(0)';    // Show header when scrolling up
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    }

    // Throttle scroll event
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Handle dropdown menus for touch devices
    const dropdownLinks = document.querySelectorAll('.menu-item-has-children > a');
    
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                const subMenu = this.nextElementSibling;
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // Close other open submenus
                dropdownLinks.forEach(otherLink => {
                    if (otherLink !== this) {
                        otherLink.setAttribute('aria-expanded', 'false');
                        if (otherLink.nextElementSibling) {
                            otherLink.nextElementSibling.style.display = 'none';
                        }
                    }
                });
                
                // Toggle current submenu
                this.setAttribute('aria-expanded', !isExpanded);
                if (subMenu) {
                    subMenu.style.display = isExpanded ? 'none' : 'block';
                }
            }
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button[type="submit"]');
            
            if (emailInput && submitButton) {
                try {
                    submitButton.disabled = true;
                    submitButton.textContent = 'Subscribing...';
                    
                    const response = await fetch(this.action, {
                        method: 'POST',
                        body: new FormData(this),
                    });
                    
                    if (response.ok) {
                        emailInput.value = '';
                        alert('Thank you for subscribing!');
                    } else {
                        throw new Error('Subscription failed');
                    }
                } catch (error) {
                    alert('Sorry, there was an error. Please try again later.');
                } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Subscribe';
                }
            }
        });
    }
}); 