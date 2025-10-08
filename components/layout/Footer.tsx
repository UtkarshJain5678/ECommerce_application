// Filename: components/layout/Footer.tsx

import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-bg text-gray-300 mt-6 pt-6 pb-2">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Section 1: Brand Info */}
          <div>
            <h4 className="text-xl font-heading text-primary-brand mb-4">Musicore</h4>
            <p className="text-sm">
              Crafting sounds since 2023. Find your perfect instrument with expert advice and quality guarantee.
            </p>
          </div>
          
          {/* Section 2: Quick Links */}
          <div>
            <h4 className="text-lg font-heading mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary-brand transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary-brand transition">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-primary-brand transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Section 3: Shop Links */}
          <div>
            <h4 className="text-lg font-heading mb-4">Shop Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/guitars" className="hover:text-primary-brand transition">Guitars & Bass</Link></li>
              <li><Link href="/category/drums" className="hover:text-primary-brand transition">Drums & Percussion</Link></li>
              <li><Link href="/category/accessories" className="hover:text-primary-brand transition">Accessories</Link></li>
            </ul>
          </div>

          {/* Section 4: Customer Service */}
          <div>
            <h4 className="text-lg font-heading mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/account" className="hover:text-primary-brand transition">My Account</Link></li>
              <li><Link href="/returns" className="hover:text-primary-brand transition">Returns Policy</Link></li>
              <li><Link href="/shipping" className="hover:text-primary-brand transition">Shipping Info</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-2 border-t border-gray-700 text-center text-sm">
          &copy; {new Date().getFullYear()} Musicore. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;