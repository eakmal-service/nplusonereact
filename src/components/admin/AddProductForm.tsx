"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import { Product } from '../../utils/productUtils';
import { useProducts } from '../../contexts/ProductContext';

// Define category options
const CATEGORIES = [
  { value: 'tshirt-top', label: 'T-Shirts & Top Wear' },
  { value: 'night-bottoms', label: 'Night Pants & Bottom Wear' },
  { value: 'girls-wear', label: 'Child Wear' },
  { value: 'co-ord-sets', label: 'Co-ord Sets' },
  { value: 'ladies-night-dress', label: 'Ladies Night Dress' },
  { value: 'sarees', label: 'Sarees' },
  { value: 'kurtis', label: 'Kurtis' },
];

// Define subcategory options based on category
const SUBCATEGORIES: { [key: string]: { value: string, label: string }[] } = {
  'tshirt-top': [
    { value: 'tshirt', label: 'T-Shirts' },
    { value: 'kurta', label: 'Kurtas' },
    { value: 'top', label: 'Tops' },
  ],
  'night-bottoms': [
    { value: 'pajama', label: 'Pajamas' },
    { value: 'night-pants', label: 'Night Pants' },
    { value: 'bottoms', label: 'Bottoms' },
  ],
  'girls-wear': [
    { value: 'frocks', label: 'Frocks' },
    { value: 'skirts', label: 'Skirts' },
    { value: 'tops', label: 'Tops' },
  ],
  'co-ord-sets': [
    { value: 'casual', label: 'Casual Sets' },
    { value: 'formal', label: 'Formal Sets' },
    { value: 'party', label: 'Party Sets' },
  ],
  'ladies-night-dress': [
    { value: 'night-gowns', label: 'Night Gowns' },
    { value: 'night-sets', label: 'Night Sets' },
    { value: 'night-suits', label: 'Night Suits' },
  ],
  'sarees': [
    { value: 'silk', label: 'Silk Sarees' },
    { value: 'cotton', label: 'Cotton Sarees' },
    { value: 'georgette', label: 'Georgette Sarees' },
    { value: 'embroidered', label: 'Embroidered Sarees' },
  ],
  'kurtis': [
    { value: 'printed', label: 'Printed Kurtis' },
    { value: 'embroidered', label: 'Embroidered Kurtis' },
    { value: 'anarkali', label: 'Anarkali Kurtis' },
    { value: 'straight', label: 'Straight Kurtis' },
  ],
};

// Size options
const SIZE_OPTIONS = ['32', '34', '36', '38', '40', '42'];

// Color name to hex mapping
const COLOR_MAPPING: { [key: string]: string } = {
  'black': '#000000',
  'white': '#FFFFFF',
  'red': '#FF0000',
  'green': '#008000',
  'blue': '#0000FF',
  'yellow': '#FFFF00',
  'purple': '#800080',
  'orange': '#FFA500',
  'pink': '#FFC0CB',
  'brown': '#A52A2A',
  'gray': '#808080',
  'silver': '#C0C0C0',
  'gold': '#FFD700',
  'navy': '#000080',
  'teal': '#008080',
  'maroon': '#800000',
  'olive': '#808000',
  'lime': '#00FF00',
  'aqua': '#00FFFF',
  'fuchsia': '#FF00FF',
  'midnight blue': '#191970',
  'crimson': '#DC143C',
  'coral': '#FF7F50',
  'khaki': '#F0E68C',
  'indigo': '#4B0082',
  'lavender': '#E6E6FA',
  'turquoise': '#40E0D0',
  'beige': '#F5F5DC',
  'ivory': '#FFFFF0',
  'salmon': '#FA8072',
  'forest green': '#228B22',
  'royal blue': '#4169E1',
  'slate gray': '#708090',
  'hot pink': '#FF69B4',
  'chocolate': '#D2691E',
  'skyblue': '#87CEEB',
};

// Interface for form values
interface ProductFormValues {
  title: string;
  description: string;
  mrp: string;
  salePrice: string;
  discount: string;
  category: string;
  subcategory: string;
  images: File[];
  colorName: string;
  colorCode: string;
  sizes: string[];
  stockQuantity: { [size: string]: string };
  material: string;
  careInstructions: string;
  tags: string;
  status: 'active' | 'inactive' | 'draft';
}

const AddProductForm: React.FC = () => {
  // Initial form state
  const initialFormState: ProductFormValues = {
    title: '',
    description: '',
    mrp: '',
    salePrice: '',
    discount: '',
    category: '',
    subcategory: '',
    images: [],
    colorName: '',
    colorCode: '#000000',
    sizes: [],
    stockQuantity: {},
    material: '',
    careInstructions: '',
    tags: '',
    status: 'active',
  };

  // Form state
  const [formValues, setFormValues] = useState<ProductFormValues>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({});
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableSubcategories, setAvailableSubcategories] = useState<{ value: string, label: string }[]>([]);
  const [isColorPickerManuallyChanged, setIsColorPickerManuallyChanged] = useState(false);

  const { saveNewProduct } = useProducts();

  // Update available subcategories when category changes
  useEffect(() => {
    if (formValues.category) {
      setAvailableSubcategories(SUBCATEGORIES[formValues.category] || []);
      // Reset subcategory when category changes
      setFormValues(prev => ({ ...prev, subcategory: '' }));
    } else {
      setAvailableSubcategories([]);
    }
  }, [formValues.category]);

  // Calculate discount when MRP or sale price changes
  useEffect(() => {
    const { mrp, salePrice } = formValues;
    if (mrp && salePrice && parseFloat(mrp) > 0 && parseFloat(salePrice) > 0) {
      const mrpValue = parseFloat(mrp);
      const salePriceValue = parseFloat(salePrice);
      if (mrpValue > salePriceValue) {
        const discountValue = ((mrpValue - salePriceValue) / mrpValue) * 100;
        const roundedDiscount = Math.round(discountValue);
        setFormValues(prev => ({ ...prev, discount: roundedDiscount.toString() }));
      } else {
        setFormValues(prev => ({ ...prev, discount: '0' }));
      }
    }
  }, [formValues.mrp, formValues.salePrice]);

  // Smart color picker: update color code when color name changes
  useEffect(() => {
    if (!isColorPickerManuallyChanged && formValues.colorName) {
      const lowercaseColorName = formValues.colorName.toLowerCase();
      
      // Check for exact match
      if (COLOR_MAPPING[lowercaseColorName]) {
        setFormValues(prev => ({ ...prev, colorCode: COLOR_MAPPING[lowercaseColorName] }));
        return;
      }
      
      // Check for partial match (if color name contains known color)
      for (const [colorName, hexCode] of Object.entries(COLOR_MAPPING)) {
        if (lowercaseColorName.includes(colorName)) {
          setFormValues(prev => ({ ...prev, colorCode: hexCode }));
          return;
        }
      }
    }
  }, [formValues.colorName, isColorPickerManuallyChanged]);

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is filled
    if (errors[name as keyof ProductFormValues]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Reset manual color picker flag when color name changes
    if (name === 'colorName') {
      setIsColorPickerManuallyChanged(false);
    }
  };

  // Handle color picker changes
  const handleColorPickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    setIsColorPickerManuallyChanged(true);
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormValues(prev => ({ ...prev, [name]: checked }));
  };

  // Handle size checkboxes
  const handleSizeChange = (size: string) => {
    setFormValues(prev => {
      const updatedSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      
      // Initialize stock quantity for selected size if not already set
      const updatedStockQuantity = { ...prev.stockQuantity };
      if (!prev.sizes.includes(size) && !updatedStockQuantity[size]) {
        updatedStockQuantity[size] = '10'; // Default value
      }
      
      return {
        ...prev,
        sizes: updatedSizes,
        stockQuantity: updatedStockQuantity
      };
    });
  };

  // Handle stock quantity changes
  const handleStockQuantityChange = (size: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      stockQuantity: {
        ...prev.stockQuantity,
        [size]: value
      }
    }));
  };

  // Handle image uploads
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Limit to 5 images
    const selectedFiles = Array.from(files).slice(0, 5);
    
    setFormValues(prev => ({
      ...prev,
      images: [...prev.images, ...selectedFiles].slice(0, 5)
    }));

    // Create preview URLs
    const newImagePreviews = Array.from(selectedFiles).map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newImagePreviews].slice(0, 5));
  };

  // Remove an image
  const handleRemoveImage = (index: number) => {
    setFormValues(prev => {
      const updatedImages = [...prev.images];
      updatedImages.splice(index, 1);
      return { ...prev, images: updatedImages };
    });

    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setImagePreviewUrls(prev => {
      const updatedPreviews = [...prev];
      updatedPreviews.splice(index, 1);
      return updatedPreviews;
    });
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormValues, string>> = {};
    
    // Required fields validation
    if (!formValues.title.trim()) newErrors.title = 'Product title is required';
    if (!formValues.description.trim()) newErrors.description = 'Product description is required';
    if (!formValues.mrp.trim()) newErrors.mrp = 'MRP is required';
    if (!formValues.salePrice.trim()) newErrors.salePrice = 'Sale price is required';
    if (!formValues.category) newErrors.category = 'Category is required';
    if (formValues.images.length === 0) newErrors.images = 'At least one product image is required';
    if (!formValues.colorName.trim()) newErrors.colorName = 'Color name is required';
    if (formValues.sizes.length === 0) newErrors.sizes = 'At least one size option is required';
    if (!formValues.material.trim()) newErrors.material = 'Material is required';
    
    // Check if all selected sizes have stock quantity
    formValues.sizes.forEach(size => {
      if (!formValues.stockQuantity[size] || formValues.stockQuantity[size] === '0') {
        newErrors.stockQuantity = 'Stock quantity is required for all selected sizes';
      }
    });
    
    // Numeric validation
    if (formValues.mrp && !/^\d+(\.\d{1,2})?$/.test(formValues.mrp)) {
      newErrors.mrp = 'MRP must be a valid number';
    }
    
    if (formValues.salePrice && !/^\d+(\.\d{1,2})?$/.test(formValues.salePrice)) {
      newErrors.salePrice = 'Sale price must be a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format the product data
      const productData: Omit<Product, 'id'> = {
        title: formValues.title,
        category: formValues.category,
        subcategory: formValues.subcategory || '',
        price: `₹${formValues.mrp}`,
        salePrice: `₹${formValues.salePrice}`,
        discount: `${formValues.discount}% OFF`,
        imageUrl: imagePreviewUrls.length > 0 ? 
          imagePreviewUrls[0] : 
          'https://placehold.co/300x400/gray/white?text=Product',
        stockQuantity: Object.values(formValues.stockQuantity).reduce(
          (total, qty) => total + parseInt(qty || '0'), 0
        ),
        viewCount: 0,
        cartCount: 0,
        purchaseCount: 0,
        dateAdded: new Date().toISOString().split('T')[0],
        status: formValues.status,
      };
      
      // Save product using context
      const savedProduct = saveNewProduct(productData);
      
      console.log('Product saved:', savedProduct);
      
      // Show success message
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      // Reset form
      setFormValues(initialFormState);
      setImagePreviewUrls([]);
      
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    // Revoke all object URLs to avoid memory leaks
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    
    // Reset form state
    setFormValues(initialFormState);
    setImagePreviewUrls([]);
    setErrors({});
    setIsColorPickerManuallyChanged(false);
  };

  return (
    <div className="bg-black rounded-lg p-6">
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-800 text-white rounded-lg animate-fade-in">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p className="font-medium">Product saved successfully!</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-silver border-b border-gray-700 pb-2">Basic Information</h3>
          
          {/* Product Title */}
          <div>
            <label htmlFor="title" className="block mb-1 font-medium text-gray-200">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formValues.title}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              placeholder="e.g. Black Cotton Printed Tiered Dress"
            />
            {errors.title && <p className="text-red-500 mt-1 text-sm error-message">{errors.title}</p>}
          </div>
          
          {/* Product Description */}
          <div>
            <label htmlFor="description" className="block mb-1 font-medium text-gray-200">
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              placeholder="Detailed description of the product..."
            ></textarea>
            {errors.description && <p className="text-red-500 mt-1 text-sm error-message">{errors.description}</p>}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-silver border-b border-gray-700 pb-2">Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* MRP */}
            <div>
              <label htmlFor="mrp" className="block mb-1 font-medium text-gray-200">
                MRP (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="mrp"
                name="mrp"
                value={formValues.mrp}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="e.g. 5999"
              />
              {errors.mrp && <p className="text-red-500 mt-1 text-sm error-message">{errors.mrp}</p>}
            </div>
            
            {/* Sale Price */}
            <div>
              <label htmlFor="salePrice" className="block mb-1 font-medium text-gray-200">
                Sale Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="salePrice"
                name="salePrice"
                value={formValues.salePrice}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="e.g. 3999"
              />
              {errors.salePrice && <p className="text-red-500 mt-1 text-sm error-message">{errors.salePrice}</p>}
            </div>
            
            {/* Discount */}
            <div>
              <label htmlFor="discount" className="block mb-1 font-medium text-gray-200">
                Discount (%)
              </label>
              <input
                type="text"
                id="discount"
                name="discount"
                value={formValues.discount}
                readOnly
                className="w-full bg-gray-700 border border-gray-700 rounded px-3 py-2 text-white cursor-not-allowed"
                placeholder="Auto-calculated"
              />
              <p className="text-xs text-gray-400 mt-1">Auto-calculated from MRP and Sale Price</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-silver border-b border-gray-700 pb-2">Categories</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block mb-1 font-medium text-gray-200">
                Product Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formValues.category}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 mt-1 text-sm error-message">{errors.category}</p>}
            </div>
            
            {/* Subcategory */}
            <div>
              <label htmlFor="subcategory" className="block mb-1 font-medium text-gray-200">
                Product Subcategory
              </label>
              <select
                id="subcategory"
                name="subcategory"
                value={formValues.subcategory}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                disabled={!formValues.category}
              >
                <option value="">Select Subcategory</option>
                {availableSubcategories.map((subcategory) => (
                  <option key={subcategory.value} value={subcategory.value}>
                    {subcategory.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-silver border-b border-gray-700 pb-2">Product Images</h3>
          
          <div>
            <label className="block mb-1 font-medium text-gray-200">
              Upload Images <span className="text-red-500">*</span>
              <span className="text-sm font-normal text-gray-400 ml-2">(Up to 5 images, first one will be the main image)</span>
            </label>
            
            <div className="flex items-center mb-4">
              <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-600 cursor-pointer hover:border-gray-400">
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <span className="text-xs text-gray-400 mt-1">Add Images</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={imagePreviewUrls.length >= 5}
                />
              </label>
              <p className="ml-4 text-sm text-gray-400">
                {imagePreviewUrls.length === 0 ? 'No images selected' : `${imagePreviewUrls.length} of 5 images selected`}
              </p>
            </div>
            
            {errors.images && <p className="text-red-500 mt-1 text-sm error-message">{errors.images}</p>}
            
            {/* Image previews */}
            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-32 w-full border border-gray-700 rounded overflow-hidden">
                      <Image
                        src={url}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs px-2 py-1">
                          Main
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Colors and Sizes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-silver border-b border-gray-700 pb-2">Colors & Sizes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Color */}
            <div>
              <div className="mb-4">
                <label htmlFor="colorName" className="block mb-1 font-medium text-gray-200">
                  Color Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="colorName"
                  name="colorName"
                  value={formValues.colorName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  placeholder="e.g. Midnight Black"
                />
                {errors.colorName && <p className="text-red-500 mt-1 text-sm error-message">{errors.colorName}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="colorCode" className="block mb-1 font-medium text-gray-200">
                  Color Picker
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    id="colorCode"
                    name="colorCode"
                    value={formValues.colorCode}
                    onChange={handleColorPickerChange}
                    className="h-10 w-10 bg-transparent border-0 p-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formValues.colorCode}
                    onChange={handleColorPickerChange}
                    name="colorCode"
                    className="ml-2 w-32 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>
            
            {/* Sizes */}
            <div>
              <label className="block mb-1 font-medium text-gray-200">
                Available Sizes <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {SIZE_OPTIONS.map(size => (
                  <div key={size} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`size-${size}`}
                      checked={formValues.sizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                      className="h-4 w-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`size-${size}`} className="ml-2 text-gray-300">
                      {size}
                    </label>
                  </div>
                ))}
              </div>
              {errors.sizes && <p className="text-red-500 mt-1 text-sm error-message">{errors.sizes}</p>}
            </div>
          </div>
          
          {/* Stock Quantity */}
          {formValues.sizes.length > 0 && (
            <div className="mt-4">
              <label className="block mb-1 font-medium text-gray-200">
                Stock Quantity per Size <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {formValues.sizes.map(size => (
                  <div key={size} className="mb-2">
                    <label htmlFor={`stock-${size}`} className="block mb-1 text-sm text-gray-300">
                      Size {size}
                    </label>
                    <input
                      type="number"
                      id={`stock-${size}`}
                      min="0"
                      value={formValues.stockQuantity[size] || ''}
                      onChange={(e) => handleStockQuantityChange(size, e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                ))}
              </div>
              {errors.stockQuantity && <p className="text-red-500 mt-1 text-sm error-message">{errors.stockQuantity}</p>}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-silver border-b border-gray-700 pb-2">Product Details</h3>
          
          {/* Material */}
          <div>
            <label htmlFor="material" className="block mb-1 font-medium text-gray-200">
              Material <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="material"
              name="material"
              value={formValues.material}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              placeholder="e.g. 100% Cotton"
            />
            {errors.material && <p className="text-red-500 mt-1 text-sm error-message">{errors.material}</p>}
          </div>
          
          {/* Product Status */}
          <div>
            <label htmlFor="status" className="block mb-1 font-medium text-gray-200">
              Product Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formValues.status}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            >
              <option value="active">Active (Visible to customers)</option>
              <option value="draft">Draft (Not visible)</option>
              <option value="inactive">Inactive (Temporarily hidden)</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">Select 'Active' to make this product visible on the website</p>
          </div>
          
          {/* Care Instructions */}
          <div>
            <label htmlFor="careInstructions" className="block mb-1 font-medium text-gray-200">
              Care Instructions
            </label>
            <textarea
              id="careInstructions"
              name="careInstructions"
              value={formValues.careInstructions}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              placeholder="e.g. Machine wash cold, gentle cycle. Do not bleach. Tumble dry low."
            ></textarea>
          </div>
          
          {/* Product Tags */}
          <div>
            <label htmlFor="tags" className="block mb-1 font-medium text-gray-200">
              Product Tags
              <span className="text-sm font-normal text-gray-400 ml-2">(Comma separated)</span>
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formValues.tags}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              placeholder="e.g. cotton, dress, summer, casual"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-6 flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-700">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded flex items-center justify-center ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Product...
              </>
            ) : (
              'Save Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm; 