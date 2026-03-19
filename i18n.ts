import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headersList = await headers();

  let locale = cookieStore.get('locale')?.value;

  if (!locale) {
    const acceptLanguage = headersList.get('accept-language') || '';
    locale = acceptLanguage.toLowerCase().includes('zh') ? 'zh' : 'en';
  }

  const messages = locale === 'zh'
    ? (await import('./messages/zh.json')).default
    : (await import('./messages/en.json')).default;

  return { locale, messages };
});
