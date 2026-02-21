"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';



const CheckoutPage = () => {
    const { cart, getDiscountedTotal, clearCart, getCartTotal, discount, applyCoupon, removeCoupon, couponCode } = useCart();
    const { user, login } = useAuth();
    const router = useRouter();

    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState<string | null>(null);


    // Checkout Steps State
    const [checkoutMode, setCheckoutMode] = useState<'login' | 'logged_in'>('login');
    const [paymentMethod, setPaymentMethod] = useState('phonepe'); // Default to PhonePe
    const [isEditingAddress, setIsEditingAddress] = useState(true);

    // Coupon State
    const [localCoupon, setLocalCoupon] = useState('');
    const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        city: '',
        zip: '',
        cardNumber: '',
        expiry: '',
        cvc: '',
        upiId: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                setCheckoutMode('logged_in');
                setFormData(prev => ({
                    ...prev,
                    email: user.email || '',
                    name: user.user_metadata?.full_name || '',
                    phoneNumber: user.phone || ''
                }));

                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (data) {
                    setFormData(prev => ({
                        ...prev,
                        phoneNumber: data.phone_number || prev.phoneNumber,
                        address: data.address_line1 || prev.address,
                        city: data.city || prev.city,
                        zip: data.pincode || prev.zip,
                        name: data.first_name ? `${data.first_name} ${data.last_name || ''}`.trim() : prev.name
                    }));
                    if (data.address_line1) {
                        setIsEditingAddress(false);
                    }
                }
            }
        };
        fetchUserData();
    }, [user]);

    // Validations
    const isFormValid = () => {
        const basic = formData.name && formData.email && formData.phoneNumber && formData.address && formData.city && formData.zip;
        if (!basic) return false;

        if (paymentMethod === 'card') {
            return formData.cardNumber && formData.expiry && formData.cvc;
        }
        if (paymentMethod === 'upi') {
            return formData.upiId;
        }
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

        if (isEditingAddress) {
            setError("Please click 'Use this address' to confirm your shipping details first.");
            window.scrollTo(0, 0);
            return;
        }

        if (!termsAccepted) {
            setError("Please agree to the Terms & Conditions to proceed.");
            window.scrollTo(0, 0);
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Save newly entered checkout details back to profile as default
            if (user) {
                const nameParts = formData.name.trim().split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';

                await supabase.from('profiles').upsert({
                    id: user.id,
                    address_line1: formData.address,
                    city: formData.city,
                    pincode: formData.zip,
                    phone_number: formData.phoneNumber,
                    first_name: firstName,
                    last_name: lastName
                });
            }

            const finalTotal = getDiscountedTotal();

            if (paymentMethod === 'cod') {
                // --- COD FLOW ---
                const response = await fetch('/api/orders/place-cod', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer: formData,
                        items: cart,
                        total: finalTotal,
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to place COD order');
                }

                setOrderPlaced(true);
                clearCart();
                router.push(`/order-confirmation/${result.orderId}`);

            } else if (paymentMethod === 'phonepe') {
                // --- PHONEPE FLOW ---

                // 1. Create Pending Order in DB
                const response = await fetch('/api/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer: formData,
                        items: cart,
                        total: finalTotal,
                        status: 'PENDING',
                        paymentMethod: 'PHONEPE'
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to initialize order');
                }

                const orderDbId = result.orderId;

                // 2. Initiate PhonePe Payment
                const phonePeRes = await fetch('/api/payment/phonepe/initiate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: finalTotal,
                        orderId: orderDbId,
                        mobileNumber: formData.phoneNumber || '9999999999',
                        userId: user ? user.id : `guest_${Date.now()}`
                    })
                });

                const phonePeData = await phonePeRes.json();

                if (phonePeData.success && phonePeData.redirectUrl) {
                    // 3. Redirect to PhonePe
                    window.location.href = phonePeData.redirectUrl;
                } else {
                    throw new Error(phonePeData.error || 'Failed to initiate PhonePe payment');
                }

            }

        } catch (err: any) {
            console.error('Checkout Error Full:', err);
            setError(`Error: ${err.message}` || "Something went wrong while placing your order.");
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

                        {/* 1. Login Required Announcement */}
                        {!user && (
                            <div className="bg-gray-900 p-8 rounded-lg border border-purple-500/30 text-center shadow-lg shadow-purple-900/10">
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Secure Checkout</h2>
                                    <p className="text-gray-400 max-w-md mx-auto">
                                        To ensure order security and tracking, please login to proceed with your purchase.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <Link href="/?login=true&next=/checkout" className="inline-block w-full sm:w-auto bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-gray-200 transition-all transform hover:scale-[1.02]">
                                        Login / Sign Up
                                    </Link>
                                    <p className="text-xs text-gray-500">
                                        Takes less than 30 seconds
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* 2. Shipping Address */}
                        {user && (
                            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-silver flex items-center gap-2">
                                        <span className="bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                        Shipping Address
                                    </h2>
                                    {!isEditingAddress && (
                                        <button
                                            onClick={(e) => { e.preventDefault(); setIsEditingAddress(true); }}
                                            className="text-sm text-silver underline hover:text-white"
                                            type="button"
                                        >
                                            Edit Address
                                        </button>
                                    )}
                                </div>

                                {isEditingAddress ? (
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
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-gray-400 text-sm mb-2">Email Address *</label>
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none text-white"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-gray-400 text-sm mb-2">Phone Number *</label>
                                            <input
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                className="w-full bg-black border border-gray-700 rounded px-4 py-3 focus:border-silver outline-none text-white"
                                                placeholder="+91 98765 43210"
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
                                        <div className="col-span-2 flex justify-end gap-3 mt-4 border-t border-gray-800 pt-6">
                                            {formData.address && (
                                                <button
                                                    onClick={(e) => { e.preventDefault(); setIsEditingAddress(false); }}
                                                    className="px-4 py-2 rounded text-gray-400 font-medium hover:text-white transition"
                                                    type="button"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const basic = formData.name && formData.phoneNumber && formData.address && formData.city && formData.zip;
                                                    if (!basic) {
                                                        alert("Please fill in all shipping details first.");
                                                        return;
                                                    }
                                                    setIsEditingAddress(false);
                                                }}
                                                className="bg-white text-black px-6 py-2 rounded font-medium hover:bg-gray-200 transition"
                                                type="button"
                                            >
                                                Use this address
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-black/50 border border-gray-800 p-5 rounded-lg text-gray-300">
                                        <p className="font-bold text-white mb-1 uppercase tracking-wider text-sm">{formData.name}</p>
                                        <p className="text-silver">{formData.address}</p>
                                        <p className="text-silver">{formData.city}{formData.zip ? `, ${formData.zip}` : ''}</p>
                                        <p className="mt-3 pt-3 border-t border-gray-800 text-sm text-gray-400">
                                            Phone: <span className="text-gray-300 font-medium">{formData.phoneNumber}</span>
                                        </p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Email: <span className="text-gray-300 font-medium">{formData.email}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. Payment Method */}
                        {user && (
                            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                                <h2 className="text-xl font-bold mb-6 text-silver flex items-center gap-2">
                                    <span className="bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                    Payment Method
                                </h2>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    <button
                                        onClick={() => setPaymentMethod('phonepe')}
                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${paymentMethod === 'phonepe'
                                            ? 'bg-purple-600 text-white border-purple-500'
                                            : 'bg-black text-gray-400 border-gray-700 hover:border-gray-500'
                                            }`}
                                    >
                                        PhonePe Secure
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${paymentMethod === 'cod'
                                            ? 'bg-white text-black border-white'
                                            : 'bg-black text-gray-400 border-gray-700 hover:border-gray-500'
                                            }`}
                                    >
                                        Cash on Delivery
                                    </button>

                                </div>

                                <div className="bg-black p-4 rounded border border-gray-800">
                                    {paymentMethod === 'phonepe' && (
                                        <div className="text-center py-6">
                                            <div className="bg-purple-900/20 inline-block p-4 rounded-full mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2">Pay securely with PhonePe</h3>
                                            <p className="text-gray-400 text-sm max-w-sm mx-auto">
                                                You will be redirected to PhonePe to complete your payment using UPI, Credit/Debit Card, or Wallet.
                                            </p>
                                        </div>
                                    )}

                                    {paymentMethod === 'cod' && (
                                        <div className="text-gray-400 text-center py-4">
                                            <p>Pay with cash upon delivery. Additional charges may apply.</p>
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
                                        <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden flex-shrink-0 relative">
                                            <Image
                                                src={item.product.image || '/placeholder.png'}
                                                fill
                                                className="object-cover"
                                                alt={item.product.title}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white line-clamp-2">{item.product.title}</p>
                                            <p className="text-xs text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-sm text-gray-300">₹{item.product.salePrice || item.product.price}</span>
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

                            <div className="mb-6 bg-black p-3 rounded border border-gray-800">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-900 text-silver focus:ring-offset-gray-900 focus:ring-silver"
                                    />
                                    <div className="text-xs text-gray-400">
                                        <span className="font-bold text-silver block mb-1">CHECKOUT POLICY SUMMARY</span>
                                        By placing this order, you agree to our <Link href="/refund-policy" target="_blank" className="text-blue-400 hover:underline">Returns & Refunds Policy</Link>.
                                        Eligible items may be returned or exchanged within 7 days.
                                        <br /><span className="text-red-400 font-semibold">MADE TO ORDER designs are not returnable.</span>
                                    </div>
                                </label>
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
                                        Redirecting...
                                    </span>
                                ) : (
                                    `Place Order via ${paymentMethod === 'cod' ? 'COD' : 'PhonePe'}`
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
