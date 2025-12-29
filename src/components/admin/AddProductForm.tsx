import React, { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { uploadImage } from '@/utils/supabaseUpload';

const categories = [
  { value: 'suit-set', label: 'Suit Set' },
  { value: 'western-dress', label: 'Western Dress' },
  { value: 'co-ord-sets', label: 'Co-ord Sets' },
  { value: 'lehenga', label: 'Lehenga' },
  { value: 'indi-western', label: 'Indi-Western' },
  { value: 'unstiched-set', label: 'Unstiched Set' },
];

const subcategories = [
  { value: '', label: 'Select Subcategory' },
  { value: 'round-neck', label: 'Round Neck' },
  { value: 'v-neck', label: 'V-Neck' },
  { value: 'printed', label: 'Printed' },
  { value: 'oversized', label: 'Oversized' },
];

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

interface AddProductFormProps {
  initialData?: any;
  onCancel?: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ initialData, onCancel }) => {
  const { saveNewProduct, updateExistingProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    mrp: initialData?.price || '',
    salePrice: initialData?.salePrice || '',
    category: initialData?.category || '',
    subcategory: initialData?.subcategory || '',
    material: initialData?.material || initialData?.fabric || '',
    status: initialData?.status || 'active',
    colorName: initialData?.colorName || '',
    color: initialData?.colorOptions?.[0]?.code || '#000000',
    sizes: (initialData?.sizes || []) as string[],
    images: [] as File[],
    sku: initialData?.sku || '',
    barcode: initialData?.barcode || '',
    videoUrl: initialData?.videoUrl || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    tags: initialData?.tags?.join(', ') || '',
    sizeStock: (initialData?.sizeStock || {}) as Record<string, number>,
  });
  const [addedColors, setAddedColors] = useState<{ name: string; color: string }[]>(
    initialData?.colorOptions?.map((c: any) => ({ name: c.name, color: c.code || '#000000' })) || []
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Discount calculation
  const discount = form.mrp && form.salePrice
    ? Math.max(0, Math.round((1 - Number(form.salePrice) / Number(form.mrp)) * 100))
    : '';

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && name === 'sizes') {
      const size = value;
      setForm((prev) => ({
        ...prev,
        sizes: prev.sizes.includes(size)
          ? prev.sizes.filter((s) => s !== size)
          : [...prev.sizes, size],
      }));

    } else if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        setForm((prev) => ({ ...prev, images: Array.from(files).slice(0, 5) }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Add color
  const handleAddColor = () => {
    if (!form.colorName) return;
    setAddedColors((prev) => [...prev, { name: form.colorName, color: form.color }]);
    setForm((prev) => ({ ...prev, colorName: '', color: '#000000' }));
  };

  // Remove color
  const handleRemoveColor = (idx: number) => {
    setAddedColors((prev) => prev.filter((_, i) => i !== idx));
  };

  // Validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.title) newErrors.title = 'Product title is required.';
    if (!form.description) newErrors.description = 'Product description is required.';
    if (!form.mrp) newErrors.mrp = 'MRP is required.';
    if (!form.salePrice) newErrors.salePrice = 'Sale price is required.';
    if (!form.category) newErrors.category = 'Category is required.';
    if (!form.material) newErrors.material = 'Material is required.';
    if (!form.material) newErrors.material = 'Material is required.';
    if (form.images.length === 0 && !initialData?.imageUrls) newErrors.images = 'At least one image is required.';
    // if (addedColors.length === 0) newErrors.colors = 'Add at least one color.'; // Optional since color might not apply to all
    if (form.sizes.length === 0) newErrors.sizes = 'Select at least one size.';
    return newErrors;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // 1. Upload Images
        const uploadedUrls: string[] = [];
        for (const file of form.images) {
          const url = await uploadImage(file);
          if (url) uploadedUrls.push(url);
        }

        if (form.images.length > 0) { // Only upload if new images are selected
          for (const file of form.images) {
            const url = await uploadImage(file);
            if (url) uploadedUrls.push(url);
          }
        }

        if (uploadedUrls.length === 0 && !initialData?.imageUrls) {
          alert('Failed to upload images. Please try again.');
          setIsSubmitting(false);
          return;
        }


        // 2. Prepare Product Data
        const productData = {
          id: initialData?.id, // Include ID for updates
          title: form.title,
          description: form.description,
          price: form.mrp,        // DB uses price as original price/MRP usually
          salePrice: form.salePrice, // DB maps sale_price to this
          discount: discount ? `${discount}%` : '',
          category: form.category,
          subcategory: form.subcategory,
          material: form.material,
          status: form.status,
          imageUrl: uploadedUrls[0] || initialData?.imageUrl, // Use existing if no new upload
          imageUrls: uploadedUrls.length > 0 ? uploadedUrls : (initialData?.imageUrls || []),
          sizes: form.sizes.map(String), // Ensure strings
          colorName: addedColors.length > 0 ? addedColors[0].name : '',
          sku: form.sku,
          barcode: form.barcode,
          videoUrl: form.videoUrl,
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
          sizeStock: form.sizeStock,
          stockQuantity: Object.values(form.sizeStock).reduce((a: number, b: unknown) => a + (Number(b) || 0), 0),
          viewCount: 0,
          cartCount: 0,
          purchaseCount: 0,
          dateAdded: new Date().toISOString(),
        };

        // 3. Save to Supabase
        let success;
        if (initialData) {
          success = await updateExistingProduct(productData);
        } else {
          success = await saveNewProduct(productData);
        }

        if (success) {
          alert(`Product successfully ${initialData ? 'updated' : 'saved'}!`);
          if (!initialData) {
            // Reset form only on create
            setForm({
              title: '', description: '', mrp: '', salePrice: '', category: '',
              subcategory: '', material: '', status: 'active', colorName: '',
              color: '#000000', sizes: [], images: [],
              sku: '', barcode: '', videoUrl: '', metaTitle: '', metaDescription: '', tags: '', sizeStock: {}
            });
            setAddedColors([]);
          } else {
            // Maybe close the form or scroll top
            if (onCancel) onCancel();
          }
          window.scrollTo(0, 0);
        } else {
          alert('Failed to save product to database.');
        }

      } catch (error) {
        console.error('Error submitting product:', error);
        alert('An unexpected error occurred.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="bg-black p-6 rounded-lg border border-gray-800 space-y-6">
        <h2 className="text-xl font-semibold mb-2 text-white">Basic Information</h2>
        <div>
          <label className="block text-silver mb-1">Product Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
            placeholder="e.g. Black Cotton Printed Tiered Dress"
            disabled={isSubmitting}
          />
          {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
        </div>
        <div>
          <label className="block text-silver mb-1">Product Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
            placeholder="Detailed description of the product..."
            rows={3}
            disabled={isSubmitting}
          />
          {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-silver mb-1">MRP (₹) *</label>
            <input
              type="number"
              name="mrp"
              value={form.mrp}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
              placeholder="e.g. 5999"
              disabled={isSubmitting}
            />
            {errors.mrp && <div className="text-red-500 text-xs mt-1">{errors.mrp}</div>}
          </div>
          <div>
            <label className="block text-silver mb-1">Sale Price (₹) *</label>
            <input
              type="number"
              name="salePrice"
              value={form.salePrice}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
              placeholder="e.g. 3999"
              disabled={isSubmitting}
            />
            {errors.salePrice && <div className="text-red-500 text-xs mt-1">{errors.salePrice}</div>}
          </div>
          <div>
            <label className="block text-silver mb-1">Discount (%)</label>
            <input
              type="text"
              value={discount !== '' ? discount + '%' : 'Auto-calculated'}
              readOnly
              className="w-full p-2 rounded bg-gray-900 text-gray-400 border border-gray-700"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-silver mb-1">Product Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
              disabled={isSubmitting}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            {errors.category && <div className="text-red-500 text-xs mt-1">{errors.category}</div>}
          </div>
          <div>
            <label className="block text-silver mb-1">Product Subcategory</label>
            <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
              disabled={isSubmitting}
            >
              {subcategories.map((sub) => (
                <option key={sub.value} value={sub.value}>{sub.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-silver mb-1">Upload Images * (Up to 5 images, first one will be the main image)</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
            disabled={isSubmitting}
          />
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.images.map((img, idx) => (
                <div key={idx} className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400">
                  {img.name}
                </div>
              ))}
            </div>
          )}
          {errors.images && <div className="text-red-500 text-xs mt-1">{errors.images}</div>}
        </div>
        <div>
          <label className="block text-silver mb-1">Colors & Sizes</label>
          <div className="flex gap-2 items-center mb-2">
            <input
              type="text"
              name="colorName"
              value={form.colorName}
              onChange={handleChange}
              className="p-2 rounded bg-gray-900 text-white border border-gray-700"
              placeholder="e.g. Midnight Black"
              disabled={isSubmitting}
            />
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              className="w-10 h-10 p-0 border-none"
              disabled={isSubmitting}
            />
            <button type="button" onClick={handleAddColor} className="bg-blue-600 text-white px-3 py-1 rounded" disabled={isSubmitting}>Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {addedColors.length === 0 && <span className="text-gray-400 text-xs">No colors added yet. Add at least one color.</span>}
            {addedColors.map((c, idx) => (
              <span key={idx} className="flex items-center gap-1 bg-gray-800 text-white px-2 py-1 rounded text-xs">
                <span style={{ background: c.color, width: 16, height: 16, display: 'inline-block', borderRadius: 4 }}></span>
                {c.name}
                <button type="button" onClick={() => handleRemoveColor(idx)} className="ml-1 text-red-400" disabled={isSubmitting}>&times;</button>
              </span>
            ))}
          </div>
          {errors.colors && <div className="text-red-500 text-xs mt-1">{errors.colors}</div>}
          <div className="mt-2">
            <span className="block text-silver mb-1">Available Sizes *</span>
            <div className="flex flex-wrap gap-4">
              {sizes.map((size) => (
                <label key={size} className="flex items-center gap-1 text-white">
                  <input
                    type="checkbox"
                    name="sizes"
                    value={size}
                    checked={form.sizes.includes(size)}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {size}
                </label>
              ))}
            </div>
            {errors.sizes && <div className="text-red-500 text-xs mt-1">{errors.sizes}</div>}
          </div>
        </div>
        <div>
          <label className="block text-silver mb-1">Material *</label>
          <input
            type="text"
            name="material"
            value={form.material}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
            placeholder="e.g. 100% Cotton"
            disabled={isSubmitting}
          />
          {errors.material && <div className="text-red-500 text-xs mt-1">{errors.material}</div>}
        </div>
        <div>
          <label className="block text-silver mb-1">Product Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
            disabled={isSubmitting}
          >
            <option value="active">Active (Visible to customers)</option>
            <option value="inactive">Inactive (Hidden from customers)</option>
          </select>
        </div>
        <div className="pt-4">
          <button
            type="submit"
            className={`px-6 py-2 rounded font-semibold text-white ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (initialData ? 'Update Product' : 'Submit Product')}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="bg-gray-700 text-white px-6 py-2 rounded ml-4 hover:bg-gray-600">Cancel</button>
          )}
        </div>
      </div>
    </form>
  );
};

export default AddProductForm; 