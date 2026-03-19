'use client';

import { useTranslations } from 'next-intl';

const PLATFORMS = [
  { key: 'youtube', icon: '▶️', color: 'bg-red-100 text-red-700' },
  { key: 'tiktok', icon: '🎵', color: 'bg-gray-100 text-gray-700' },
  { key: 'twitter', icon: '🐦', color: 'bg-blue-100 text-blue-700' },
  { key: 'instagram', icon: '📸', color: 'bg-pink-100 text-pink-700' },
  { key: 'facebook', icon: '👥', color: 'bg-blue-100 text-blue-800' },
  { key: 'xiaohongshu', icon: '📕', color: 'bg-red-100 text-red-600' },
  { key: 'douyin', icon: '🎬', color: 'bg-gray-100 text-gray-800' },
] as const;

export default function PlatformGrid() {
  const t = useTranslations();

  return (
    <div className="mt-8">
      <p className="text-sm text-gray-500 text-center mb-4">{t('home.supported')}</p>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
        {PLATFORMS.map(({ key, icon, color }) => (
          <div
            key={key}
            className={`flex flex-col items-center gap-1 rounded-xl p-3 ${color}`}
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-xs font-medium text-center leading-tight">
              {t(`platforms.${key}.name`)}
            </span>
            <span className="text-[10px] opacity-70 text-center">
              {t(`platforms.${key}.type`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
