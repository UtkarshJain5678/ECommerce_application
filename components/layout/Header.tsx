'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu, X } from 'lucide-react'; // NEW ICONS
import { useCart } from '@/lib/context/CartContext';
import React, { useState } from 'react'; // NEW IMPORT

const Header: React.FC = () => {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  const navLinks = [
    { href: "/category/guitars", label: "Guitars" },
    { href: "/category/drums", label: "Drums" },
    { href: "/category/keys", label: "Keyboards" },
    { href: "/products", label: "All Instruments" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-20"> {/* Increased Z-index */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* Logo/Brand Name */}
        <Link href="/" className="text-3xl font-heading text-primary-brand font-bold">
          Musicore
        </Link>

        {/* Desktop Navigation Links (Hidden on Mobile) */}
        <nav className="hidden md:flex space-x-8 text-primary-txt font-sans">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="hover:text-primary-brand transition duration-150">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Icons/Actions (Always Visible) */}
        <div className="flex items-center space-x-4">
          <Link href="/account" className="hidden md:block text-primary-txt hover:text-primary-brand transition duration-150 p-2">
            <User size={24} />
          </Link>
          
          {/* Cart Icon with Conditional Badge (Same) */}
          <Link href="/cart" className="relative text-primary-txt hover:text-primary-brand transition duration-150 p-2">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-error-color rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          
          {/* Mobile Menu Button (Visible ONLY on Mobile) */}
          <button 
            className="md:hidden text-primary-txt p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* --- Mobile Dropdown Menu Panel --- */}
      <div 
        className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out z-10
          ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`
        }
      >
        <nav className="flex flex-col space-y-4 p-4">
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setIsMenuOpen(false)} // Close menu on click
              className="text-lg font-medium text-primary-txt hover:text-primary-brand border-b border-gray-100 pb-2"
            >
              {link.label}
            </Link>
          ))}
          <Link 
            href="/account"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg font-medium text-primary-txt hover:text-primary-brand pt-2 flex items-center"
          >
             <User size={20} className="mr-2" /> My Account
          </Link>
        </nav>
      </div>
      
    </header>
  );
};

export default Header;