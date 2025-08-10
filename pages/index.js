export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Ultrastore POC</h1>
      <p>Next.js frontend is running.</p>
      <p>Backend (WordPress+WooCommerce) expected at {process.env.NEXT_PUBLIC_WORDPRESS_URL}</p>
    </main>
  );
}
