import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <div>
      <h1>Оформление заказа</h1>
      <p>Форма оформления заказа будет здесь.</p>
      
      <form>
        <h2>Контактная информация</h2>
        <p>
          <label>Имя: <input type="text" /></label>
        </p>
        <p>
          <label>Email: <input type="email" /></label>
        </p>
        
        <h2>Адрес доставки</h2>
        <p>
          <label>Адрес: <input type="text" /></label>
        </p>
        <p>
          <label>Город: <input type="text" /></label>
        </p>
        
        <button type="submit">Оформить заказ</button>
      </form>
      
      <p><Link href="/cart">Вернуться в корзину</Link></p>
    </div>
  );
}
