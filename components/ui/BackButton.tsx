'use client';

import React from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  // Optional: Text to display next to the arrow
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ label = 'Go Back' }) => {
  const router = useRouter();

  const handleGoBack = (e: React.MouseEvent) => {
    e.preventDefault();
    // This uses the browser's history stack, ensuring the user goes to the previous page they visited.
    router.back(); 
  };

  return (
    <button
      onClick={handleGoBack}
      className="flex items-center text-primary-txt hover:text-primary-brand transition-colors duration-200 mb-4 focus:outline-none"
      aria-label={label}
    >
      <ArrowLeft size={20} className="mr-2" />
      <span className="text-base font-medium">{label}</span>
    </button>
  );
};

export default BackButton;