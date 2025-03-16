'use client';

import { useTranslation } from '@/hooks/useTranslation';

const languageNames = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
} as const;

type SupportedLocale = keyof typeof languageNames;

export function LanguageSelector() {
  const { locale, changeLocale } = useTranslation();
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as SupportedLocale;
    changeLocale(newLocale);
    window.location.reload();
  };

  return (
    <div className="relative inline-block">
      <select
        onChange={handleLanguageChange}
        value={locale}
        className="appearance-none bg-transparent text-white border border-white/30 rounded-lg px-4 py-2 pr-8 
                   hover:border-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent
                   cursor-pointer text-sm font-medium"
      >
        {Object.entries(languageNames).map(([code, name]) => (
          <option key={code} value={code} className="text-gray-900">
            {name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
} 