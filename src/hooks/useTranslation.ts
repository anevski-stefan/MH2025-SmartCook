'use client';

import { useState, useEffect } from 'react';
import { translations } from '../translations';

type TranslationsType = typeof translations.en;

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type DotNestedKeys<T> = (T extends object ?
    { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
    : '') extends infer D ? Extract<D, string> : never;

export type TranslationKey = DotNestedKeys<TranslationsType>;

type TranslationParams = Record<string, string | number>;

const LANG_COOKIE = 'NEXT_LOCALE';
const DEFAULT_LOCALE = 'en';

export function useTranslation() {
  const [locale, setLocale] = useState<keyof typeof translations>(DEFAULT_LOCALE);

  useEffect(() => {
    const savedLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith(LANG_COOKIE))
      ?.split('=')[1];

    if (savedLocale && Object.keys(translations).includes(savedLocale)) {
      setLocale(savedLocale as keyof typeof translations);
    }
  }, []);

  const t = (key: TranslationKey, params?: TranslationParams): string => {
    try {
      const keys = key.split('.');
      let current: any = translations[locale] || translations[DEFAULT_LOCALE];
      
      if (!current) {
        console.error(`No translations found for locale: ${locale}`);
        return key;
      }

      for (const k of keys) {
        if (!current || typeof current !== 'object') {
          console.error(`Translation path error: ${key} at key ${k}`, { current, locale, translations });
          return key;
        }
        current = current[k];
        if (current === undefined) {
          console.error(`Missing translation for key: ${key} at ${k}`, { locale, translations });
          return key;
        }
      }
      
      if (typeof current !== 'string') {
        console.error(`Translation value error: ${key} is not a string`, { current, locale });
        return key;
      }

      if (params) {
        return Object.entries(params).reduce((str, [key, value]) => {
          return str.replace(`{${key}}`, value.toString());
        }, current);
      }
      
      return current;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  const changeLocale = (newLocale: keyof typeof translations) => {
    setLocale(newLocale);
    document.cookie = `${LANG_COOKIE}=${newLocale};path=/;max-age=31536000`; // 1 year
  };

  return {
    t,
    locale,
    changeLocale,
    translations,
  };
} 