import Head from 'next/head';
import { Package, Globe } from 'lucide-react';
import Link from 'next/link';
import BackButton from '@/components/ui/BackButton';

const ShippingInfoPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Shipping Information | Musicore</title>
      </Head>

      <div className="py-10 max-w-4xl mx-auto">
        <BackButton />
        <h1 className="text-5xl font-heading text-primary-heading mb-6 flex items-center">
            <Package size={40} className="mr-4 text-primary-brand" /> Delivery & Shipping
        </h1>
        
        <div className="space-y-6 text-lg text-primary-txt">
          <p>
            We strive to process and ship all orders within 1-2 business days. All instruments are packed with professional-grade materials to ensure safe transit, fully insured, and tracked.
          </p>

          <h2 className="text-3xl font-heading text-primary-heading pt-4">Domestic Shipping (India)</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Delhi NCR:</strong> Estimated 1-2 business days.</li>
            <li><strong>Other Cities:</strong> Estimated 5-7 business days.</li>
            <li><strong>Free Ground Shipping:</strong> Available for all orders over ₹14,999.</li>
            <li><strong>Standard Shipping:</strong> ₹500 flat rate for orders under ₹14,999.</li>
            <li><strong>Express 2-Day:</strong> Calculated at checkout based on weight.</li>
          </ul>
          
          <h2 className="text-3xl font-heading text-primary-heading pt-4 flex items-center">
            <Globe size={28} className="mr-3 text-secondary-brand" /> International Shipping
          </h2>
          <p>
            We offer international delivery via DHL Express or FedEx. Please note that shipping rates displayed at checkout **do not include** local import duties, customs fees, or taxes (VAT). The customer is responsible for all import charges upon delivery.
          </p>

          <h2 className="text-3xl font-heading text-primary-heading pt-4">Tracking Your Order</h2>
          <p>
            Once your order ships, you will receive an email confirmation with a tracking number. You can also view the status of your order anytime in your <Link href="/account" className="text-primary-brand hover:underline">My Account</Link> dashboard.
          </p>
        </div>
      </div>
    </>
  );
};

export default ShippingInfoPage;