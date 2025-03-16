import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';

export const translations = {
  en,
  es,
  fr,
  de,
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof en;

export type TranslationPath = {
  [K in keyof TranslationKeys]: {
    [P in keyof TranslationKeys[K]]: `${K & string}.${P & string}`;
  }[keyof TranslationKeys[K]];
}[keyof TranslationKeys];

export { en, es, fr, de }; 