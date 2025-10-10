import Link from 'next/link';

async function checkWordPressConnection() {
  const wpUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
  
  if (!wpUrl) {
    return {
      status: 'not_configured',
      message: 'WooCommerce URL не настроен. Пожалуйста, установите NEXT_PUBLIC_WOOCOMMERCE_URL в переменных окружения.',
      url: null
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${wpUrl}/wp-json`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store'
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        status: 'connected',
        message: `Успешно подключено к WooCommerce/WordPress`,
        url: wpUrl,
        siteName: data.name || 'Неизвестно',
        description: data.description || ''
      };
    } else {
      return {
        status: 'error',
        message: `Не удалось подключиться: HTTP ${response.status}`,
        url: wpUrl
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return {
      status: 'error',
      message: `Ошибка подключения: ${errorMessage}`,
      url: wpUrl
    };
  }
}

export default async function HomePage() {
  const wpStatus = await checkWordPressConnection();
  
  return (
    <div>
      <h1>Главная страница</h1>      
      <div style={{
        margin: '20px 0',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: wpStatus.status === 'connected' ? '#d4edda' : wpStatus.status === 'error' ? '#f8d7da' : '#fff3cd'
      }}>
        <h2 style={{ marginTop: 0, fontSize: '1.2em' }}>Статус подключения WooCommerce</h2>
        <p style={{ margin: '5px 0' }}>
          <strong>Статус:</strong> {' '}
          <span style={{
            color: wpStatus.status === 'connected' ? '#155724' : wpStatus.status === 'error' ? '#721c24' : '#856404'
          }}>
            {wpStatus.status === 'connected' ? '✓ Подключено' : wpStatus.status === 'error' ? '✗ Ошибка' : '⚠ Не настроено'}
          </span>
        </p>
        <p style={{ margin: '5px 0' }}><strong>Сообщение:</strong> {wpStatus.message}</p>
        {wpStatus.url && <p style={{ margin: '5px 0' }}><strong>URL:</strong> {wpStatus.url}</p>}
        {wpStatus.status === 'connected' && wpStatus.siteName && (
          <>
            <p style={{ margin: '5px 0' }}><strong>Название сайта:</strong> {wpStatus.siteName}</p>
            {wpStatus.description && <p style={{ margin: '5px 0' }}><strong>Описание:</strong> {wpStatus.description}</p>}
          </>
        )}
      </div>
      
      <p><Link href="/catalog">Посмотреть каталог</Link></p>
    </div>
  );
}
