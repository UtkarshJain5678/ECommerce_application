// Filename: lib/firestore/products.ts

// import { db } from '@/components/firebase/config'; // Use your actual path
import { db } from '@/components/firebase/config'; // Use your actual path
import { collection, getDocs, getDoc, doc, query, where, DocumentData } from 'firebase/firestore';
import { Product } from '@/types/product';

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
export async function getProducts(categorySlug?: string): Promise<Product[]> {
  const productsCollection = collection(db, 'products');
  
  // Define the base collection or query here
  let finalQuery: any = productsCollection; 

  // If a category slug is provided, we change the query to filter the results
  if (categorySlug) {
    // When using query(), the resulting object is a Query, not a CollectionReference
    finalQuery = query(
      productsCollection,
      where('category', 'array-contains', categorySlug.toLowerCase())
    );
  }

  // Pass the correct Query or CollectionReference to getDocs
  // NOTE: finalQuery will be a CollectionReference if categorySlug is undefined,
  // or a Query if categorySlug is defined. Both are accepted by getDocs.
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