// Filename: lib/context/CartContext.tsx (UPDATED)
'use client'; 

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem } from '@/types/cart'; // Assuming you created this file
import { db, auth } from '@/components/firebase/config'; // Your Firebase imports
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  loadingCart: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartEmpty: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'musicore_cart';

// --- Utility: Get local cart items ---
const getLocalCart = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const json = localStorage.getItem(LOCAL_STORAGE_KEY);
    return json ? JSON.parse(json) : [];
};

// --- Utility: Merge Carts (Simple Merge) ---
const mergeCarts = (localCart: CartItem[], firestoreCartItems: unknown[]): CartItem[] => {
    const mergedCartMap = new Map<string, CartItem>();

//     firestoreCartItems.forEach(_item => {
//         // Simplified merge logic
//     });

    localCart.forEach(item => {
        mergedCartMap.set(item.productId, item);
    });

    if (localCart.length > 0) return localCart;
    return firestoreCartItems as CartItem[]; 
};


// --- Cart Provider Component (Now exported as DEFAULT) ---
const CartProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [user, loadingAuth] = useAuthState(auth);

  // --- PERSISTENCE LOGIC: Sync to DB or Local Storage ---
  const syncCartToStorage = useCallback(async (currentCart: CartItem[]) => {
    if (loadingAuth) return;

    if (user) {
      // Authenticated: Sync to Firestore
      try {
        const cartRef = doc(db, 'carts', user.uid);
        const cartDataToStore = currentCart.map(({ productId, quantity }) => ({ productId, quantity }));
        await setDoc(cartRef, { items: cartDataToStore, lastUpdated: new Date() }, { merge: true });
      } catch (e) {
        console.error("Error writing cart to Firestore:", e);
      }
    } else {
      // Unauthenticated: Sync to Local Storage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentCart));
    }
  }, [user, loadingAuth]);


  // --- INITIAL LOAD LOGIC: Handles Guest -> Member Merge ---
  useEffect(() => {
    if (loadingAuth || typeof window === 'undefined') return;

    const loadCart = async () => {
      let loadedCart: CartItem[] = getLocalCart();
      const localCartString = localStorage.getItem(LOCAL_STORAGE_KEY);
      
      if (user) {
        // User just logged in: Check Firestore for previous cart
        const cartRef = doc(db, 'carts', user.uid);
        const cartSnap = await getDoc(cartRef);
        
        if (cartSnap.exists()) {
          const firestoreItems = cartSnap.data().items || [];
          loadedCart = mergeCarts(loadedCart, firestoreItems); 
        } else if (localCartString) {
          loadedCart = getLocalCart();
        }
        
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }

      setCart(loadedCart);
      setLoadingCart(false);
    };

    loadCart();
  }, [user, loadingAuth]);


  // --- CART MANIPULATION FUNCTIONS ---

const addItem = (newItem: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === newItem.productId);
      let newCart;

      if (existingItem) {
        newCart = prevCart.map(item =>
          item.productId === newItem.productId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        newCart = [...prevCart, newItem];
      }
      
      syncCartToStorage(newCart);
      return newCart;
    });
  };

  const removeItem = (productId: string) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.productId !== productId);
      syncCartToStorage(newCart);
      return newCart; 
    });
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    setCart(prevCart => {
      
      if (quantity <= 0) {
        const newCart = prevCart.filter(item => item.productId !== productId);
        syncCartToStorage(newCart);
        return newCart;
      }
      
      const newCart = prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: quantity }
          : item
      );
      
      syncCartToStorage(newCart);
      return newCart;
    });
  };

const clearCart = () => {
    setCart([]);
    syncCartToStorage([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const isCartEmpty = cart.length === 0;

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      loadingCart,
      addItem,
      removeItem,
      updateItemQuantity,
      clearCart,
      isCartEmpty,
    }}>
      {children}
    </CartContext.Provider>
  );
};

// --- EXPORTS ---

// The hook remains a named export
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// The component is now a default export for unambiguous import in _app.tsx
export default CartProviderComponent;