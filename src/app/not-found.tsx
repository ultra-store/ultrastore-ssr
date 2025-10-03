import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h1>Страница не найдена</h1>
      <p>К сожалению, запрашиваемая страница не существует.</p>
      <p><Link href="/">На главную</Link></p>
    </div>
  );
}
