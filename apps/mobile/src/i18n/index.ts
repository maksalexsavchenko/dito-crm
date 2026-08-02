import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { loyaltyBrands, defaultLoyaltyBrandId, tenants } from '@dito/config';
import uk from './uk.json';
import en from './en.json';

const tenantLocale = tenants[loyaltyBrands[defaultLoyaltyBrandId].tenantId]?.defaultLocale ?? 'uk';
const deviceLocale = getLocales()[0]?.languageCode;
const lng = deviceLocale === 'en' ? 'en' : tenantLocale;

void i18n.use(initReactI18next).init({
  resources: {
    uk: { translation: uk },
    en: { translation: en },
  },
  lng,
  fallbackLng: 'uk',
  interpolation: { escapeValue: false },
});

export default i18n;
