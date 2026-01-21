import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Default locale - could be enhanced to detect from cookies/headers
  const locale = 'en';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
