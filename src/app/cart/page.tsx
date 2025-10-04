import Link from "next/link";

export default function CartPage() {
  return (
    <div>
      <h1>Корзина покупок</h1>
      <p>Товары в вашей корзине будут отображены здесь.</p>
      <p><Link href="/checkout">Перейти к оформлению</Link></p>
      <p><Link href="/catalog">Продолжить покупки</Link></p>
    </div>
  );
}
