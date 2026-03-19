import { useTranslations } from 'next-intl';
import ExtractForm from '@/components/ExtractForm';
import PlatformGrid from '@/components/PlatformGrid';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('title')}</h1>
        <p className="text-gray-500 text-lg">{t('subtitle')}</p>
      </div>

      <ExtractForm />
      <PlatformGrid />
    </div>
  );
}
