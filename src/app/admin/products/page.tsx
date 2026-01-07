import ProductsPage from '@/admin/pages/Products';

export const dynamic = 'force-dynamic';

export default function AdminProductsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <form className="w-full max-w-lg space-y-6 bg-black p-8 rounded-lg shadow-lg">
        <div>
          <label className="block mb-2 font-semibold">Product Name</label>
          <input type="text" className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-silver" placeholder="e.g. Black Cotton Printed Tiered Dress" />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Category</label>
          <select className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-silver">
            <option>Select Category</option>
            <option>Dresses</option>
            <option>Tops</option>
            <option>Bottoms</option>
            <option>Footwear</option>
          </select>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Price (₹)</label>
            <input type="number" className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-silver" placeholder="e.g. 3999" />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-semibold">Stock</label>
            <input type="number" className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-silver" placeholder="e.g. 50" />
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold">Description</label>
          <textarea className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-silver" rows={4} placeholder="Detailed description of the product..." />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Upload Images</label>
          <input type="file" multiple className="w-full text-white" />
        </div>
        <button type="submit" className="w-full py-3 rounded bg-silver text-black font-bold hover:bg-white transition">Add Product</button>
      </form>
    </div>
  );
} 