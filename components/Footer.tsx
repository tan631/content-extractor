'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-gray-900 text-gray-400 text-sm py-6 px-6 mt-auto">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-gray-500 text-xs">© 2024 ContentExtractor</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">{t('footer.about')}</a>
          <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
          <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
          <a href="#" className="hover:text-white transition-colors">{t('footer.feedback')}</a>
        </div>
      </div>
    </footer>
  );
}
