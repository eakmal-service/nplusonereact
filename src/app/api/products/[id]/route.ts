import { NextResponse } from 'next/server';
import { recommendedProducts } from '@/data/mockData';
import { getAllProducts } from '@/utils/productUtils';
import { Product as TypeProduct } from '@/types';
import { Product as AdminProduct } from '@/utils/productUtils';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Add a small delay to simulate a real API call
    await new Promise(resolve => setTimeout(resolve, 300));

    const productId = parseInt(params.id);

    // First check if the product is in our mock data (recommended products)
    // Since we can't reliably access localStorage server-side, we'll primarily use mock data
    let product = recommendedProducts.find(p => p.id === productId);
    let isAdminUploaded = false;

    // In the real implementation, this would check a database for admin-uploaded products
    // The client-side component will handle localStorage fallback if this returns 404

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Add extra product details for the detail page
    const enrichedProduct = {
      id: product.id,
      title: product.title,
      image: product.image,
      imageUrl: product.imageUrl || product.image,
      price: product.price,
      salePrice: product.salePrice || product.price,
      discount: product.discount || '',
      category: product.category || 'suits',
      subcategory: product.subcategory || '',
      stockQuantity: product.stockQuantity || 10,
      status: product.status || 'active',
      link: `/product/${product.id}`,
      alt: product.alt || product.title,

      // UI-specific fields
      isAdminUploaded,
      isGloballyVisible: true,
      responsive: true,
      browserCompatible: true,

      // Product details
      topStyle: product.topStyle || 'Flared',
      topPattern: product.topPattern || 'Embroidered',
      bottomFabric: product.bottomFabric || 'Cotton',
      fabricDupattaStole: product.fabricDupattaStole || 'Cotton',
      neckline: product.neckline || 'Round Neck',
      sleeveDetail: product.sleeveDetail || '3/4 Sleeves',
      liningFabric: product.liningFabric || 'Cotton',
      fabric: product.fabric || 'Cotton',
      washCare: product.washCare || 'Hand wash or machine wash in cold water. Do not bleach. Dry in shade. Medium iron. Do not dry clean.',
      sizeChartHtml: (product as any).sizeChartHtml,

      // Size and images
      availableSizes: product.availableSizes || product.sizes || ['32', '34', '36', '38', '40', '42'],
      // Create multiple sample images for testing if none exist
      images: product.images || [
        { url: product.image || product.imageUrl, alt: product.alt || product.title },
        { url: product.image || product.imageUrl, alt: `${product.alt || product.title} - Alt view 1` },
        { url: product.image || product.imageUrl, alt: `${product.alt || product.title} - Alt view 2` }
      ],
      thumbnails: product.thumbnails || [
        { url: product.image || product.imageUrl, alt: product.alt || product.title },
        { url: product.image || product.imageUrl, alt: `${product.alt || product.title} - Alt view 1` },
        { url: product.image || product.imageUrl, alt: `${product.alt || product.title} - Alt view 2` }
      ],
      // Include imageUrls for compatibility with admin-uploaded products
      imageUrls: (product as any).imageUrls || [
        product.image || product.imageUrl,
        product.image || product.imageUrl,
        product.image || product.imageUrl
      ]
    };

    return NextResponse.json(enrichedProduct);
  } catch (error) {
    console.error(`Error fetching product ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
} 