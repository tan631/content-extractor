'use client';

import { useTranslations } from 'next-intl';

interface HistoryItem {
  id: string;
  sourceUrl: string;
  platform: string;
  videoUrl?: string;
  transcript?: string;
  contentType: 'video' | 'transcript' | 'both';
  createdAt: string;
}

interface Props {
  items: HistoryItem[];
}

export default function HistoryList({ items }: Props) {
  const t = useTranslations();

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📭</p>
        <p>{t('dashboard.empty')}</p>
      </div>
    );
  }

  async function copyTranscript(text: string) {
    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium capitalize">
                  {item.platform}
                </span>
                <span className="text-xs text-gray-400">
                  {t(`dashboard.${item.contentType}` as Parameters<typeof t>[0])}
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate">{item.sourceUrl}</p>
              <p className="text-xs text-gray-300 mt-1">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              {item.videoUrl && (
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  {t('dashboard.download')}
                </a>
              )}
              {item.transcript && (
                <button
                  onClick={() => copyTranscript(item.transcript!)}
                  className="text-xs border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {t('dashboard.copyTranscript')}
                </button>
              )}
              <a
                href={`/?url=${encodeURIComponent(item.sourceUrl)}`}
                className="text-xs border border-gray-300 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                {t('dashboard.reExtract')}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
