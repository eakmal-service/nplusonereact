<?php
// NPlusOne Fashion - Wishlist Page
session_start();
$site_name = "NPlusOne Fashion";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Wishlist - <?php echo $site_name; ?></title>
    
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/components.css">
    <link rel="icon" type="image/svg+xml" href="NPlusOne Logo.svg">
</head>
<body>
    <!-- Header -->
    <header class="header" id="main-header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <a href="index.php">
                        <img src="NPlusOne Logo.svg" alt="NPlusOne Logo" />
                    </a>
                </div>

                <button class="mobile-menu-btn" id="mobile-menu-btn">
                    <span class="hamburger"></span>
                    <span class="hamburger"></span>
                    <span class="hamburger"></span>
                </button>

                <nav class="desktop-nav">
                    <a href="products.php?category=suit-set">SUIT SET</a>
                    <a href="products.php?category=western-dresses">WESTERN DRESSES</a>
                    <a href="products.php?category=co-ord-sets">CO-ORD SET</a>
                    <a href="products.php?category=lehenga">LEHENGA</a>
                    <a href="products.php?category=indo-western">INDO WESTERN</a>
                    <a href="products.php?category=unstitched-sets">UNSTITCHED SETS</a>
                </nav>

                <div class="header-icons">
                    <button class="icon-btn" onclick="showLoginModal()">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </button>
                    
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
    </header>

    <main style="margin-top: 80px;">
        <section class="wishlist-section" style="padding: 6rem 0 4rem; background: #000; min-height: 80vh;">
            <div class="container">
                <h1 class="section-title">My Wishlist</h1>
                
                <div class="wishlist-content">
                    <div id="wishlist-items" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
                        <!-- Wishlist items will be populated by JavaScript -->
                        <div class="empty-wishlist">
                            <h3>Your wishlist is empty</h3>
                            <p>Save items you love to your wishlist!</p>
                            <a href="products.php" class="btn btn-primary">Shop Now</a>
                        </div>
                    </div>
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
                    <p>Contemporary fashion for everyone.</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 NPlusOne Fashion. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="assets/js/main.js"></script>
    <script src="assets/js/auth.js"></script>
    <script src="assets/js/cart.js"></script>
</body>
</html>