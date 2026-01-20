"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RecommendedProducts from '@/components/home/RecommendedProducts';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import Header from '@/components/Header';
import { Product } from '@/types';
import { checkDeliveryAvailability } from '@/utils/api';
import ProductReviews from '@/components/reviews/ProductReviews';
import SizeChart from '@/components/product/SizeChart';

import { addToRecentlyViewed } from '@/utils/recentlyViewed';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';
import { getCategoryUrl } from '@/utils/categoryUtils';

interface ProductDetailClientProps {
    product: Product;
    similarProducts: Product[];
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product, similarProducts }) => {
    const router = useRouter();

    // Track detailed view
    useEffect(() => {
        addToRecentlyViewed(product);
    }, [product]);

    // Data states
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [pincode, setPincode] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
    const [productDetailsOpen, setProductDetailsOpen] = useState(false);
    const [washCareOpen, setWashCareOpen] = useState(false);
    const [deliveryReturnsOpen, setDeliveryReturnsOpen] = useState(false);
    const [productDeclarationOpen, setProductDeclarationOpen] = useState(false);

    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }

        addToCart(product, quantity, selectedSize);
        alert("Product added to cart successfully!");
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }

        addToCart(product, quantity, selectedSize);
        router.push('/checkout');
    };

    const handleShareClick = () => {
        setShowShareModal(true);
    };

    const handleShareClose = () => {
        setShowShareModal(false);
    };

    const handleSizeChartClick = () => {
        setShowSizeChart(true);
    };

    const handlePincodeCheck = async () => {
        // Validate pincode format
        if (pincode.length === 6 && /^\d+$/.test(pincode)) {
            // Use the API service
            const result = await checkDeliveryAvailability(pincode);

            if (result.available) {
                setDeliveryStatus("Delivery available to your location");
                // Optional: Log successful client check if rare, but server already logs "PINCODE_CHECK" "SUCCESS"
            } else {
                setDeliveryStatus(result.message);
                // Log Client Error if server side logging wasn't sufficient or for client-specific context
                // Server aleady logs 'PINCODE_CHECK' 'FAILURE' inside the API.
                // But we can log if the UI displayed an error to the user effectively.
            }
        } else {
            setDeliveryStatus("Please enter a valid 6-digit pincode");
            // Log User Input Error
            import('@/utils/logger').then(({ logEvent }) => {
                logEvent({
                    eventType: 'CLIENT_ERROR',
                    status: 'WARNING',
                    message: 'Invalid Pincode Format Entered',
                    requestData: { pincode }
                });
            });
        }
    };

    const toggleWishlist = () => {
        const productId = product.id;
        if (isInWishlist(productId)) {
            removeFromWishlist(productId);
        } else {
            addToWishlist(product);
        }
    };

    // Default sizes if not provided
    const sizes = product?.sizes?.length ? product.sizes : (product?.availableSizes || ['S', 'M', 'L', 'XL', 'XXL']);

    // Create thumbnail array from product images
    const thumbnails = (product?.images && product.images.length > 0)
        ? product.images.map((img: { url: string; alt?: string }) => ({
            url: optimizeCloudinaryUrl(img.url),
            alt: img.alt || product.title || ''
        }))
        : (product?.thumbnails && product.thumbnails.length > 0)
            ? product.thumbnails
            : (product?.imageUrls && product.imageUrls.length > 0)
                ? product.imageUrls.map((url: string) => ({
                    url: optimizeCloudinaryUrl(url),
                    alt: product.alt || product.title || ''
                }))
                : [{ url: optimizeCloudinaryUrl(product?.image || product?.imageUrl) || '/placeholder.png', alt: product?.title || '' }];

    return (
        <div className="bg-black text-silver">
            <Header />

            <div className="bg-black py-4 mt-28 hidden md:block">
                <div className="container mx-auto px-4">
                    <div className="flex text-[#C0C0C0] text-[18px] items-center">
                        <Link href="/" className="hover:underline">Home</Link>
                        <span className="mx-1 text-[14px]">&gt;</span>
                        <Link href={getCategoryUrl(product?.category)} className="hover:underline">
                            {(product?.category || 'Clothing').replace('-', ' ')}
                        </Link>
                        <span className="mx-1 text-[14px]">&gt;</span>
                        <span className="truncate max-w-[200px] md:max-w-none hover:underline cursor-pointer">{product?.title}</span>
                    </div>
                </div>
            </div>

            {/* Product Detail Section */}
            <div className="container mx-auto px-4 pt-24 md:pt-4 pb-8 mt-4 md:mt-4">
                <div className="flex flex-col md:flex-row -mx-4">
                    {/* Left side - Product images */}
                    <div className="md:w-1/2 px-4 mb-8 md:mb-0">
                        <div className="flex flex-col-reverse md:flex-row">
                            {/* Thumbnails */}
                            <div className="w-full md:w-1/5 md:mr-4 mt-4 md:mt-0 max-h-[500px] flex flex-row md:flex-col items-center overflow-x-auto md:overflow-y-auto md:overflow-x-hidden space-x-2 md:space-x-0">
                                {thumbnails.map((thumb: { url: string; alt: string }, index: number) => (
                                    <div
                                        key={index}
                                        className={`flex-shrink-0 w-20 md:w-full border-2 cursor-pointer transition-all duration-200 ${selectedImage === index ? 'border-silver' : 'border-gray-700'} md:mb-4`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <div className="relative w-full h-full aspect-square">
                                            <Image
                                                src={thumb.url}
                                                alt={`${thumb.alt || product?.title} thumbnail ${index + 1}`}
                                                fill
                                                sizes="80px"
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Main image with zoom */}
                            <div className="w-full md:w-4/5 relative flex justify-center items-center bg-gray-900 h-[500px]">
                                <div className="relative h-full w-full overflow-hidden cursor-zoom-in group"
                                    onMouseMove={(e) => {
                                        const container = e.currentTarget;
                                        const { left, top, width, height } = container.getBoundingClientRect();
                                        const x = (e.clientX - left) / width;
                                        const y = (e.clientY - top) / height;

                                        const img = container.querySelector('img');
                                        if (img) {
                                            img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
                                        }
                                    }}
                                >
                                    {(product?.badge || product?.discount) && (
                                        <div
                                            className="absolute top-0 left-0 z-20 px-3 py-1 text-white font-bold text-sm tracking-wide rounded-sm shadow-md"
                                            style={{ backgroundColor: product.discountBadgeColor || '#DC2626' }}
                                        >
                                            {product.badge || (product.discount && product.discount.includes('%') ? product.discount : `${product.discount}% OFF`)}
                                        </div>
                                    )}
                                    <Image
                                        src={thumbnails && thumbnails[selectedImage] ? thumbnails[selectedImage].url : '/placeholder.png'}
                                        alt={(thumbnails && thumbnails[selectedImage] ? thumbnails[selectedImage].alt : product?.title) || ''}
                                        fill
                                        priority={selectedImage === 0}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        quality={90}
                                        className="object-contain transition-transform duration-300 group-hover:scale-150"
                                    />
                                </div>

                                {/* Product action buttons */}
                                <div className="absolute top-2 right-2 flex flex-col space-y-2">
                                    <button
                                        onClick={toggleWishlist}
                                        className={`${isInWishlist(product.id) ? 'bg-red-600' : 'bg-white'} p-2 rounded-full shadow-md hover:bg-opacity-90 transition-all`}
                                        aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isInWishlist(product.id) ? 'text-silver' : 'text-gray-800'}`} fill={isInWishlist(product.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleShareClick}
                                        className="bg-white p-2 rounded-full shadow-md hover:bg-opacity-90 transition-all"
                                        aria-label="Share"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Product details */}
                    <div className="md:w-1/2 px-4">
                        <h1 className="text-2xl md:text-3xl font-semibold uppercase mb-3 text-silver">{product?.title}</h1>

                        {/* Price section */}
                        <div className="mb-6">
                            <div className="flex items-center">
                                <p className="text-sm text-gray-400">MRP</p>
                                <span className="text-4xl font-extrabold ml-2 text-silver">₹{product.salePrice}</span>
                                {product.price && product.price !== product.salePrice && (
                                    <span className="text-gray-500 line-through ml-3 text-lg">₹{product.price}</span>
                                )}
                                {product.discount && (
                                    <span className="text-red-500 ml-3 bg-red-900 px-2 py-1 text-sm font-bold">{product.discount}</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-400 mt-1">Inclusive of all taxes</p>
                        </div>

                        {/* Color selection */}
                        {product?.colorOptions && product.colorOptions.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-medium mb-3 text-silver">SELECT COLOR</h3>
                                <div className="flex space-x-3">
                                    {product.colorOptions.map((color: any, index: number) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-silver flex items-center justify-center">
                                                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: color.code }}></div>
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <p className="text-sm font-medium text-gray-300">{color.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size selection */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-silver">SELECT SIZE</h3>
                                <button
                                    className="text-silver underline text-sm flex items-center"
                                    onClick={handleSizeChartClick}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Size Guide
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size: string) => (
                                    <button
                                        key={size}
                                        className={`w-12 h-12 flex items-center justify-center border rounded-full ${selectedSize === size
                                            ? 'border-silver bg-silver text-black font-bold'
                                            : 'border-gray-600 text-silver hover:border-silver'
                                            }`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action buttons (Desktop) */}
                        <div className="hidden md:grid mb-6 grid-cols-2 gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="bg-silver hover:bg-gray-300 text-black py-3 px-6 font-medium transition-all"
                            >
                                ADD TO BAG
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="bg-red-600 hover:bg-red-700 text-silver py-3 px-6 font-medium transition-all"
                            >
                                BUY NOW
                            </button>
                        </div>

                        {/* Delivery section */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-3 text-silver flex items-center">
                                DELIVERY
                                <span className="ml-2 text-xs font-bold text-green-500 bg-green-900/30 px-2 py-0.5 rounded">FREE</span>
                            </h3>
                            <div className="flex mb-3">
                                <input
                                    type="text"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    placeholder="Enter pincode"
                                    className="flex-1 bg-gray-800 border border-gray-700 px-3 py-2 text-silver"
                                />
                                <button
                                    onClick={handlePincodeCheck}
                                    className="ml-2 bg-transparent hover:bg-gray-700 text-silver px-4 py-2 font-medium border border-gray-600 uppercase text-sm"
                                >
                                    CHECK
                                </button>
                            </div>
                            {deliveryStatus && (
                                <p className={`text-sm ${deliveryStatus.includes('available') ? 'text-green-500' : 'text-red-500'}`}>
                                    {deliveryStatus}
                                </p>
                            )}

                            {/* Delivery features */}
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm text-gray-300">Free Shipping</span>
                                </div>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                    <span className="text-sm text-gray-300">7 Days Easy Return*</span>
                                </div>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span className="text-sm text-gray-300">Assured Quality</span>
                                </div>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="text-sm text-gray-300">COD Available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Product Information */}
            <div className="container mx-auto px-4 py-8">
                {/* Product Details Accordion */}
                <div className="border-t border-b border-gray-700">
                    <div className="py-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium text-lg text-silver">PRODUCT DETAILS</h3>
                        </div>
                    </div>

                    <div className="pb-4">
                        <div
                            className="text-gray-400 mb-4 prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: product?.description || 'No description available' }}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                {product?.brandName && (
                                    <div className="flex justify-between py-2 border-b border-gray-700">
                                        <span className="font-medium text-gray-300">Brand Name</span>
                                        <span className="text-silver">{product.brandName}</span>
                                    </div>
                                )}
                                {(product?.styleCode || product?.sku) && (
                                    <div className="flex justify-between py-2 border-b border-gray-700">
                                        <span className="font-medium text-gray-300">Style Code</span>
                                        <span className="text-silver">{product.styleCode || product.sku}</span>
                                    </div>
                                )}
                                {product?.fabric && (
                                    <div className="flex justify-between py-2 border-b border-gray-700">
                                        <span className="font-medium text-gray-300">Fabric</span>
                                        <span className="text-silver">{product.fabric}</span>
                                    </div>
                                )}
                                {product?.topPattern && (
                                    <div className="flex justify-between py-2 border-b border-gray-700">
                                        <span className="font-medium text-gray-300">Pattern</span>
                                        <span className="text-silver">{product.topPattern}</span>
                                    </div>
                                )}
                                {product?.fit && (
                                    <div className="flex justify-between py-2 border-b border-gray-700">
                                        <span className="font-medium text-gray-300">Fit</span>
                                        <span className="text-silver">{product.fit}</span>
                                    </div>
                                )}
                                {product?.productWeight && (
                                    <div className="flex justify-between py-2 border-b border-gray-700">
                                        <span className="font-medium text-gray-300">Product Weight</span>
                                        <span className="text-silver">{product.productWeight}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                {product?.bottomFabric && (
                                    <div className="flex justify-between py-2 border-b border-gray-700">
                                        <span className="font-medium text-gray-300">Bottom type</span>
                                        <span className="text-silver">{product.bottomFabric}</span>
                                    </div>
                                )}
                                {product?.fabricDupattaStole && (
                                    <div className="flex justify-between py-2 border-b border-gray-700">
                                        <span className="font-medium text-gray-300">Dupatta/Stole Fabric</span>
                                        <span className="text-silver">{product.fabricDupattaStole}</span>
                                    </div>
                                )}
                                {product?.setContains && (
                                    <div className="flex justify-between py-2 border-b border-gray-700">
                                        <span className="font-medium text-gray-300">Set Contains</span>
                                        <span className="text-silver">{product.setContains}</span>
                                    </div>
                                )}
                                {product?.workType && (
                                    <div className="flex justify-between py-2 border-b border-gray-700">
                                        <span className="font-medium text-gray-300">Work Type</span>
                                        <span className="text-silver">{product.workType}</span>
                                    </div>
                                )}
                                {product?.neckline && (
                                    <div className="flex justify-between py-2 border-b border-gray-700">
                                        <span className="font-medium text-gray-300">Neck/Neckline</span>
                                        <span className="text-silver">{product.neckline}</span>
                                    </div>
                                )}
                                {product?.sleeveDetail && (
                                    <div className="flex justify-between py-2 border-b border-gray-700">
                                        <span className="font-medium text-gray-300">Sleeve Detail</span>
                                        <span className="text-silver">{product.sleeveDetail}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wash & Care Accordion */}
                <div className="border-b border-gray-700">
                    <div className="py-4 cursor-pointer" onClick={() => setWashCareOpen(!washCareOpen)}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-silver" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="font-medium text-lg text-silver">WASH & CARE</h3>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 text-gray-400 transition-transform ${washCareOpen ? 'transform rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    {washCareOpen && (
                        <div className="pb-4">
                            <ul className="list-disc pl-5 text-gray-400 space-y-1">
                                {product?.washCare ? (
                                    product.washCare.split(/\r?\n|\\n/).filter((line: string) => line.trim() !== '').map((line: string, index: number) => (
                                        <li key={index} className="mb-2 last:mb-0 flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>{line.trim()}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li>No wash & care instructions available.</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Delivery & Returns Accordion */}
                <div className="border-b border-gray-700">
                    <div className="py-4 cursor-pointer" onClick={() => setDeliveryReturnsOpen(!deliveryReturnsOpen)}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-silver" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 012-2v0a2 2 0 012 2m0 0a2 2 0 01-2-2m2 4H9m-2 0H5m14 0h2m-4-2a2 2 0 012-2v0a2 2 0 012 2m0 0a2 2 0 01-2 2v0a2 2 0 01-2-2" />
                                </svg>
                                <h3 className="font-medium text-lg text-silver">DELIVERY & RETURNS</h3>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 text-gray-400 transition-transform ${deliveryReturnsOpen ? 'transform rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    {deliveryReturnsOpen && (
                        <div className="pb-4">
                            <h4 className="font-medium mb-2 text-gray-300">Delivery Policy:</h4>
                            <ul className="list-disc pl-5 text-gray-400 space-y-1 mb-4">
                                <li>Free shipping on all orders</li>
                                <li>Standard delivery: 2-4 working days</li>
                                <li>Timeline may vary based on location</li>
                            </ul>

                            <h4 className="font-medium mb-2 text-gray-300">Return Policy:</h4>
                            <ul className="list-disc pl-5 text-gray-400 space-y-1">
                                <li>Returns/Exchanges within <strong>7 days</strong> of delivery</li>
                                <li>Must be unused with original tags</li>
                                <li><Link href="/refund-policy" className="text-blue-400 hover:underline">View Full Policy</Link></li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Product Declaration Accordion */}
                <div className="border-b border-gray-700">
                    <div className="py-4 cursor-pointer" onClick={() => setProductDeclarationOpen(!productDeclarationOpen)}>
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium text-lg text-silver">PRODUCT DECLARATION</h3>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 text-gray-400 transition-transform ${productDeclarationOpen ? 'transform rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    {productDeclarationOpen && (
                        <div className="pb-4">
                            <p className="text-gray-400 mb-2">
                                We strive to display as accurately as possible the colors of our products. However, due to individual monitor settings and variations, the actual colors may differ slightly from what appears on your screen.
                            </p>
                            <p className="text-gray-400">
                                All measurements are approximate. Please allow for a slight variation in the stated dimensions due to the handcrafted nature of our products.
                            </p>
                        </div>
                    )}
                </div>

                {/* Customer Support Section */}
                <div className="mt-8">
                    <h3 className="font-medium text-lg mb-4 text-silver">HAVE A QUESTION? WE ARE HERE TO HELP!</h3>
                    <div className="flex flex-col space-y-3">
                        {/* Phone */}
                        <div className="flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-silver flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="font-semibold text-silver">+91 8329208323</span>
                        </div>

                        {/* Days - Calendar Icon */}
                        <div className="flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-silver flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Monday - Sunday</span>
                        </div>

                        {/* Time - Clock Icon */}
                        <div className="flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-silver flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Call Time: 10:30 AM - 7:00 PM</span>
                        </div>

                        {/* Email - Envelope Icon */}
                        <div className="flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-silver flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>Email: <a href="mailto:support@nplusonefashion.com" className="text-blue-400 hover:underline">support@nplusonefashion.com</a></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <RecommendedProducts
                    products={similarProducts}
                    title="SIMILAR PRODUCTS"
                />
            )}

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Share This Product</h3>
                            <button
                                onClick={handleShareClose}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center mb-4">
                                <div className="w-20 h-20 relative mr-4">
                                    <Image
                                        src={optimizeCloudinaryUrl(product.image || (product.images && product.images[0]?.url)) || '/placeholder.png'}
                                        alt={product.title || 'Product Image'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{product.title}</h4>
                                    <p className="text-sm text-gray-400">{product.salePrice}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-transform hover:scale-110">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                                </svg>
                            </button>
                            <button className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full transition-transform hover:scale-110">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                                </svg>
                            </button>
                            <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-transform hover:scale-110">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M2.004 22l1.352-4.968A9.954 9.954 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.954 9.954 0 0 1-5.03-1.355L2.004 22zM8.391 7.308a.961.961 0 0 0-.371.1 1.293 1.293 0 0 0-.294.228c-.12.113-.188.211-.261.306A2.729 2.729 0 0 0 6.9 9.62c.002.49.13.967.33 1.413.409.902 1.082 1.857 1.971 2.742.214.213.423.427.648.626a9.448 9.448 0 0 0 3.84 2.046l.569.087c.185.01.37-.004.556-.013a1.99 1.99 0 0 0 .833-.231c.166-.088.244-.132.383-.22 0 0 .043-.028.125-.09.135-.1.218-.171.33-.288.083-.086.155-.187.21-.302.078-.163.156-.474.188-.733.024-.198.017-.306.014-.373-.004-.107-.093-.218-.19-.265l-.582-.261s-.87-.379-1.401-.621a.498.498 0 0 0-.177-.041.482.482 0 0 0-.378.127v-.002c-.005 0-.072.057-.795.933a.35.35 0 0 1-.368.13 1.416 1.416 0 0 1-.191-.066c-.124-.052-.167-.072-.252-.109l-.005-.002a6.01 6.01 0 0 1-1.57-1c-.126-.11-.243-.23-.363-.346a6.296 6.296 0 0 1-1.02-1.268l-.059-.095a.923.923 0 0 1-.102-.205c-.038-.147.061-.265.061-.265s.243-.266.356-.41a4.38 4.38 0 0 0 .263-.373c.118-.19.155-.385.093-.536-.28-.684-.57-1.365-.868-2.041-.059-.134-.234-.23-.393-.249-.054-.006-.108-.012-.162-.016a3.385 3.385 0 0 0-.403.004z" />
                                </svg>
                            </button>
                            {/* Telegram share button */}
                            <a
                                href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(product?.title || 'Check out this product')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-transform hover:scale-110 cursor-pointer block"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Size Chart Modal */}
            <SizeChart isOpen={showSizeChart} onClose={() => setShowSizeChart(false)} category={product.category} title={product.title} />
            {/* Reviews Section */}
            <ProductReviews productId={product.id.toString()} />

            {/* Mobile Sticky Action Buttons */}
            <div className="fixed bottom-0 left-0 w-full z-50 bg-black border-t border-gray-800 p-2 md:hidden grid grid-cols-2 gap-2">
                <button
                    onClick={handleAddToCart}
                    className="bg-white text-black py-3 font-bold text-sm tracking-wide uppercase"
                >
                    ADD TO BAG
                </button>
                <button
                    onClick={handleBuyNow}
                    className="bg-red-600 text-white py-3 font-bold text-sm tracking-wide uppercase"
                >
                    BUY NOW
                </button>
            </div>

            {/* Spacer for sticky buttons */}
            <div className="h-16 md:hidden"></div>
        </div >
    );
};

export default ProductDetailClient;
