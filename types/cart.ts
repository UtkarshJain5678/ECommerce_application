export interface CartItem {
  productId: string; // The Firestore ID of the product
  slug: string;      // The URL slug for navigation
  name: string;      // Product name (cached for quick display)
  price: number;     // Current price
  brand: string;    // Brand name (for display)
  imageUrl: string;  // Image for display
  quantity: number;
}
