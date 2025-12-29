<?php
// NPlusOne Fashion - Main Index Page
// Compatible with shared hosting

// Start session
session_start();

// Basic configuration
$site_name = "NPlusOne Fashion";
$site_description = "Contemporary fashion for everyone";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $site_name; ?> - <?php echo $site_description; ?></title>
    <meta name="description" content="<?php echo $site_description; ?>">
    
    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/components.css">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="NPlusOne Logo.svg">
</head>
<body>
    <!-- Header -->
    <header class="header" id="main-header">
        <div class="container">
            <div class="header-content">
                <!-- Logo -->
                <div class="logo">
                    <a href="index.php">
                        <img src="NPlusOne Logo.svg" alt="NPlusOne Logo" />
                    </a>
                </div>

                <!-- Mobile Menu Button -->
                <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle menu">
                    <span class="hamburger"></span>
                    <span class="hamburger"></span>
                    <span class="hamburger"></span>
                </button>

                <!-- Desktop Navigation -->
                <nav class="desktop-nav">
                    <a href="products.php?category=suit-set">SUIT SET</a>
                    <a href="products.php?category=western-dresses">WESTERN DRESSES</a>
                    <a href="products.php?category=co-ord-sets">CO-ORD SET</a>
                    <a href="products.php?category=lehenga">LEHENGA</a>
                    <a href="products.php?category=indo-western">INDO WESTERN</a>
                    <a href="products.php?category=unstitched-sets">UNSTITCHED SETS</a>
                </nav>

                <!-- Header Icons -->
                <div class="header-icons">
                    <?php if (isset($_SESSION['user_id'])): ?>
                        <div class="user-menu">
                            <button class="icon-btn user-btn" id="user-menu-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span class="user-name"><?php echo htmlspecialchars($_SESSION['user_name']); ?></span>
                            </button>
                            <div class="user-dropdown" id="user-dropdown">
                                <a href="profile.php">My Profile</a>
                                <a href="orders.php">My Orders</a>
                                <a href="wishlist.php">Wishlist</a>
                                <hr>
                                <button onclick="logout()">Logout</button>
                            </div>
                        </div>
                    <?php else: ?>
                        <button class="icon-btn" onclick="showLoginModal()">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                    <?php endif; ?>
                    
                    <a href="wishlist.php" class="icon-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span class="badge" id="wishlist-count">0</span>
                    </a>

                    <a href="cart.php" class="icon-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span class="badge" id="cart-count">0</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div class="mobile-menu" id="mobile-menu">
            <nav>
                <a href="products.php?category=suit-set">SUIT SET</a>
                <a href="products.php?category=western-dresses">WESTERN DRESSES</a>
                <a href="products.php?category=co-ord-sets">CO-ORD SET</a>
                <a href="products.php?category=lehenga">LEHENGA</a>
                <a href="products.php?category=indo-western">INDO WESTERN</a>
                <a href="products.php?category=unstitched-sets">UNSTITCHED SETS</a>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main>
        <!-- Hero Section -->
        <section class="hero-slider">
            <!-- Slide 1 -->
            <div class="hero-slide active">
                <div class="hero-image">
                    <img src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1920&h=1080&fit=crop" alt="Fashion Collection">
                </div>
                <div class="hero-content">
                    <div class="hero-text">
                        <h1>NPlusOne Fashion</h1>
                        <p>Contemporary fashion for everyone</p>
                        <a href="products.php" class="hero-btn">Explore Collection</a>
                    </div>
                </div>
            </div>

            <!-- Slide 2 -->
            <div class="hero-slide">
                <div class="hero-image">
                    <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&h=1080&fit=crop" alt="Western Collection">
                </div>
                <div class="hero-content">
                    <div class="hero-text">
                        <h1>Western Collection</h1>
                        <p>Modern styles for the contemporary woman</p>
                        <a href="products.php?category=western-dresses" class="hero-btn">Shop Western</a>
                    </div>
                </div>
            </div>

            <!-- Slide 3 -->
            <div class="hero-slide">
                <div class="hero-image">
                    <img src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=1920&h=1080&fit=crop" alt="Indo Western Collection">
                </div>
                <div class="hero-content">
                    <div class="hero-text">
                        <h1>Indo Western</h1>
                        <p>Fusion of tradition and modernity</p>
                        <a href="products.php?category=indo-western" class="hero-btn">Shop Fusion</a>
                    </div>
                </div>
            </div>

            <!-- Slide 4 -->
            <div class="hero-slide">
                <div class="hero-image">
                    <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1920&h=1080&fit=crop" alt="Traditional Collection">
                </div>
                <div class="hero-content">
                    <div class="hero-text">
                        <h1>Traditional Elegance</h1>
                        <p>Timeless pieces for special occasions</p>
                        <a href="products.php?category=lehenga" class="hero-btn">Shop Traditional</a>
                    </div>
                </div>
            </div>

            <!-- Slider Navigation -->
            <div class="hero-nav">
                <button class="hero-prev" onclick="changeSlide(-1)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button class="hero-next" onclick="changeSlide(1)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <!-- Slider Indicators -->
            <div class="hero-indicators">
                <button class="hero-indicator active" onclick="goToSlide(0)"></button>
                <button class="hero-indicator" onclick="goToSlide(1)"></button>
                <button class="hero-indicator" onclick="goToSlide(2)"></button>
                <button class="hero-indicator" onclick="goToSlide(3)"></button>
            </div>
        </section>

        <!-- My Favorites Section -->
        <section class="my-favorite-section">
            <div class="container">
                <h2 class="section-title">My Favorites</h2>
                
                <div class="favorite-cards">
                    <a href="product.php?id=1" class="favorite-card">
                        <div class="favorite-card-image">
                            <img src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop" alt="Elegant Dress">
                        </div>
                        <div class="favorite-card-info">
                            <h4 class="favorite-card-name">Elegant Dress</h4>
                            <p class="favorite-card-price">₹2,999</p>
                        </div>
                    </a>
                    
                    <a href="product.php?id=2" class="favorite-card">
                        <div class="favorite-card-image">
                            <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop" alt="Casual Wear">
                        </div>
                        <div class="favorite-card-info">
                            <h4 class="favorite-card-name">Casual Wear</h4>
                            <p class="favorite-card-price">₹1,899</p>
                        </div>
                    </a>
                    
                    <a href="product.php?id=3" class="favorite-card">
                        <div class="favorite-card-image">
                            <img src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=500&fit=crop" alt="Party Outfit">
                        </div>
                        <div class="favorite-card-info">
                            <h4 class="favorite-card-name">Party Outfit</h4>
                            <p class="favorite-card-price">₹3,499</p>
                        </div>
                    </a>
                    
                    <a href="product.php?id=4" class="favorite-card">
                        <div class="favorite-card-image">
                            <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop" alt="Traditional Set">
                        </div>
                        <div class="favorite-card-info">
                            <h4 class="favorite-card-name">Traditional Set</h4>
                            <p class="favorite-card-price">₹2,599</p>
                        </div>
                    </a>
                </div>
            </div>
        </section>

        <!-- Category Section -->
        <section class="category-section">
            <div class="container">
                <h2 class="section-title">Category Explore</h2>
                
                <div class="category-cards">
                    <a href="products.php?category=suit-set" class="category-card">
                        <img src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=700&fit=crop" alt="Suit Set">
                        <div class="category-card-overlay">
                            <h3 class="category-card-title">SUIT SET</h3>
                        </div>
                    </a>
                    
                    <a href="products.php?category=western-dresses" class="category-card">
                        <img src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=700&fit=crop" alt="Western Dresses">
                        <div class="category-card-overlay">
                            <h3 class="category-card-title">WESTERN DRESSES</h3>
                        </div>
                    </a>
                    
                    <a href="products.php?category=co-ord-sets" class="category-card">
                        <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=700&fit=crop" alt="Co-ord Set">
                        <div class="category-card-overlay">
                            <h3 class="category-card-title">CO-ORD SET</h3>
                        </div>
                    </a>
                    
                    <a href="products.php?category=lehenga" class="category-card">
                        <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=700&fit=crop" alt="Lehenga">
                        <div class="category-card-overlay">
                            <h3 class="category-card-title">LEHENGA</h3>
                        </div>
                    </a>
                    
                    <a href="products.php?category=indo-western" class="category-card">
                        <img src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=500&h=700&fit=crop" alt="Indo Western">
                        <div class="category-card-overlay">
                            <h3 class="category-card-title">INDO WESTERN</h3>
                        </div>
                    </a>
                    
                    <a href="products.php?category=unstitched-sets" class="category-card">
                        <img src="https://images.unsplash.com/photo-1571513722275-4b3ab092c4c4?w=500&h=700&fit=crop" alt="Unstitched Sets">
                        <div class="category-card-overlay">
                            <h3 class="category-card-title">UNSTITCHED SETS</h3>
                        </div>
                    </a>
                </div>
            </div>
        </section>

        <!-- Banner Section -->
        <section class="banner-section">
            <div class="container">
                <div class="banner-image">
                    <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=400&fit=crop" alt="New Year Sale">
                    <div class="banner-overlay">
                        <div class="banner-content">
                            <h2>NEW YEAR BIG SALE</h2>
                            <p>Up to 50% off on selected items</p>
                            <a href="products.php?sale=true" class="banner-btn">Shop Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Explore Collection -->
        <section class="explore-section">
            <div class="container">
                <h2 class="section-title">Explore Collection</h2>
                
                <div class="explore-grid">
                    <div class="explore-item">
                        <img src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop" alt="New Arrivals">
                        <div class="explore-item-content">
                            <h3>New Arrivals</h3>
                            <p>Latest fashion trends</p>
                            <a href="products.php?featured=true" class="explore-btn">Shop Now</a>
                        </div>
                    </div>
                    
                    <div class="explore-item">
                        <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=300&fit=crop" alt="Best Sellers">
                        <div class="explore-item-content">
                            <h3>Best Sellers</h3>
                            <p>Most popular items</p>
                            <a href="products.php?bestseller=true" class="explore-btn">Shop Now</a>
                        </div>
                    </div>
                    
                    <div class="explore-item">
                        <img src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=300&fit=crop" alt="Sale Items">
                        <div class="explore-item-content">
                            <h3>Sale Items</h3>
                            <p>Up to 50% off</p>
                            <a href="products.php?sale=true" class="explore-btn">Shop Now</a>
                        </div>
                    </div>
                    
                    <div class="explore-item">
                        <img src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=300&fit=crop" alt="Traditional Wear">
                        <div class="explore-item-content">
                            <h3>Traditional Wear</h3>
                            <p>Ethnic collection</p>
                            <a href="products.php?category=suit-set" class="explore-btn">Shop Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Recommended Products -->
        <section class="recommended-section">
            <div class="container">
                <h2 class="section-title">Recommended for you</h2>
                
                <div class="horizontal-products">
                    <a href="product.php?id=5" class="horizontal-product-card">
                        <div class="horizontal-product-image">
                            <img src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop" alt="Product 1">
                        </div>
                        <div class="horizontal-product-info">
                            <h4 class="horizontal-product-name">Elegant Kurta Set</h4>
                            <p class="horizontal-product-price">₹2,499</p>
                        </div>
                    </a>
                    
                    <a href="product.php?id=6" class="horizontal-product-card">
                        <div class="horizontal-product-image">
                            <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop" alt="Product 2">
                        </div>
                        <div class="horizontal-product-info">
                            <h4 class="horizontal-product-name">Designer Dress</h4>
                            <p class="horizontal-product-price">₹3,299</p>
                        </div>
                    </a>
                    
                    <a href="product.php?id=7" class="horizontal-product-card">
                        <div class="horizontal-product-image">
                            <img src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=500&fit=crop" alt="Product 3">
                        </div>
                        <div class="horizontal-product-info">
                            <h4 class="horizontal-product-name">Party Wear</h4>
                            <p class="horizontal-product-price">₹4,199</p>
                        </div>
                    </a>
                    
                    <a href="product.php?id=8" class="horizontal-product-card">
                        <div class="horizontal-product-image">
                            <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop" alt="Product 4">
                        </div>
                        <div class="horizontal-product-info">
                            <h4 class="horizontal-product-name">Traditional Lehenga</h4>
                            <p class="horizontal-product-price">₹5,999</p>
                        </div>
                    </a>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>NPlusOne Fashion</h3>
                    <p>Contemporary fashion for everyone. Discover the latest trends and timeless pieces.</p>
                </div>
                
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="index.php">Home</a></li>
                        <li><a href="products.php">Products</a></li>
                        <li><a href="about.php">About Us</a></li>
                        <li><a href="contact.php">Contact</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Categories</h4>
                    <ul>
                        <li><a href="products.php?category=suit-set">Suit Set</a></li>
                        <li><a href="products.php?category=western-dresses">Western Dresses</a></li>
                        <li><a href="products.php?category=lehenga">Lehenga</a></li>
                        <li><a href="products.php?category=indo-western">Indo Western</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Contact Info</h4>
                    <ul>
                        <li>Email: info@nplusonefashion.com</li>
                        <li>Phone: +91 9876543210</li>
                        <li>Address: Mumbai, India</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 NPlusOne Fashion. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- JavaScript -->
    <script src="assets/js/main.js"></script>
    <script src="assets/js/auth.js"></script>
    <script src="assets/js/cart.js"></script>
</body>
</html>