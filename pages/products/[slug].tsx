import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import { getProductBySlug, getProducts } from '@/lib/firestore/products';
import { Product } from '@/types/product';
import Image from 'next/image';
import { ShoppingCart, CheckCircle } from 'lucide-react';

interface PDPProps {
  product: Product;
}

// 1. Define possible paths to pre-render (SSG)
export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch all slugs to tell Next.js which pages to build
  const allProducts = await getProducts(); 
  const paths = allProducts.map(p => ({
    params: { slug: p.slug },
  }));

  return {
    paths,
    fallback: 'blocking', // Build new products on demand
  };
};

// 2. Fetch data for the specific product slug
export const getStaticProps: GetStaticProps<PDPProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60, // Regenerate product page every hour
  };
};

const ProductDetailPage: React.FC<PDPProps> = ({ product }) => {
  if (!product) return <div>Product Not Found.</div>;

  const inStock = product.stock > 0;

  return (
    <>
      <Head>
        <title>{product.name} | Musicore</title>
      </Head>

      <div className="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Image Gallery */}
          <div>
            {/* Main Image (using Next/Image for optimization) */}
            <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
              {product.imageUrls[0] ? (
                <Image
                  src={product.imageUrls[0]}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority // Load the main image quickly
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 text-secondary-txt">No Image</div>
              )}
            </div>
            {/* Thumbnail Gallery (Optional: for multiple images) */}
            {/* ... */}
          </div>

          {/* Right Column: Product Details & CTA */}
          <div className="lg:sticky lg:top-20 h-fit">
            <h1 className="text-4xl font-heading text-primary-heading mb-2">{product.name}</h1>
            <p className="text-xl text-secondary-txt mb-4">{product.brand}</p>

            <p className={`text-lg font-semibold flex items-center mb-6 ${inStock ? 'text-secondary-brand' : 'text-error-color'}`}>
              <CheckCircle size={20} className="mr-2" />
              {inStock ? `${product.stock} In Stock` : 'Out of Stock'}
            </p>

            <p className="text-5xl font-extrabold text-primary-brand mb-8">${product.price.toFixed(2)}</p>

            {/* Add to Cart Button */}
            <button
              className={`w-full flex items-center justify-center px-8 py-4 text-xl font-bold text-white rounded-lg transition-all duration-300 ${inStock ? 'bg-primary-brand hover:bg-opacity-90 shadow-lg' : 'bg-gray-400 cursor-not-allowed'}`}
              disabled={!inStock}
            >
              <ShoppingCart size={24} className="mr-3" />
              {inStock ? 'Add to Cart' : 'Notify Me'}
            </button>

            <h2 className="text-2xl font-heading text-primary-heading mt-10 mb-3 border-b pb-2">Description</h2>
            <p className="text-secondary-txt leading-relaxed">{product.description}</p>

            {/* Technical Specifications */}
            <h2 className="text-2xl font-heading text-primary-heading mt-10 mb-3 border-b pb-2">Specifications</h2>
            <ul className="divide-y divide-gray-200">
              {Object.entries(product.specs).map(([key, value]) => (
                <li key={key} className="py-3 flex justify-between text-secondary-txt">
                  <span className="font-medium text-primary-txt">{key}</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;