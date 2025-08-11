import {NextResponse} from 'next/server';
import {woocommerce} from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await woocommerce.getProducts({per_page: 1});
    return NextResponse.json({ok: true, count: items.length});
  } catch (e: any) {
    return NextResponse.json({ok: false, error: e?.message || String(e)}, {status: 500});
  }
}


