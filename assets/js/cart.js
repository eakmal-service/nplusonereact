// NPlusOne Fashion - Cart Management (Shared Hosting Compatible)

// Cart functionality is already included in main.js for basic operations
// This file contains advanced cart features

// Initialize cart page if we're on cart.php
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('cart.php')) {
        renderCartPage();
    }
});

// Render cart page
async function renderCartPage() {
    const cartContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartContainer) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add some items to get started!</p>
                <a href="products.php" class="btn btn-primary">Shop Now</a>
            </div>
        `;
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    let cartHTML = '';
    let totalPrice = 0;
    
    // Sample products data (in real app, this would come from database)
    const sampleProducts = {
        '1': { name: 'Elegant Dress', price: 2999, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop', category: 'Western Dresses' },
        '2': { name: 'Casual Wear', price: 1899, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop', category: 'Co-ord Set' },
        '3': { name: 'Party Outfit', price: 3499, image: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=500&fit=crop', category: 'Indo Western' },
        '4': { name: 'Traditional Set', price: 2599, image: 'Gemini_Generated_Image_owha8qowha8qowha.png', category: 'Suit Set' }
    };
    
    for (const item of cart) {
        const product = sampleProducts[item.id];
        if (product) {
            const itemTotal = product.price * item.quantity;
            totalPrice += itemTotal;
            
            cartHTML += `
                <div class="cart-item" data-item-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${product.name}</h4>
                        <p class="cart-item-category">${product.category}</p>
                        <p class="cart-item-price">${formatCurrency(product.price)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <div class="cart-item-total">
                        ${formatCurrency(itemTotal)}
                    </div>
                    <div class="cart-item-actions">
                        <button class="remove-btn" onclick="removeFromCart('${item.id}'); renderCartPage();">Remove</button>
                    </div>
                </div>
            `;
        }
    }
    
    cartContainer.innerHTML = cartHTML;
    
    // Update cart summary
    if (cartSummary) {
        cartSummary.innerHTML = `
            <div class="cart-summary-content">
                <h3>Order Summary</h3>
                <div class="summary-row">
                    <span>Subtotal (${cart.reduce((total, item) => total + item.quantity, 0)} items)</span>
                    <span>${formatCurrency(totalPrice)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>${formatCurrency(totalPrice)}</span>
                </div>
                <button class="checkout-btn" onclick="proceedToCheckout()">
                    Proceed to Checkout
                </button>
            </div>
        `;
        cartSummary.style.display = 'block';
    }
}

// Update cart item quantity
function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        let cart = getCart();
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.min(newQuantity, 10); // Max 10 items
            saveCart(cart);
            updateCartCount();
        }
    }
    
    // Re-render cart page if we're on it
    if (window.location.pathname.includes('cart.php')) {
        renderCartPage();
    }
}

// Proceed to checkout
function proceedToCheckout() {
    // Check if user is logged in (in real app, check session)
    const isLoggedIn = false; // This would be dynamic in real app
    
    if (!isLoggedIn) {
        showToast('Please login to proceed to checkout', 'warning');
        showLoginModal();
        return;
    }
    
    const cart = getCart();
    if (cart.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }
    
    // In a real app, this would redirect to checkout page
    showToast('Checkout functionality coming soon!', 'info');
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        saveCart([]);
        updateCartCount();
        showToast('Cart cleared', 'info');
        
        if (window.location.pathname.includes('cart.php')) {
            renderCartPage();
        }
    }
}

// Export functions for global use
window.updateCartQuantity = updateCartQuantity;
window.proceedToCheckout = proceedToCheckout;
window.clearCart = clearCart;
window.renderCartPage = renderCartPage;