import BackButton from '@/components/ui/BackButton';
import Head from 'next/head';

const FAQ_ITEMS = [
  { 
    question: "Do you offer international shipping?", 
    answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and estimated delivery times are calculated at checkout based on your location and the size of the instrument."
  },
  { 
    question: "What is your instrument setup process?", 
    answer: "Every instrument sold is inspected and professionally set up by our certified luthier team before it leaves our shop. This includes truss rod adjustments, intonation, and cleaning."
  },
  { 
    question: "How does the warranty work?", 
    answer: "New instruments carry the full manufacturer's warranty. For used or vintage items, Musicore provides a 90-day guarantee covering functional defects, detailed in our Returns Policy."
  },
  { 
    question: "Can I try an instrument before I buy it?", 
    answer: "Our showroom is open to the public during business hours. Please contact us to schedule an appointment if you plan to visit to ensure the specific instrument you want to try is available."
  },
];

const FAQPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Frequently Asked Questions | Musicore</title>
      </Head>

      <div className="py-10 max-w-3xl mx-auto">
        <BackButton />
        <h1 className="text-5xl font-heading text-primary-heading mb-10 text-center">Questions? We have Answers.</h1>
        
        <div className="space-y-6">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-brand">
              <h2 className="text-xl font-semibold text-primary-heading mb-2">{item.question}</h2>
              <p className="text-secondary-txt">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQPage;