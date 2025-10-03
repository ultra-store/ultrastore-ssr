import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div>
      <h1>Order Successful!</h1>
      <p>Thank you for your order.</p>
      <p>Order #12345</p>
      <p><Link href="/">Return to Home</Link></p>
      <p><Link href="/catalog">Continue Shopping</Link></p>
    </div>
  );
}
