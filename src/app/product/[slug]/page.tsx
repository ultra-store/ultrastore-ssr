import Link from 'next/link';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <div>
      <h1>Товар: {slug}</h1>
      <p>Информация о товаре будет здесь.</p>
      <p><Link href="/catalog">Вернуться в каталог</Link></p>
    </div>
  );
}
