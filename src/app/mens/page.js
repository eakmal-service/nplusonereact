import EnhancedProductGrid from '../../components/common/EnhancedProductGrid';
import { useProducts } from '../../contexts/ProductContext';
import ProductGridSkeleton from '../../components/common/ProductGridSkeleton';

export default function MensPage() {
    const { getActiveProductsByCategory, isLoading } = useProducts();
    const products = getActiveProductsByCategory('mens wear');

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-16">
            <div className="container mx-auto px-4">
                {isLoading ? (
                    <ProductGridSkeleton count={8} />
                ) : products.length > 0 ? (
                    <EnhancedProductGrid products={products} title="Men's Wear" />
                ) : (
                    <div className="text-center py-16">
                        <h1 className="text-3xl font-bold mb-6 text-silver">Men's Wear</h1>
                        <p className="text-xl mb-4">No products found in this category.</p>
                        <Link href="/" className="inline-block bg-silver hover:bg-gray-300 text-black font-medium px-6 py-2 rounded transition">
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
