// Filename: components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react'; 
import { useCart } from '@/lib/context/CartContext'; // NEW IMPORT

const Header: React.FC = () => {
  const { cartCount } = useCart(); // Access cart count from context

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo/Brand Name */}
        <Link href="/" className="text-3xl font-heading text-primary-brand font-bold">
          Musicore
        </Link>

        {/* Navigation Links (SAME) */}
        <nav className="hidden md:flex space-x-8 text-primary-txt font-sans">
          <Link href="/category/guitars" className="hover:text-primary-brand transition duration-150">Guitars</Link>
          <Link href="/category/drums" className="hover:text-primary-brand transition duration-150">Drums</Link>
          <Link href="/category/keys" className="hover:text-primary-brand transition duration-150">Keyboards</Link>
          <Link href="/products" className="hover:text-primary-brand transition duration-150">All Instruments</Link>
        </nav>

        {/* Icons/Actions */}
        <div className="flex items-center space-x-4">
          <Link href="/account" className="text-primary-txt hover:text-primary-brand transition duration-150 p-2">
            <User size={24} />
          </Link>
          
          {/* Cart Icon with Conditional Badge */}
          <Link href="/cart" className="relative text-primary-txt hover:text-primary-brand transition duration-150 p-2">
            <ShoppingCart size={24} />
            
            {/* Show badge ONLY if cartCount is greater than zero */}
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-error-color rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;