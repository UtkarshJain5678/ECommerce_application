// Filename: pages/contact.tsx

import Head from 'next/head';
import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';

// Define the shape of the form data
interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Universal handler for updating form state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // 1. Send form data to the Next.js API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // 2. Check for successful server response
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' }); // Clear form on success
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Server error occurred.');
      }
    } catch (error) {
      console.error("Form Submission Error:", error);
      setStatus('error');
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | Musicore</title>
      </Head>

      <div className="py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Contact Form */}
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <BackButton />
          <h1 className="text-4xl font-heading text-primary-heading mb-6">Send Us a Message</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <input 
              name="name" // Crucial for identifying the field in the handler
              type="text" 
              placeholder="Your Name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-brand focus:border-primary-brand" 
            />
            
            <input 
              name="email"
              type="email" 
              placeholder="Your Email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-brand focus:border-primary-brand" 
            />
            
            <textarea 
              name="message"
              placeholder="Your Message" 
              rows={5} 
              value={formData.message} 
              onChange={handleChange} 
              required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-brand focus:border-primary-brand"
            ></textarea>
            
            {/* Submit Button & Status */}
            <button 
              type="submit" 
              disabled={status === 'loading'} // Disable button while sending
              className={`w-full py-3 px-6 font-bold text-white rounded-lg transition duration-200 
                ${status === 'loading' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary-brand hover:bg-opacity-90'
                }`}
            >
              {status === 'loading' ? 'Sending Message...' : 'Send Message'}
            </button>

            {/* Response Messages */}
            {status === 'success' && (
              <p className="text-secondary-brand font-semibold flex items-center mt-3 p-2 bg-secondary-brand/10 rounded">
                <CheckCircle size={18} className="mr-2" />
                Message sent successfully! Please check your email for a confirmation.
              </p>
            )}
            {status === 'error' && (
              <p className="text-error-color font-semibold flex items-center mt-3 p-2 bg-error-color/10 rounded">
                <AlertTriangle size={18} className="mr-2" />
                Failed to send message. Please try again later.
              </p>
            )}

          </form>
        </div>
        
        {/* Right Column: Contact Details (SAME AS BEFORE) */}
        <div className="space-y-8 p-8">
          <h2 className="text-4xl font-heading text-primary-heading mb-4">Contact Information</h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Mail size={24} className="text-primary-brand" />
              <div>
                <p className="font-semibold text-primary-heading">Email Support</p>
                <p className="text-secondary-txt">utkarshjain5678@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Phone size={24} className="text-primary-brand" />
              <div>
                <p className="font-semibold text-primary-heading">Phone Sales & Advice</p>
                <p className="text-secondary-txt">(+91) 9665244714 (Mon-Fri, 9am - 5pm EST)</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin size={24} className="text-primary-brand flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-primary-heading">Showroom Location</p>
                <p className="text-secondary-txt">
                  Sector 48 <br />
                  Noida
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;