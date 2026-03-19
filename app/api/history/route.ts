import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory store for demo (replace with D1 in production)
const historyStore: Record<string, Array<{
  id: string;
  url: string;
  platform: string;
  title?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  transcript?: string;
  contentType: string;
  createdAt: string;
}>> = {};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id || session?.user?.email;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = 20;

  const userHistory = historyStore[userId] || [];
  const sorted = [...userHistory].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  return NextResponse.json({ items: paginated, total: userHistory.length, page, pageSize });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id || session?.user?.email;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  if (!historyStore[userId]) historyStore[userId] = [];

  const record = { id: crypto.randomUUID(), ...body, createdAt: new Date().toISOString() };
  historyStore[userId].unshift(record);
  return NextResponse.json(record);
}
