'use client'; // This is a client component in the App Router, but good practice to show interaction

import React, { useState } from 'react';
import { Rocket } from 'lucide-react';

interface PublishChangesButtonProps {
  paths: string[]; // List of paths to revalidate
}

const PublishChangesButton: React.FC<PublishChangesButtonProps> = ({ paths }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // NOTE: You must get the secret token securely.
  // We use NEXT_PUBLIC prefix for client-side testing, but for production security,
  // this component should call a secure Next.js API route that handles the secret check.
  // TODO
  const SECRET_TOKEN = process.env.REVALIDATE_SECRET_TOKEN;
  const revalidateEndpoint = `/api/revalidate?secret=${SECRET_TOKEN}`;

  const handlePublish = async () => {
    if (paths.length === 0 || !SECRET_TOKEN) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(revalidateEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paths }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to revalidate paths on server.');
      }

      // Success
      alert(`✅ Successfully published ${paths.length} changes! Please refresh the public pages to validate.`);

    } catch (error) {
        console.error("Webhook error:", error);
        setError('Publish failed. Check console for details.');
      //TODO for alert show good toaster message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handlePublish}
        disabled={loading || paths.length === 0}
        className={`flex items-center justify-center mx-auto py-3 px-6 font-bold rounded-lg transition-all duration-300 
          ${loading 
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-primary-brand text-white hover:bg-opacity-90 shadow-md'
          }`}
      >
        <Rocket size={20} className="mr-2" />
        {loading ? 'Publishing...' : `Publish ${paths.length} Pages`}
      </button>
      {error && <p className="text-error-color text-sm mt-2">{error}</p>}
    </div>
  );
};

export default PublishChangesButton;