export interface Product {
  id: string; // Document ID from Firestore
  slug: string; // URL-friendly name (e.g., 'fender-stratocaster')
  name: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  category: string[]; // e.g., ['Guitars', 'Electric']
  specs: { [key: string]: string }; // Technical specifications
  imageUrls: string[]; // URLs stored in Firebase Storage
  isFeatured: boolean; // For homepage display
}
