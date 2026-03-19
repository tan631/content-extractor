import { NextRequest, NextResponse } from 'next/server';
import { extractContent } from '@/lib/cobalt';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'invalidUrl' }, { status: 400 });
    }

    const result = await extractContent(url);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'extractFailed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
