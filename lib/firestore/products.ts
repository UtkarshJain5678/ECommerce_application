// Filename: lib/firestore/products.ts

// import { db } from '@/components/firebase/config'; // Use your actual path
import { db } from '@/components/firebase/config'; // Use your actual path
import { collection, getDocs, query, where, DocumentData } from 'firebase/firestore';
import { Product } from '@/types/product';
import { CollectionReference, Query } from 'firebase/firestore';

// Utility function to convert Firestore DocumentData to our Product interface
const productConverter = (doc: DocumentData): Product => ({
  id: doc.id,
  slug: doc.data().slug,
  name: doc.data().name,
  brand: doc.data().brand,
  description: doc.data().description,
  price: doc.data().price,
  stock: doc.data().stock,
  category: doc.data().category,
  specs: doc.data().specs || {},
  imageUrls: doc.data().imageUrls || [],
  isFeatured: doc.data().isFeatured || false,
});

// --- FETCHING FUNCTIONS ---

// 1. Fetch All Products (or based on query for PLP)
export async function getProducts(category?: string): Promise<Product[]> {
  const productsCollection = collection(db, 'products') as CollectionReference<DocumentData>;
  
  // 1. Correct the type to allow both CollectionReference OR Query
  let finalQuery: CollectionReference<DocumentData> | Query<DocumentData> = productsCollection;
  // OR: you could use 'any' if necessary, but the union type above is safer.
  
  // If a category slug is provided, we change the query to filter the results
  if (category) {
    // This assignment is now valid because finalQuery can hold a Query type
    finalQuery = query(
      productsCollection,
      where('category', 'array-contains', category.toLowerCase()) 
    );
  }

  // Pass the correct reference/query to getDocs
  const snapshot = await getDocs(finalQuery); 
  
  const products: Product[] = snapshot.docs.map(doc => productConverter(doc));
  return products;
}

// 2. Fetch a Single Product (for PDP)
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const productsCollection = collection(db, 'products');
  const q = query(productsCollection, where('slug', '==', slug));

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  // A slug query should return only one result
  const docSnap = snapshot.docs[0];
  return productConverter(docSnap);
}

// 3. Fetch Featured Products (for Homepage)
export async function getFeaturedProducts(): Promise<Product[]> {
  const productsCollection = collection(db, 'products');
  const q = query(productsCollection, where('isFeatured', '==', true));

  const snapshot = await getDocs(q);
  const featuredProducts: Product[] = snapshot.docs.map(doc => productConverter(doc));
  return featuredProducts;
}