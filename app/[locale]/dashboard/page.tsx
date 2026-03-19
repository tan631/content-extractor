import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { useTranslations } from 'next-intl';
import HistoryList from '@/components/HistoryList';

async function getHistory(userId: string) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/history?userId=${userId}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function DashboardContent({ items }: { items: unknown[] }) {
  const t = useTranslations('dashboard');
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('title')}</h1>
      <HistoryList items={items as Parameters<typeof HistoryList>[0]['items']} />
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/');
  }

  const items = await getHistory(session.user.id);

  return <DashboardContent items={items} />;
}
