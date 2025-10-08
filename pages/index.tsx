import Head from 'next/head';
import { GetStaticProps } from 'next';
import ProductCard from '@/components/product/ProductCard';
import { getFeaturedProducts } from '@/lib/firestore/products';
import { Product } from '@/types/product'; 
import { Truck, RefreshCw, Headset, CheckCircle } from 'lucide-react';
import PublishChangesButton from '@/components/admin/PublishChangesButton';
import FeaturedCarousel from '../components/product/FeaturedCarousel';

interface HomeProps {
  featuredProducts: Product[];
}

// --- Placeholder Data (Will be replaced with Firestore fetching later) ---
const featuredProducts = [
  { slug: 'fender-strat', name: 'Fender Stratocaster', price: 1299.99, imageUrl: '/images/guitar1.jpg' },
  { slug: 'yamaha-keyboard', name: 'Yamaha P-45 Digital Piano', price: 499.00, imageUrl: '/images/keyboard1.jpg' },
  { slug: 'pearl-drum-set', name: 'Pearl Roadshow Drum Set', price: 650.00, imageUrl: '/images/drums1.jpg' },
  { slug: 'ukulele-mahogany', name: 'Mahogany Ukulele', price: 79.50, imageUrl: '/images/ukulele1.jpg' },
];

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const featuredProducts = await getFeaturedProducts();
    return {
      props: {
        featuredProducts,
      },
      revalidate: 60 * 60 * 3, // 3 hours : TODO
    };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return {
      props: {
        featuredProducts: [],
      },
      revalidate: 60,
    };
  }
};

const HomePage: React.FC<HomeProps> = ({ featuredProducts }) => {
  // const slugsToPublish = ['fender-stratocaster', 'yamaha-p45', 'pearl-drum-set']; 
  // const categorySlugs = ['/', '/category/guitars', '/category/keys']; 
  // const allPaths = [...slugsToPublish.map(s => `/products/${s}`), ...categorySlugs];

  return (
    <>
      <Head>
        <title>Musicore | Find Your Perfect Sound</title>
      </Head>
      
      {/* 🚨 TEMP ADMIN SECTION: The button will be moved to the admin profile later */}
      {/* <div className="my-8 p-4 bg-error-color/10 border border-error-color rounded-lg text-center">
        <h2 className="text-xl font-heading text-error-color mb-3">ADMIN WARNING: Live Changes Pending</h2>
        <p className="text-sm text-error-color mb-4">
          The following pages have pending data changes in Firestore: 
          <span className='font-mono bg-white px-2 py-0.5 rounded text-xs ml-2'>{slugsToPublish.join(', ')}</span>
        </p>
        <PublishChangesButton paths={allPaths} />
      </div> */}

      {/* 🚨 END TEMP ADMIN SECTION */}
      {/* 1. Hero Section TODO add a custom background Image */}
      <div className="bg-secondary-bg h-96 my-8 rounded-xl flex items-center justify-center p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-4 leading-tight">
            Find Your <span className="text-secondary-brand">Perfect Sound</span>
          </h1>
          <p className="text-gray-300 text-xl mb-8 font-sans">
            Premium instruments for every musician, from beginner to pro.
          </p>
          <a
            href="/products"
            className="inline-block px-8 py-3 text-lg font-medium text-white bg-primary-brand rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-xl"
          >
            Show All Instruments
          </a>
        </div>
      </div>

      {/* 2. Value Proposition Section */}
      <section className="py-12">
        <h2 className="text-3xl font-heading text-center text-primary-heading mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <Truck size={36} className="text-primary-brand mx-auto mb-4" />
            <h3 className="text-xl font-heading text-primary-heading mb-2">Free Shipping</h3>
            <p className="text-secondary-txt">On all orders over $199.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <RefreshCw size={36} className="text-primary-brand mx-auto mb-4" />
            <h3 className="text-xl font-heading text-primary-heading mb-2">30-Day Returns</h3>
            <p className="text-secondary-txt">Hassle-free guarantee on every purchase.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <Headset size={36} className="text-primary-brand mx-auto mb-4" />
            <h3 className="text-xl font-heading text-primary-heading mb-2">Expert Support</h3>
            <p className="text-secondary-txt">Musicians ready to answer your questions.</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Products Grid */}
      <section className="py-12">
        <h2 className="text-4xl font-heading text-center text-primary-heading mb-10">Featured Bestsellers</h2>
        
        {/* Renders the new responsive carousel component */}
        <FeaturedCarousel products={featuredProducts} /> 
        
        <div className="text-center mt-10">
          <a
            href="/products"
            className="inline-block px-6 py-3 border border-primary-brand text-primary-brand rounded-lg hover:bg-primary-brand hover:text-white transition-all duration-300 font-medium"
          >
            View All Instruments
          </a>
        </div>
      </section>
    </>
  );
};

export default HomePage;

// Note: The PublishChangesButton component and admin section are temporary and will be moved to a dedicated admin profile page later.
// ToDo : add backbuttons for easy navigation
// ToDo : add social media links in footer
// TODO: Speed check when clicking Guitars, Keys, Drums from homepage
// ToDo : Fit Images properly in cards and Details page
// ToDo : add filters and sorting options in products page
// ToDo : add search bar in header

// Future Enhancements:
// ToDo : add testimonials section