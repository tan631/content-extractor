'use client';

import { useTranslations } from 'next-intl';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const t = useTranslations();
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  function switchLocale(locale: string) {
    document.cookie = `locale=${locale};path=/;max-age=31536000`;
    window.location.reload();
  }

  return (
    <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-green-400">
        ContentExtractor
      </Link>

      <div className="flex items-center gap-4">
        {/* Language switcher */}
        <select
          onChange={(e) => switchLocale(e.target.value)}
          className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-600"
          defaultValue=""
        >
          <option value="" disabled>🌐 Lang</option>
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>

        {session?.user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 hover:opacity-80"
            >
              {session.user.image ? (
                <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold">
                  {session.user.name?.[0] || 'U'}
                </div>
              )}
              <span className="text-sm">{session.user.name}</span>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg z-50">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                >
                  {t('nav.logout')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
          >
            {t('nav.login')}
          </button>
        )}
      </div>
    </header>
  );
}
