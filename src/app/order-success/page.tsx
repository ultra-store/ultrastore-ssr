import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div>
      <h1>Заказ оформлен!</h1>
      <p>Спасибо за ваш заказ.</p>
      <p>Заказ №12345</p>
      <p><Link href="/">Вернуться на главную</Link></p>
      <p><Link href="/catalog">Продолжить покупки</Link></p>
    </div>
  );
}
