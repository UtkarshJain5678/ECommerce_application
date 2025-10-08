// Filename: pages/products/index.tsx

import Head from 'next/head';
import { GetStaticProps } from 'next';
import { getProducts } from '@/lib/firestore/products';
import { Product } from '@/types/product';
import React, { useState, useMemo, ChangeEvent } from 'react';
import { Search } from 'lucide-react'; 
import FeaturedCarousel from '@/components/product/FeaturedCarousel';

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
        
        {/* --- Header and Search Container (Responsive Layout) --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            
            <h1 className="text-5xl font-heading text-primary-heading mb-4 md:mb-0">All Instruments</h1>

            <div className="relative w-full md:w-full md:max-w-xs">
                <input
                    type="text"
                    placeholder="Search our entire catalog..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-primary-brand focus:border-primary-brand text-primary-txt text-sm transition duration-150"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-txt" size={16} />
            </div>
        </div>
        
        <p className="text-secondary-txt mb-8">
            {searchTerm ? `Showing results for "${searchTerm}"` : `Browse our entire collection (${products.length} items).`}
        </p>

        {/* --- Product Grid (CRITICAL CHANGE HERE) --- */}
        {filteredProducts.length > 0 ? (
          // The Carousel component will handle its own responsiveness.
          <div className="mt-8"> 
             <FeaturedCarousel products={filteredProducts} />
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
             <h3 className="text-2xl font-heading text-secondary-txt">No results for &quot;{searchTerm}&quot;</h3>
             <p className="text-gray-500 mt-2">Try a different search term or check our categories.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsPage;