import Link from 'next/link';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <div>
      <h1>Product: {slug}</h1>
      <p>Product details will go here.</p>
      <p><Link href="/catalog">Back to Catalog</Link></p>
    </div>
  );
}
