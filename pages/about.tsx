// Filename: pages/about.tsx

import Head from 'next/head';

const AboutUsPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>About Us | Musicore</title>
      </Head>

      <div className="py-12">
        <h1 className="text-5xl font-heading text-primary-heading mb-6">Our Story: The Passion for Sound</h1>

        <div className="space-y-8 text-lg text-primary-txt max-w-4xl">
          <p className="font-semibold text-xl text-primary-brand">
            Musicore was founded on a simple belief: every musician deserves the perfect instrument to express their art.
          </p>
          
          <p>
            Started by a group of musicians and luthiers, our store isn't just about selling gear—it's about preserving the craft and connecting artists with tools that inspire. We carefully curate every guitar, drum, and keyboard, focusing on quality, playability, and heritage.
          </p>

          <h2 className="text-3xl font-heading text-primary-heading pt-4">Commitment to Quality</h2>
          <p>
            We know buying an instrument is a personal investment. That's why every item, whether vintage or brand new, undergoes a rigorous inspection by our team of expert technicians. We guarantee that when you receive an instrument from Musicore, it is tuned, set up, and ready to play.
          </p>

          <h2 className="text-3xl font-heading text-primary-heading pt-4">Meet Our Community</h2>
          <p>
            From our dedicated customer support team (all musicians themselves) to our in-house repair shop, we are committed to supporting your musical journey long after your purchase. Thank you for making Musicore your destination for sound.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutUsPage;