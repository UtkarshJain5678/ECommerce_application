// Filename: pages/returns.tsx

import Head from 'next/head';
import { RefreshCw } from 'lucide-react';

const ReturnsPolicyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Returns Policy | Musicore</title>
      </Head>

      <div className="py-12 max-w-4xl mx-auto">
        <h1 className="text-5xl font-heading text-primary-heading mb-6 flex items-center">
            <RefreshCw size={40} className="mr-4 text-primary-brand" /> 30-Day Hassle-Free Returns
        </h1>
        
        <div className="space-y-6 text-lg text-primary-txt">
          <p>
            We want you to be completely satisfied with your instrument. If you are not, you may return most items within 30 days of delivery for a full refund of the purchase price, provided the item meets the following conditions:
          </p>

          <h2 className="text-3xl font-heading text-primary-heading pt-4">Conditions for Return</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Item must be in its original, brand-new condition, exactly as it was received.</li>
            <li>All original packaging, accessories (cables, manuals, cases), and documentation must be included.</li>
            <li>Any signs of wear, modification, or misuse will result in a restocking fee or rejection of the return.</li>
            <li>Software, opened strings, and special-order items are non-returnable.</li>
          </ul>

          <h2 className="text-3xl font-heading text-primary-heading pt-4">Initiating a Return</h2>
          <p>
            To begin your return, please visit your <a href="/account" className="text-primary-brand hover:underline">My Account</a> section and find your order history. Select "Request Return" next to the applicable item. You will be provided with a return merchandise authorization (RMA) number and shipping instructions.
          </p>
        </div>
      </div>
    </>
  );
};

export default ReturnsPolicyPage;