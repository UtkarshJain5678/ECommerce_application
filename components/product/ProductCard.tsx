// Filename: components/product/ProductCard.tsx
'use client'; 

import Link from 'next/link';
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { CartItem } from '@/types/cart'; 
import React, { useMemo } from 'react'; // Removed useState and useEffect

interface ProductCardProps {
  productId: string; // Document ID
  slug: string;
  name: string;
  price: number;
  brand: string;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ productId, slug, name, price, brand, imageUrl }) => {
  const { addItem, cart, updateItemQuantity, removeItem } = useCart();
  
  // Get current item and quantity from the global cart state
  const currentCartItem = useMemo(() => 
    cart.find(item => item.productId === productId), 
    [cart, productId]
  );
  
  const currentQuantity = currentCartItem?.quantity || 0;
  const isItemInCart = currentQuantity > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (isItemInCart) return;
    
    // Always add 1 item when the primary button is clicked
    const item: CartItem = {
      productId,
      slug,
      name,
      price,
      brand,
      imageUrl,
      quantity: 1, 
    };

    addItem(item);
  };
  
  // Handler for increasing/decreasing quantity directly in the cart
  const handleUpdateCartQuantity = (delta: number, e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    const newQty = currentQuantity + delta;
    
    if (newQty <= 0) {
      removeItem(productId); // Remove item if quantity drops to 0
      return;
    }

    updateItemQuantity(productId, newQty);
  }

  // --- Helper Component: The Functional Cart Counter UI ---
  const CartCounter: React.FC = () => {
    return (
        <div className="flex space-x-2 items-stretch w-full">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                <button
                    onClick={(e) => handleUpdateCartQuantity(-1, e)}
                    disabled={currentQuantity <= 1} // Disable Minus button if qty is 1
                    className="p-2 text-primary-txt hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Decrease quantity"
                >
                    <Minus size={16} />
                </button>
                <input
                    type="text"
                    readOnly
                    value={currentQuantity}
                    className="w-8 text-center border-x border-gray-300 text-sm font-medium text-primary-txt focus:outline-none"
                    aria-label="Product quantity in cart"
                />
                <button
                    onClick={(e) => handleUpdateCartQuantity(1, e)}
                    className="p-2 text-primary-txt hover:bg-gray-100 transition"
                    aria-label="Increase quantity"
                >
                    <Plus size={16} />
                </button>
            </div>
            
            <Link href="/cart" onClick={(e) => e.stopPropagation()}
                className="flex-grow flex items-center justify-center py-2 text-sm font-semibold rounded-lg bg-secondary-brand text-white hover:bg-opacity-90 transition-all duration-300"
            >
                <Check size={18} className="mr-2" />
                In Cart ({currentQuantity})
            </Link>
        </div>
    );
  }

  return (
    <div className="relative">
      
      <Link href={`/products/${slug}`} className="block group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition duration-300 overflow-hidden">
        
        {/* Product Image */}
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-48 object-cover group-hover:opacity-75 transition duration-300"
          />
        </div>
        
        {/* Product Details and Button Container */}
        <div className="p-4 space-y-3">
          
          {/* Text Content */}
          <div>
            <h3 className="text-lg font-heading text-primary-heading group-hover:text-primary-brand transition">
              {name}
            </h3>
            <p className="mt-1 text-secondary-txt text-sm">{brand}</p>
            <p className="mt-2 text-xl font-bold text-primary-brand">${price.toFixed(2)}</p>
          </div>
          
          
          {/* --- Responsive Action Section --- */}
          {isItemInCart ? (
            // State 1: Item is in the cart -> Show the functional counter/link
            <CartCounter />
          ) : (
            // State 2: Item is NOT in the cart -> Show the simple Add to Cart button
            <button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center py-2 text-sm font-semibold rounded-lg transition-all duration-300
                    bg-primary-brand text-white hover:bg-opacity-90
                `}
            >
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
            </button>
          )}
        </div> 
        
      </Link>
    </div>
  );
};

export default ProductCard;