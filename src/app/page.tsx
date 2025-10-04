import Link from 'next/link';

async function checkWordPressConnection() {
  const wpUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
  
  if (!wpUrl) {
    return {
      status: 'not_configured',
      message: 'WooCommerce URL not configured. Please set NEXT_PUBLIC_WOOCOMMERCE_URL in your environment variables.',
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
        message: `Successfully connected to WooCommerce/WordPress`,
        url: wpUrl,
        siteName: data.name || 'Unknown',
        description: data.description || ''
      };
    } else {
      return {
        status: 'error',
        message: `Failed to connect: HTTP ${response.status}`,
        url: wpUrl
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      status: 'error',
      message: `Connection failed: ${errorMessage}`,
      url: wpUrl
    };
  }
}

export default async function HomePage() {
  const wpStatus = await checkWordPressConnection();
  
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the store. ✨ Deployment test successful!</p>
      
      <div style={{
        margin: '20px 0',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: wpStatus.status === 'connected' ? '#d4edda' : wpStatus.status === 'error' ? '#f8d7da' : '#fff3cd'
      }}>
        <h2 style={{ marginTop: 0, fontSize: '1.2em' }}>WooCommerce Connection Status</h2>
        <p style={{ margin: '5px 0' }}>
          <strong>Status:</strong> {' '}
          <span style={{
            color: wpStatus.status === 'connected' ? '#155724' : wpStatus.status === 'error' ? '#721c24' : '#856404'
          }}>
            {wpStatus.status === 'connected' ? '✓ Connected' : wpStatus.status === 'error' ? '✗ Error' : '⚠ Not Configured'}
          </span>
        </p>
        <p style={{ margin: '5px 0' }}><strong>Message:</strong> {wpStatus.message}</p>
        {wpStatus.url && <p style={{ margin: '5px 0' }}><strong>URL:</strong> {wpStatus.url}</p>}
        {wpStatus.status === 'connected' && wpStatus.siteName && (
          <>
            <p style={{ margin: '5px 0' }}><strong>Site Name:</strong> {wpStatus.siteName}</p>
            {wpStatus.description && <p style={{ margin: '5px 0' }}><strong>Description:</strong> {wpStatus.description}</p>}
          </>
        )}
      </div>
      
      <p><Link href="/catalog">Browse Catalog</Link></p>
    </div>
  );
}
