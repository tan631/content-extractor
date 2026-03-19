'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import ResultCard from './ResultCard';

interface ExtractResult {
  platform: string;
  videoUrl?: string;
  thumbnail?: string;
  transcript?: string;
  contentType: 'video' | 'transcript' | 'both';
}

export default function ExtractForm() {
  const t = useTranslations();
  const { data: session } = useSession();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errKey = data.error as string;
        setError(t(`errors.${errKey}` as Parameters<typeof t>[0]) || t('errors.extractFailed'));
        return;
      }

      setResult(data);
    } catch {
      setError(t('errors.extractFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t('home.placeholder')}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? t('home.extracting') : t('home.extract')}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
      )}

      {result && (
        <div className="mt-6">
          <ResultCard result={result} sourceUrl={url} isLoggedIn={!!session} />
        </div>
      )}
    </div>
  );
}
