"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CheckoutPage = () => {
    const { cart, getDiscountedTotal, clearCart, getCartTotal, discount, applyCoupon, removeCoupon, couponCode } = useCart();
    const { user, login } = useAuth();
    const router = useRouter();

    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Checkout Steps State
    const [checkoutMode, setCheckoutMode] = useState<'guest' | 'login' | 'logged_in'>('guest');
    const [paymentMethod, setPaymentMethod] = useState('card'); // card, upi, netbanking, wallet, cod

    // Coupon State
    const [localCoupon, setLocalCoupon] = useState('');
    const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        // Card Details
        cardNumber: '',
        expiry: '',
        cvc: '',
        // UPI
        upiId: '',
    });

    useEffect(() => {
        if (user) {
            setCheckoutMode('logged_in');
            setFormData(prev => ({ ...prev, email: user.email, name: user.name || '' }));
        }
    }, [user]);

    // Validations
    const isFormValid = () => {
        const basic = formData.name && formData.email && formData.address && formData.city && formData.zip;
        if (!basic) return false;

        if (paymentMethod === 'card') {
            return formData.cardNumber && formData.expiry && formData.cvc;
        }
        if (paymentMethod === 'upi') {
            return formData.upiId;
        }
        if (paymentMethod === 'test') return true;
        return true;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleApplyCoupon = async () => {
        if (!localCoupon) return;
        const result = await applyCoupon(localCoupon);
        if (result.success) {
            setCouponMessage({ type: 'success', text: result.message });
        } else {
            setCouponMessage({ type: 'error', text: result.message });
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setLocalCoupon('');
        setCouponMessage(null);
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid()) {
            setError("Please fill in all required fields for shipping and payment.");
            window.scrollTo(0, 0);
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const finalTotal = getDiscountedTotal();

            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: formData,
                    items: cart,
                    total: finalTotal,
                    status: 'Pending',
                    paymentMethod: paymentMethod // Pass metadata
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to place order');
            }

            setOrderPlaced(true);
            clearCart();
            router.push('/order-confirmation');

        } catch (err: any) {
            console.error('Checkout Error:', err);
            setError(err.message || "Something went wrong while placing your order.");
            setIsProcessing(false);
            window.scrollTo(0, 0);
        }
    };

    // Redirect if cart empty
    useEffect(() => {
        if (!orderPlaced && cart.length === 0) {
            router.push('/cart');
        }
    }, [cart, router, orderPlaced]);

    if (!orderPlaced && cart.length === 0) return null;

    return (
        <div className="bg-black min-h-screen text-white">
            <div className="h-16"></div>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8 text-silver">Checkout</h1>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-8 animate-pulse">
                        {error}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column */}
                    <div className="lg:w-2/3 space-y-8">

                        {/* 1. Login / Guest Choice */}
                        {!user && (
                            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                                <div className="flex gap-4 border-b border-gray-800 pb-4 mb-4">
                                    <button
                                        className={`pb-2 px-4 text-sm font-semibold transition-colors ${checkoutMode === 'guest' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}
                                        onClick={() => setCheckoutMode('guest')}
                                    >
                                        Guest Checkout
                                    </button>
                                    <button
                                        className={`pb-2 px-4 text-sm font-semibold transition-colors ${checkoutMode === 'login' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}
                                        onClick={() => setCheckoutMode('login')}
                                    >
                                        Login
                                    </button>
                                </div>

                                {checkoutMode === 'login' && (
                                    <div className="text-center py-4">
                                        <p className="text-gray-400 mb-4">By logging in, you can save your address and view order history.</p>
                                        <Link href="/login?redirect=/checkout" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition-colors">
                                            Log In Now
                                        </Link>
                                    </div>
                                )}
                                {checkoutMode === 'guest' && (
                                    <p className="text-gray-400 text-sm">Proceeding as a guest. You can create an account later.</p>
                                )}
                            </div>
                        )}

                        {/* 2. Shipping Address */}
                        {(checkoutMode === 'guest' || user) && (
                            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                                <h2 className="text-xl font-bold mb-6 text-silver flex items-center gap-2">
                                    <span className="bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                    Shipping Address
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-gray-400 text-sm mb-2">Full Name *</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none text-white"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-gray-400 text-sm mb-2">Email Address *</label>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none text-white"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-gray-400 text-sm mb-2">Address *</label>
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none text-white"
                                            placeholder="123 Fashion St, Appt 4B"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">City *</label>
                                        <input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none text-white"
                                            placeholder="New York"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">ZIP Code *</label>
                                        <input
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                            className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none text-white"
                                            placeholder="10001"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. Payment Method */}
                        {(checkoutMode === 'guest' || user) && (
                            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                                <h2 className="text-xl font-bold mb-6 text-silver flex items-center gap-2">
                                    <span className="bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                    Payment Method
                                </h2>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {['card', 'upi', 'netbanking', 'wallet', 'cod', 'test'].map((method) => (
                                        <button
                                            key={method}
                                            onClick={() => setPaymentMethod(method)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${paymentMethod === method
                                                ? 'bg-white text-black border-white'
                                                : 'bg-black text-gray-400 border-gray-700 hover:border-gray-500'
                                                }`}
                                        >
                                            {method === 'card' && 'Debit/Credit Card'}
                                            {method === 'upi' && 'UPI'}
                                            {method === 'netbanking' && 'Net Banking'}
                                            {method === 'wallet' && 'Wallets'}
                                            {method === 'cod' && 'Cash on Delivery'}
                                            {method === 'test' && '🧪 Test Payment'}
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-black p-4 rounded border border-gray-800">
                                    {paymentMethod === 'card' && (
                                        <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <label className="block text-gray-400 text-sm mb-2">Card Number *</label>
                                                <input
                                                    name="cardNumber"
                                                    value={formData.cardNumber}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none"
                                                    placeholder="0000 0000 0000 0000"
                                                    maxLength={19}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-gray-400 text-sm mb-2">Expiry *</label>
                                                    <input
                                                        name="expiry"
                                                        value={formData.expiry}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none"
                                                        placeholder="MM/YY"
                                                        maxLength={5}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-400 text-sm mb-2">CVC *</label>
                                                    <input
                                                        name="cvc"
                                                        value={formData.cvc}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none"
                                                        placeholder="123"
                                                        maxLength={3}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'upi' && (
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">UPI ID *</label>
                                            <input
                                                name="upiId"
                                                value={formData.upiId}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none"
                                                placeholder="username@bank"
                                            />
                                            <p className="text-xs text-gray-500 mt-2">Open your UPI app to approve the request after placing order.</p>
                                        </div>
                                    )}

                                    {paymentMethod === 'netbanking' && (
                                        <div className="text-gray-400 text-center py-4">
                                            <p>You will be redirected to your bank's secure payment gateway.</p>
                                        </div>
                                    )}

                                    {paymentMethod === 'wallet' && (
                                        <div className="text-gray-400 text-center py-4">
                                            <p>Select Wallet on the next screen (Paytm, PhonePe, Freecharge).</p>
                                        </div>
                                    )}

                                    {paymentMethod === 'cod' && (
                                        <div className="text-gray-400 text-center py-4">
                                            <p>Pay with cash upon delivery. Additional charges may apply.</p>
                                        </div>
                                    )}

                                    {paymentMethod === 'test' && (
                                        <div className="text-yellow-400 text-center py-4 bg-yellow-900/20 rounded border border-yellow-800">
                                            <p className="font-bold">🧪 Test Payment Mode</p>
                                            <p className="text-sm opacity-80 mt-1">Order will be placed immediately for tracking system verification. No real payment required.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 text-white">Order Summary</h2>

                            <div className="space-y-4 mb-6 border-b border-gray-800 pb-6 max-h-60 overflow-y-auto pr-2">
                                {cart.map((item) => (
                                    <div key={`${item.product.id}-${item.size}`} className="flex justify-between items-start gap-3">
                                        <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                            <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white line-clamp-2">{item.product.title}</p>
                                            <p className="text-xs text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-sm text-gray-300">₹{item.product.price}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Section */}
                            <div className="mb-6">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Coupon Code</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={discount > 0 ? (couponCode || '') : localCoupon}
                                        onChange={(e) => setLocalCoupon(e.target.value)}
                                        disabled={discount > 0}
                                        placeholder="Enter code"
                                        className={`flex-1 bg-black border rounded px-3 py-2 text-sm outline-none ${couponMessage?.type === 'error' ? 'border-red-500' :
                                            discount > 0 ? 'border-green-500 text-green-500' : 'border-gray-700'
                                            }`}
                                    />
                                    {discount > 0 ? (
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="bg-red-900/50 text-red-400 px-3 py-2 rounded text-xs font-medium border border-red-800 hover:bg-red-900"
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleApplyCoupon}
                                            className="bg-gray-800 text-white px-3 py-2 rounded text-xs font-medium hover:bg-gray-700 border border-gray-700"
                                        >
                                            Apply
                                        </button>
                                    )}
                                </div>
                                {couponMessage && discount === 0 && (
                                    <p className={`text-xs mt-1 ${couponMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                        {couponMessage.text}
                                    </p>
                                )}
                                {discount > 0 && (
                                    <p className="text-xs mt-1 text-green-500">Coupon applied successfully!</p>
                                )}
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>₹{getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-500">
                                        <span>Discount ({discount}%)</span>
                                        <span>-₹{(getCartTotal() * (discount / 100)).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-800 pt-4 flex justify-between text-lg">
                                    <span className="font-bold text-white">Total</span>
                                    <span className="font-bold text-white">₹{getDiscountedTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing || (checkoutMode === 'login' && !user)}
                                className={`w-full font-bold py-4 rounded transition-all flex items-center justify-center ${isProcessing
                                    ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-gray-200'
                                    }`}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                                        Processing...
                                    </span>
                                ) : (
                                    `Place Order via ${paymentMethod === 'cod' ? 'COD' : paymentMethod.toUpperCase()}`
                                )}
                            </button>

                            <p className="text-xs text-center text-gray-500 mt-4">
                                Secure Encrypted Transaction
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default CheckoutPage;
