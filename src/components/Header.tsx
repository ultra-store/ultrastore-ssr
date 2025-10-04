import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <nav>
        <Link href="/">Главная</Link>
        {' | '}
        <Link href="/catalog">Каталог</Link>
        {' | '}
        <Link href="/cart">Корзина</Link>
      </nav>
      <hr />
    </header>
  );
}
