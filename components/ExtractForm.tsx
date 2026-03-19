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
  title?: string;
  contentType: 'video' | 'transcript' | 'both';
}

const KNOWN_ERRORS = ['invalidUrl', 'extractFailed', 'unsupportedPlatform'] as const;
type ErrorKey = typeof KNOWN_ERRORS[number];

export default function ExtractForm() {
  const t = useTranslations('home');
  const tErr = useTranslations('errors');
  const { data: session } = useSession();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [error, setError] = useState('');

  function getErrorMessage(key: string): string {
    if (KNOWN_ERRORS.includes(key as ErrorKey)) {
      return tErr(key as ErrorKey);
    }
    return tErr('extractFailed');
  }

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
        setError(getErrorMessage(data.error));
        return;
      }

      setResult(data);
    } catch {
      setError(tErr('extractFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t('placeholder')}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? t('extracting') : t('extract')}
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
