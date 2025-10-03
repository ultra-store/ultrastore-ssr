import Link from 'next/link';

export default function CatalogPage() {
  return (
    <div>
      <h1>Catalog</h1>
      <p>Product listings will go here.</p>
      <ul>
        <li><Link href="/product/sample-product">Sample Product</Link></li>
      </ul>
    </div>
  );
}
