<?php
// NPlusOne Fashion - Cart Page
session_start();
$site_name = "NPlusOne Fashion";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopping Cart - <?php echo $site_name; ?></title>
    
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/components.css">
    <link rel="icon" type="image/svg+xml" href="NPlusOne Logo.svg">
    
    <style>
        .cart-section {
            padding: 6rem 0 4rem;
            background: #000;
            min-height: 80vh;
        }
        
        .cart-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 3rem;
            margin-top: 3rem;
        }
        
        .cart-items-container {
            background: #111;
            border-radius: 10px;
            padding: 2rem;
            border: 1px solid #333;
        }
        
        .cart-item {
            display: grid;
            grid-template-columns: 100px 1fr auto auto auto;
            gap: 1rem;
            align-items: center;
            padding: 1.5rem 0;
            border-bottom: 1px solid #333;
        }
        
        .cart-item:last-child {
            border-bottom: none;
        }
        
        .cart-item-image img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 5px;
        }
        
        .cart-item-details h4 {
            color: #fff;
            margin-bottom: 0.5rem;
        }
        
        .cart-item-category {
            color: #ccc;
            font-size: 0.9rem;
        }
        
        .cart-item-price {
            color: #fff;
            font-weight: 600;
        }
        
        .cart-item-quantity {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .quantity-btn {
            width: 30px;
            height: 30px;
            border: 1px solid #333;
            background: #222;
            color: #fff;
            border-radius: 3px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .quantity-btn:hover {
            background: #333;
        }
        
        .quantity {
            min-width: 40px;
            text-align: center;
            font-weight: 600;
            color: #fff;
        }
        
        .cart-item-total {
            font-weight: 700;
            font-size: 1.1rem;
            color: #fff;
        }
        
        .remove-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 3px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        
        .remove-btn:hover {
            background: #c82333;
        }
        
        .cart-summary {
            background: #111;
            padding: 2rem;
            border-radius: 10px;
            border: 1px solid #333;
            height: fit-content;
        }
        
        .cart-summary h3 {
            color: #fff;
            margin-bottom: 1.5rem;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            color: #fff;
        }
        
        .summary-row.total {
            border-top: 2px solid #333;
            padding-top: 1rem;
            font-weight: 700;
            font-size: 1.2rem;
        }
        
        .checkout-btn {
            width: 100%;
            padding: 1rem;
            background: #fff;
            color: #000;
            border: none;
            border-radius: 5px;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            margin-top: 1rem;
        }
        
        .checkout-btn:hover {
            background: #ccc;
        }
        
        @media (max-width: 768px) {
            .cart-content {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            
            .cart-item {
                grid-template-columns: 80px 1fr;
                gap: 1rem;
            }
            
            .cart-item-quantity,
            .cart-item-total,
            .cart-item-actions {
                grid-column: 1 / -1;
                margin-top: 1rem;
            }
        }
    </style>
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

    <main>
        <section class="cart-section">
            <div class="container">
                <h1 class="section-title">Shopping Cart</h1>
                
                <div class="cart-content">
                    <div class="cart-items-container">
                        <div id="cart-items">
                            <!-- Cart items will be populated by JavaScript -->
                        </div>
                    </div>
                    
                    <div class="cart-summary" id="cart-summary" style="display: none;">
                        <!-- Cart summary will be populated by JavaScript -->
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