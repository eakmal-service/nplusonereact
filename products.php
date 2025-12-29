<?php
// NPlusOne Fashion - Products Page
session_start();

$site_name = "NPlusOne Fashion";
$category = $_GET['category'] ?? '';
$search = $_GET['search'] ?? '';

// Sample products data (in real app, this would come from database)
$products = [
    [
        'id' => 1,
        'name' => 'Elegant Dress',
        'category' => 'western-dresses',
        'price' => 2999,
        'image' => 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop',
        'description' => 'Beautiful elegant dress perfect for special occasions'
    ],
    [
        'id' => 2,
        'name' => 'Casual Co-ord Set',
        'category' => 'co-ord-sets',
        'price' => 1899,
        'image' => 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop',
        'description' => 'Comfortable and stylish co-ord set for daily wear'
    ],
    [
        'id' => 3,
        'name' => 'Party Outfit',
        'category' => 'indo-western',
        'price' => 3499,
        'image' => 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=500&fit=crop',
        'description' => 'Stunning indo-western outfit for parties'
    ],
    [
        'id' => 4,
        'name' => 'Traditional Suit Set',
        'category' => 'suit-set',
        'price' => 2599,
        'image' => 'Gemini_Generated_Image_owha8qowha8qowha.png',
        'description' => 'Traditional suit set with dupatta'
    ],
    [
        'id' => 5,
        'name' => 'Designer Lehenga',
        'category' => 'lehenga',
        'price' => 5999,
        'image' => 'Gemini_Generated_Image_e9hjm9e9hjm9e9hj.png',
        'description' => 'Beautiful designer lehenga for weddings'
    ],
    [
        'id' => 6,
        'name' => 'Unstitched Fabric Set',
        'category' => 'unstitched-sets',
        'price' => 1599,
        'image' => 'Gemini_Generated_Image_5qans45qans45qan.png',
        'description' => 'Premium fabric set for custom tailoring'
    ]
];

// Filter products based on category
if ($category) {
    $products = array_filter($products, function($product) use ($category) {
        return $product['category'] === $category;
    });
}

// Filter products based on search
if ($search) {
    $products = array_filter($products, function($product) use ($search) {
        return stripos($product['name'], $search) !== false || 
               stripos($product['description'], $search) !== false;
    });
}

$page_title = $category ? ucwords(str_replace('-', ' ', $category)) : 'All Products';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $page_title; ?> - <?php echo $site_name; ?></title>
    
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

    <main style="margin-top: 80px;">
        <section class="products-section" style="padding: 4rem 0; background: #000;">
            <div class="container">
                <h1 class="section-title"><?php echo $page_title; ?></h1>
                
                <?php if (empty($products)): ?>
                    <div class="empty-products text-center" style="padding: 4rem 2rem;">
                        <h3>No products found</h3>
                        <p>Try adjusting your search or browse our categories.</p>
                        <a href="index.php" class="btn btn-primary">Back to Home</a>
                    </div>
                <?php else: ?>
                    <div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem;">
                        <?php foreach ($products as $product): ?>
                            <div class="product-card">
                                <div class="product-image-wrapper">
                                    <img src="<?php echo $product['image']; ?>" alt="<?php echo htmlspecialchars($product['name']); ?>">
                                </div>
                                <div class="product-info">
                                    <h3 class="product-name"><?php echo htmlspecialchars($product['name']); ?></h3>
                                    <p class="product-category"><?php echo ucwords(str_replace('-', ' ', $product['category'])); ?></p>
                                    <div class="product-price">
                                        <span class="current-price">₹<?php echo number_format($product['price']); ?></span>
                                    </div>
                                    <button class="add-to-cart-btn" onclick="addToCart('<?php echo $product['id']; ?>')">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
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
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="index.php">Home</a></li>
                        <li><a href="products.php">Products</a></li>
                        <li><a href="about.php">About</a></li>
                        <li><a href="contact.php">Contact</a></li>
                    </ul>
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