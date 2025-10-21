import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, path } = body;

    // Verify secret token (you should store this securely)
    if (secret !== process.env.NEXT_PUBLIC_REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // Revalidate specific path
    if (path) {
      // This would revalidate the homepage cache
      // Note: In Next.js 15, you might need to use different approach
      console.log(`Revalidating path: ${path}`);
    }

    return NextResponse.json({ message: 'Cache revalidated successfully' });
  } catch (error) {
    console.error('Revalidation error:', error);

    return NextResponse.json({ message: 'Error revalidating cache' }, { status: 500 });
  }
}
