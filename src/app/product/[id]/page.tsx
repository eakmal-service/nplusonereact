"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import SimilarProducts from '../../../components/home/SimilarProducts';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useProducts } from '@/contexts/ProductContext';
import { Product, convertToTypeProduct } from '@/utils/productUtils';
import Header from '@/components/Header';

const ProductDetail = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const productId = parseInt(id);
  
  const { products, getProductsByCategory, getActiveProductsByCategory } = useProducts();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Fetch product data
  useEffect(() => {
    // Find product by ID from the products list
    const fetchedProduct = products.find(p => p.id === productId) || null;
    setProduct(fetchedProduct);
    
    // Fetch similar products if we have a product
    if (fetchedProduct) {
      const relatedProducts = getActiveProductsByCategory(fetchedProduct.category)
        .filter(p => p.id !== fetchedProduct.id)
        .slice(0, 4);
      setSimilarProducts(relatedProducts);
    }
  }, [productId, products, getActiveProductsByCategory]);

  // Default values for sizes
  const sizes = ['32', '34', '36', '38', '40', '42'];

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    
    // Convert product to the type expected by CartContext
    const convertedProduct = convertToTypeProduct(product);
    addToCart(convertedProduct, quantity, selectedSize);
    alert("Product added to cart successfully!");
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    
    // Convert product to the type expected by CartContext
    const convertedProduct = convertToTypeProduct(product);
    addToCart(convertedProduct, quantity, selectedSize);
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

  const handlePincodeCheck = () => {
    // Simplified validation for demo purposes
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      // Mock validation: Even pincodes are valid, odd are invalid
      const isDeliverable = parseInt(pincode) % 2 === 0;
      setDeliveryStatus(isDeliverable 
        ? "Delivery available to your location" 
        : "Sorry, delivery is not available in your area");
    } else {
      setDeliveryStatus("Please enter a valid 6-digit pincode");
    }
  };

  const toggleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      // Convert product to the type expected by WishlistContext
      const convertedProduct = convertToTypeProduct(product);
      addToWishlist(convertedProduct);
    }
  };

  if (!product) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-20 mt-20 text-center text-white">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="mt-4">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="mt-6 inline-block bg-silver hover:bg-gray-300 text-black px-6 py-2 rounded">
            Back to Home
          </Link>
        </div>
      </>
    );
  }

  // Create thumbnail array from main image
  const thumbnails = [
    { url: product.imageUrl, alt: product.title },
    { url: product.imageUrl, alt: product.title },
    { url: product.imageUrl, alt: product.title },
  ];

  return (
    <div className="bg-black text-white">
      {/* Use the Header component from homepage */}
      <Header />

      <div className="bg-gray-900 py-3 shadow-md mt-28">
        <div className="container mx-auto px-4">
          <div className="flex text-sm text-gray-400">
            <Link href="/" className="hover:text-white">HOME</Link>
            <span className="mx-2">/</span>
            <Link href={`/${product.category}`} className="hover:text-white">
              {product.category.toUpperCase().replace('-', ' ')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Product Detail Section */}
      <div className="container mx-auto px-4 pt-8 pb-8 mt-4">
        <div className="flex flex-col md:flex-row -mx-4">
          {/* Left side - Product images */}
          <div className="md:w-1/2 px-4 mb-8 md:mb-0">
            <div className="flex">
              {/* Thumbnails */}
              <div className="w-1/5 mr-4">
                {thumbnails.map((thumb, index) => (
                  <div 
                    key={index}
                    className={`mb-4 border-2 ${selectedImage === index ? 'border-white' : 'border-gray-700'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={thumb.url} 
                      alt={`${thumb.alt} thumbnail ${index + 1}`}
                      className="w-full cursor-pointer"
                    />
                  </div>
                ))}
              </div>
              
              {/* Main image */}
              <div className="w-4/5 relative">
                {product.discount && (
                  <div className="absolute top-0 left-0 z-10 px-4 py-1 text-xs text-white font-medium bg-red-600">
                    {product.discount}
                  </div>
                )}
                <img
                  src={thumbnails[selectedImage].url}
                  alt={thumbnails[selectedImage].alt}
                  className="w-full h-auto"
                />
                
                {/* Product action buttons */}
                <div className="absolute top-2 right-2 flex flex-col space-y-2">
                  <button 
                    onClick={handleShareClick}
                    className="bg-gray-800 bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full"
                    aria-label="Share"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                  <button 
                    onClick={toggleWishlist}
                    className={`${isInWishlist(product.id) ? 'bg-red-600' : 'bg-gray-800'} bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full`}
                    aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isInWishlist(product.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Product details */}
          <div className="md:w-1/2 px-4">
            <h1 className="text-2xl md:text-3xl font-bold uppercase mb-2">{product.title}</h1>
            
            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-2xl font-bold">{product.salePrice}</span>
                <span className="text-gray-400 line-through ml-3">{product.price}</span>
                <span className="text-red-500 ml-3 bg-red-900 px-2 py-1 text-sm">{product.discount}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Inclusive of all taxes</p>
            </div>

            {/* Size selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">SELECT SIZE</h3>
                <button 
                  className="text-silver underline text-sm"
                  onClick={handleSizeChartClick}
                >
                  Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`w-10 h-10 flex items-center justify-center border ${
                      selectedSize === size 
                        ? 'border-silver bg-silver text-black' 
                        : 'border-gray-600 text-white hover:border-silver'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity selector */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">QUANTITY</h3>
              <div className="flex items-center">
                <button 
                  className="w-10 h-10 border border-gray-600 flex items-center justify-center text-white"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <div className="w-14 h-10 border-t border-b border-gray-600 flex items-center justify-center">
                  {quantity}
                </div>
                <button 
                  className="w-10 h-10 border border-gray-600 flex items-center justify-center text-white"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <button 
                onClick={handleAddToCart}
                className="bg-silver hover:bg-gray-300 text-black py-3 px-6 font-medium"
              >
                ADD TO CART
              </button>
              <button 
                onClick={handleBuyNow}
                className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 font-medium"
              >
                BUY NOW
              </button>
            </div>
            
            {/* Delivery checker */}
            <div className="mb-6 p-4 bg-gray-900 rounded">
              <h3 className="font-medium mb-3">DELIVERY AVAILABILITY</h3>
              <div className="flex">
                <input 
                  type="text" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter pincode" 
                  className="flex-1 bg-black border border-gray-700 px-3 py-2 text-white"
                />
                <button 
                  onClick={handlePincodeCheck}
                  className="ml-2 bg-silver hover:bg-gray-300 text-black px-4 py-2 font-medium"
                >
                  CHECK
                </button>
              </div>
              {deliveryStatus && (
                <p className={`mt-2 text-sm ${deliveryStatus.includes('available') ? 'text-green-400' : 'text-red-400'}`}>
                  {deliveryStatus}
                </p>
              )}
            </div>
            
            {/* Product description */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 border-b border-gray-700 pb-1">PRODUCT DETAILS</h3>
              <p className="text-gray-300">
                {product.title} - {product.category.replace('-', ' ')} - {product.subcategory}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar Products */}
      <div className="bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((product) => (
              <div key={product.id} className="bg-black rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition">
                <Link href={`/product/${product.id}`}>
                  <div className="relative h-64 w-full">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                    {product.discount && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
                        {product.discount}
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-white font-medium text-lg hover:text-silver transition">{product.title}</h3>
                  </Link>
                  
                  <div className="mt-2 flex items-center">
                    <span className="text-silver font-bold">{product.salePrice}</span>
                    <span className="ml-2 text-gray-500 line-through text-sm">{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Share This Product</h3>
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
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-20 h-20 object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold">{product.title}</h4>
                  <p className="text-sm text-gray-400">{product.salePrice}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </button>
              <button className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.004 22l1.352-4.968A9.954 9.954 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.954 9.954 0 0 1-5.03-1.355L2.004 22zM8.391 7.308a.961.961 0 0 0-.371.1 1.293 1.293 0 0 0-.294.228c-.12.113-.188.211-.261.306A2.729 2.729 0 0 0 6.9 9.62c.002.49.13.967.33 1.413.409.902 1.082 1.857 1.971 2.742.214.213.423.427.648.626a9.448 9.448 0 0 0 3.84 2.046l.569.087c.185.01.37-.004.556-.013a1.99 1.99 0 0 0 .833-.231c.166-.088.244-.132.383-.22 0 0 .043-.028.125-.09.135-.1.218-.171.33-.288.083-.086.155-.187.21-.302.078-.163.156-.474.188-.733.024-.198.017-.306.014-.373-.004-.107-.093-.218-.19-.265l-.582-.261s-.87-.379-1.401-.621a.498.498 0 0 0-.177-.041.482.482 0 0 0-.378.127v-.002c-.005 0-.072.057-.795.933a.35.35 0 0 1-.368.13 1.416 1.416 0 0 1-.191-.066c-.124-.052-.167-.072-.252-.109l-.005-.002a6.01 6.01 0 0 1-1.57-1c-.126-.11-.243-.23-.363-.346a6.296 6.296 0 0 1-1.02-1.268l-.059-.095a.923.923 0 0 1-.102-.205c-.038-.147.061-.265.061-.265s.243-.266.356-.41a4.38 4.38 0 0 0 .263-.373c.118-.19.155-.385.093-.536-.28-.684-.57-1.365-.868-2.041-.059-.134-.234-.23-.393-.249-.054-.006-.108-.012-.162-.016a3.385 3.385 0 0 0-.403.004z" />
                </svg>
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </button>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Or copy link</p>
              <div className="flex">
                <input 
                  type="text" 
                  readOnly
                  value={`https://nplusone.com/product/${product.id}`}
                  className="flex-1 bg-black border border-gray-700 px-3 py-2 text-white text-sm truncate"
                />
                <button className="ml-2 bg-silver hover:bg-gray-300 text-black px-4 py-2 font-medium text-sm">
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-lg max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Size Chart</h3>
              <button 
                onClick={() => setShowSizeChart(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left">Size</th>
                    <th className="px-4 py-2 text-left">Bust (in)</th>
                    <th className="px-4 py-2 text-left">Waist (in)</th>
                    <th className="px-4 py-2 text-left">Hip (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="px-4 py-2">32</td>
                    <td className="px-4 py-2">32</td>
                    <td className="px-4 py-2">26</td>
                    <td className="px-4 py-2">35</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="px-4 py-2">34</td>
                    <td className="px-4 py-2">34</td>
                    <td className="px-4 py-2">28</td>
                    <td className="px-4 py-2">37</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="px-4 py-2">36</td>
                    <td className="px-4 py-2">36</td>
                    <td className="px-4 py-2">30</td>
                    <td className="px-4 py-2">39</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="px-4 py-2">38</td>
                    <td className="px-4 py-2">38</td>
                    <td className="px-4 py-2">32</td>
                    <td className="px-4 py-2">41</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="px-4 py-2">40</td>
                    <td className="px-4 py-2">40</td>
                    <td className="px-4 py-2">34</td>
                    <td className="px-4 py-2">43</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">42</td>
                    <td className="px-4 py-2">42</td>
                    <td className="px-4 py-2">36</td>
                    <td className="px-4 py-2">45</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="mt-4 text-sm text-gray-400">
              Note: These are general measurements and may vary slightly by style.
              For the best fit, please measure yourself and compare with the size chart.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail; 