import Head from 'next/head';
import { GetStaticProps } from 'next';
import ProductCard from '@/components/product/ProductCard'; 
import { getProducts } from '@/lib/firestore/products';
import { Product } from '@/types/product';
import React, { useState, useMemo, ChangeEvent } from 'react';
import { Search } from 'lucide-react'; 
import FeaturedCarousel from '../../components/product/FeaturedCarousel';

interface ProductsProps {
  products: Product[]; 
}

// Fetch ALL products at build time using SSG (SAME AS BEFORE)
export const getStaticProps: GetStaticProps<ProductsProps> = async () => {
  try {
    const products = await getProducts(); 
    return {
      props: {
        products,
      },
      revalidate: 60 * 60, // 1 hour ISR
    };
  } catch (error) {
    console.error("Error fetching all products:", error);
    return {
      props: {
        products: [],
      },
      revalidate: 60,
    };
  }
};


const ProductsPage: React.FC<ProductsProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }
    
    const lowerCaseSearch = searchTerm.toLowerCase();

    return products.filter(product => (
      product.name.toLowerCase().includes(lowerCaseSearch) ||
      product.brand.toLowerCase().includes(lowerCaseSearch) ||
      product.description.toLowerCase().includes(lowerCaseSearch)
    ));
    
  }, [products, searchTerm]);

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-heading text-primary-heading">No Instruments Found</h1>
        <p className="text-secondary-txt mt-2">Check back later or try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>All Instruments | Musicore Store</title>
      </Head>

      <div className="py-10">
        
        {/* --- Header and Search Container (RESPONSIVE FLEX LAYOUT) --- */}
        {/* Mobile: Stack vertically (flex-col). Desktop: Align horizontally (md:flex-row) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            
            {/* Heading (Takes full width if space allows) */}
            <h1 className="text-5xl font-heading text-primary-heading mb-4 md:mb-0">All Instruments</h1>

            {/* Search Bar Implementation */}
            {/* Mobile: Full width (w-full). Desktop: Small, max-w-xs. */}
            <div className="relative w-full md:w-full md:max-w-xs">
                <input
                    type="text"
                    placeholder="Search our entire catalog..."
                    value={searchTerm}
                    title='Search products by name, brand, or description'
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-primary-brand focus:border-primary-brand text-primary-txt text-sm transition duration-150"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-txt" size={16} />
            </div>
        </div>
        
        <p className="text-secondary-txt mb-8">
            {searchTerm ? `Showing results for "${searchTerm}"` : `Browse our entire collection (${products.length} items).`}
        </p>

        {/* --- Display filtered products (SAME AS BEFORE) --- */}
        {filteredProducts.length > 0 ? (
          <div className="grid w-full gap-6">
            <FeaturedCarousel products={filteredProducts} />
            {/* {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                slug={product.slug} 
                name={product.name} 
                price={product.price} 
                imageUrl={product.imageUrls[0] || '/images/default.jpg'}
              />
            ))} */}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
             <h3 className="text-2xl font-heading text-secondary-txt">No results for "{searchTerm}"</h3>
             <p className="text-gray-500 mt-2">Try a different search term or check our categories.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsPage;