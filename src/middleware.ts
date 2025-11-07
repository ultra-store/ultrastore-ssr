import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if accessing order-success page
  if (request.nextUrl.pathname === '/order-success') {
    // Check for order success cookie
    const orderSuccessCookie = request.cookies.get('ultrastore_order_success');

    if (!orderSuccessCookie || orderSuccessCookie.value !== 'true') {
      // Redirect to home page if cookie is not present
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: '/order-success' };
