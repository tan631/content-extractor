'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';

interface ExtractResult {
  platform: string;
  videoUrl?: string;
  thumbnail?: string;
  transcript?: string;
  title?: string;
  contentType: 'video' | 'transcript' | 'both';
}

interface Props {
  result: ExtractResult;
  sourceUrl: string;
  isLoggedIn: boolean;
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  video: '视频',
  transcript: '文案',
  both: '视频+文案',
};

export default function ResultCard({ result, sourceUrl, isLoggedIn }: Props) {
  const t = useTranslations('result');
  const tAuth = useTranslations('auth');
  const [copied, setCopied] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(!isLoggedIn);

  async function copyTranscript() {
    if (!result.transcript) return;
    await navigator.clipboard.writeText(result.transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const contentTypeLabel = CONTENT_TYPE_LABELS[result.contentType] ?? result.contentType;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {result.thumbnail && (
        <img
          src={result.thumbnail}
          alt={result.title ?? ''}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4 space-y-3">
        {result.title && (
          <p className="text-sm font-medium text-gray-800 line-clamp-2">{result.title}</p>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium capitalize">
            {result.platform}
          </span>
          <span className="text-xs text-gray-400">{contentTypeLabel}</span>
        </div>

        {result.videoUrl && (
          <a
            href={result.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            ⬇️ {t('download')}
          </a>
        )}

        {result.transcript && (
          <div>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 max-h-40 overflow-y-auto whitespace-pre-wrap">
              {result.transcript}
            </div>
            <button
              onClick={copyTranscript}
              className="mt-2 w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg text-sm transition-colors"
            >
              {copied ? `✅ ${t('copied')}` : `📋 ${t('copy')}`}
            </button>
          </div>
        )}

        {showLoginPrompt && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm">
            <p className="text-blue-800 font-medium">{tAuth('saveHistory')}</p>
            <p className="text-blue-600 text-xs mt-1">{tAuth('saveHistoryDesc')}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => signIn('google')}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded text-xs font-medium"
              >
                {tAuth('loginNow')}
              </button>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 border border-blue-200 text-blue-600 py-1.5 rounded text-xs"
              >
                {tAuth('notNow')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
