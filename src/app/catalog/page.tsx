import Link from 'next/link';

export default function CatalogPage() {
  return (
    <div>
      <h1>Каталог</h1>
      <p>Список товаров будет здесь.</p>
      <ul>
        <li><Link href="/product/sample-product">Пример товара</Link></li>
      </ul>
    </div>
  );
}
