import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image'; 
import { useCart } from '@/lib/context/CartContext';
import { Trash2, ShoppingCart } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';

const CartPage: React.FC = () => {
  const { cart, cartCount, removeItem, updateItemQuantity, clearCart, loadingCart } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 199 ? 0 : 15.00; 
  const total = subtotal + shipping;

  if (loadingCart) {
    return <div className="text-center py-20 text-xl text-primary-brand">Loading Cart...</div>;
  }

  return (
    <>
      <Head>
        <title>Shopping Cart ({cartCount}) | Musicore</title>
      </Head>

      <div className="py-10">
        <BackButton />
        <h1 className="text-4xl font-heading text-primary-heading mb-8">Your Shopping Cart ({cartCount} Items)</h1>

        {cart.length === 0 ? (
          // Empty Cart State (Same)
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <ShoppingCart size={48} className="text-secondary-txt mx-auto mb-4" />
            <p className="text-2xl font-heading text-primary-heading mb-2">Your cart is empty.</p>
            <Link href="/products" className="text-primary-brand hover:underline">
              Start Shopping for Instruments
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column: Cart Items (Mobile: Stacks Vertically) */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item.productId} className="flex flex-col sm:flex-row items-start sm:items-center bg-white p-4 rounded-lg shadow-md border">
                  
                  {/* Image and Product Info Group */}
                  <div className="flex items-start w-full sm:w-auto">
                    {/* Image Container */}
                    <div className="w-20 h-20 relative mr-4 flex-shrink-0">
                      <Image 
                        src={item.imageUrl} 
                        alt={item.name} 
                        fill 
                        style={{ objectFit: 'cover' }}
                        className="rounded-md" 
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <Link href={`/products/${item.slug}`} className="text-lg font-semibold text-primary-heading hover:text-primary-brand transition">
                        {item.name}
                      </Link>
                      {/* Show unit price on mobile for clarity */}
                      <p className="text-secondary-txt text-sm sm:hidden">${item.price.toFixed(2)} / Unit</p> 
                      <p className="text-secondary-txt hidden sm:block">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Quantity, Subtotal, and Remove Group (Mobile: Below Product Info) */}
                  <div className="flex justify-between items-center w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto">
                    
                    {/* Quantity Selector */}
                    <div className="flex flex-col items-start sm:items-end mr-4">
                       <span className="text-xs text-secondary-txt sm:hidden mb-1">Quantity</span>
                       <input
                         type="number"
                         min="1"
                         value={item.quantity}
                         onChange={(e) => updateItemQuantity(item.productId, parseInt(e.target.value) || 1)}
                         className="w-16 p-2 border rounded-lg text-center"
                       />
                    </div>
                    
                    {/* Line Item Subtotal */}
                    <div className="flex flex-col items-start sm:items-end mr-4">
                       <span className="text-xs text-secondary-txt sm:hidden mb-1">Total</span>
                       <p className="font-bold text-lg w-20 text-left sm:text-right">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-error-color hover:text-red-700 transition p-2 flex-shrink-0"
                      aria-label="Remove Item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div> {/* End Quantity/Subtotal Group */}
                </div>
              ))}
              <button onClick={clearCart} className="text-secondary-txt hover:text-error-color text-sm underline float-right mt-4">Clear Cart</button>
            </div>

            {/* Right Column: Order Summary (Same, relies on LG breakpoint for stacking) */}
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg h-fit border">
              <h2 className="text-2xl font-heading text-primary-heading mb-4 border-b pb-2">Order Summary</h2>
              
              <div className="space-y-3 text-primary-txt">
                <div className="flex justify-between">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between font-bold text-xl border-t pt-4 text-primary-brand">
                  <span>Order Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout" className="mt-6 w-full py-3 px-6 inline-block text-center font-bold text-white bg-secondary-brand rounded-lg hover:bg-opacity-90 transition duration-200">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;