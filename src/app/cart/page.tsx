import Link from "next/link";

export default function CartPage() {
  return (
    <div>
      <h1>Shopping Cart</h1>
      <p>Your cart items will be displayed here.</p>
      <p><Link href="/checkout">Proceed to Checkout</Link></p>
      <p><Link href="/catalog">Continue Shopping</Link></p>
    </div>
  );
}
