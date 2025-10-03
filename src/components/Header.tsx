import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <nav>
        <Link href="/">Home</Link>
        {' | '}
        <Link href="/catalog">Catalog</Link>
        {' | '}
        <Link href="/cart">Cart</Link>
      </nav>
      <hr />
    </header>
  );
}
