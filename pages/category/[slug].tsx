// Filename: pages/category/[slug].tsx (UPDATED to show custom "No Items" message)

import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import ProductCard from '@/components/product/ProductCard';
import { getProducts } from '@/lib/firestore/products';
import { Product } from '@/types/product';
import React, { useState, useMemo, ChangeEvent } from 'react';
import { Search, Info } from 'lucide-react'; // Added Info icon

interface CategoryProps {
  products: Product[]; // Now this can be an empty array
  categoryName: string;
  categorySlug: string; // Passing the slug for the not-found message
}

// 1. Define possible paths to pre-render (SSG) - SAME AS BEFORE
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [
    { params: { slug: 'guitars' } },
    { params: { slug: 'drums' } },
    { params: { slug: 'keys' } },
    { params: { slug: 'accessories' }},
  ];
  return {
    paths,
    // Keep fallback: 'blocking' to handle new or mistyped URLs
    fallback: 'blocking', 
  };
};

// 2. Fetch data for the specific category slug (MODIFIED)
export const getStaticProps: GetStaticProps<CategoryProps> = async ({ params }) => {
  const categorySlug = params?.slug as string;
  const products = await getProducts(categorySlug); 
  
  const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  // If the slug is something your store definitely doesn't support, 
  // you might return notFound: true, but for all valid slugs with zero products,
  // we return the props and let the component handle the empty array.
  
  return {
    props: {
      products,
      categoryName,
      categorySlug, // Pass slug to component
    },
    revalidate: 60 * 60 * 3, // Regenerate every 3 hours
  };
};


const CategoryPage: React.FC<CategoryProps> = ({ products, categoryName }) => {
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

  // --- NEW: Custom Not Found/Empty Category Message ---
  const isCategoryEmpty = products.length === 0;

  // We can show the custom message only if there's no search term AND the category is empty.
  // If the category is empty due to filtering (i.e., searchTerm is NOT empty), the regular "No results for..." message will show.
  if (isCategoryEmpty && !searchTerm) {
    return (
      <>
        <Head><title>{categoryName} | Not Available</title></Head>
        <div className="py-20 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 my-10">
          <Info size={48} className="text-secondary-txt mx-auto mb-4" />
          <h1 className="text-3xl font-heading text-primary-heading mb-2">
            Currently No Items Available in &quot;{categoryName}&quot;
          </h1>
          <p className="text-lg text-secondary-txt">
            We do not have any instruments listed under **{categoryName}** at the moment. 
            Please check back soon!
          </p>
        </div>
      </>
    );
  }


  return (
    <>
      <Head>
        <title>{categoryName} | Musicore Store</title>
      </Head>

      <div className="py-10">
        
        {/* --- Header and Search Container (Responsive Layout) --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-5xl font-heading text-primary-heading mb-4 md:mb-0">{categoryName}</h1>
            <div className="relative w-full md:w-full md:max-w-xs">
                <input
                    type="text"
                    placeholder={`Search within ${categoryName}...`}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-primary-brand focus:border-primary-brand text-primary-txt text-sm transition duration-150"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-txt" size={16} />
            </div>
        </div>
        
        <p className="text-secondary-txt mb-8">
            {searchTerm 
                ? `Showing ${filteredProducts.length} results for "${searchTerm}"` 
                : `Browse our collection of ${categoryName} (${products.length} items).`
            }
        </p>

        {/* --- Product Grid --- */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                productId={product.id}
                slug={product.slug} 
                name={product.name} 
                price={product.price} 
                brand={product.brand}
                imageUrl={product.imageUrls[0] || '/images/default.jpg'}
              />
            ))}
          </div>
        ) : (
          // This block runs if filtering yields no results OR if the category was empty and the user started searching
          <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
             <h3 className="text-2xl font-heading text-secondary-txt">No {categoryName} found matching &quot;{searchTerm}&quot;</h3>
             <p className="text-gray-500 mt-2">Try clearing your search or browsing other categories.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPage;