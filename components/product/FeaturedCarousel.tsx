'use client'; 
// Note: Carousels must be client components due to DOM manipulation and interactivity.

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedCarouselProps {
  products: Product[];
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ products }) => {
  // Initialize Embla Carousel hook
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    slidesToScroll: 1,
    align: 'start',
    dragFree: false,
  });

  // Navigation functions
  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  
  // Guard clause for no products
  if (!products || products.length === 0) {
    return (
        <div className="text-center py-10 text-secondary-txt border border-dashed rounded-lg">
            No Featured Products Available
        </div>
    );
  }

  return (
    <div className="relative">
      
      {/* 1. Carousel Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4">
          {products.map((product) => (
            // The padding (pl-4) acts as the gap between slides
            <div key={product.id} className="relative flex-grow-0 flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 pl-4">
              <ProductCard
                slug={product.slug}
                productId={product.id}
                name={product.name} 
                price={product.price} 
                brand={product.brand}
                imageUrl={product.imageUrls[0] || '/images/default.jpg'}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* 2. Navigation Buttons */}
      <button
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg border border-gray-200 z-10 hover:bg-primary-brand hover:text-white transition-colors duration-200"
        onClick={scrollPrev}
        aria-label="Previous Slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg border border-gray-200 z-10 hover:bg-primary-brand hover:text-white transition-colors duration-200"
        onClick={scrollNext}
        aria-label="Next Slide"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default FeaturedCarousel;