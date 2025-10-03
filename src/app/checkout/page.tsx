import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <div>
      <h1>Checkout</h1>
      <p>Checkout form will go here.</p>
      
      <form>
        <h2>Contact Information</h2>
        <p>
          <label>Name: <input type="text" /></label>
        </p>
        <p>
          <label>Email: <input type="email" /></label>
        </p>
        
        <h2>Shipping Address</h2>
        <p>
          <label>Address: <input type="text" /></label>
        </p>
        <p>
          <label>City: <input type="text" /></label>
        </p>
        
        <button type="submit">Place Order</button>
      </form>
      
      <p><Link href="/cart">Back to Cart</Link></p>
    </div>
  );
}
