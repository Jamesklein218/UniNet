/**
 * Basic Setting Variables Define
 */

export const IS_DEV = process.env.NODE_ENV === 'development';

export const SITE_NAME = 'Bugs';
export const SITE_URL = IS_DEV
  ? 'https://localhost:3030/'
  : 'https://www.bugs.vn/';

// export const SITE_URL = 'https://www.bugs.vn/';
export const API_URL = 'https://recruitment.fessior.com';
// export const API_URL = 'http://192.168.1.184:4000';

// export const API_URL = 'http://103.7.41.159:3000/';
export const AUTH_URL_USER = `${API_URL}api/login/user`;
export const AUTH_URL_ADMIN = `${API_URL}api/login/admin`;

export const TEST_ID = 'Å5d47eae7e95693001bb87397';
export const BUNDLE_ID = '5d4ac413c89214001b880c9e';
export const CAPTCHA_SERVICE = 'https://captcha.stdio.vn/';

export const EVENTS_PAGE_SIZE = 24;
export const NEWS_PAGE_SIZE = 24;

export const ROLES = {
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
  USER: 'user',
};

export const BaseSetting = {
  name: 'FelixPro',
  displayName: 'UniNet',
  appVersion: '1.0.0',
  defaultLanguage: 'en',
  languageSupport: ['en', 'vi'],
  resourcesLanguage: {
    en: {
      translation: require('../lang/en.json'),
    },
    vi: {
      translation: require('../lang/vi.json'),
    },
    ar: {
      translation: require('../lang/ar.json'),
    },
    da: {
      translation: require('../lang/da.json'),
    },
    de: {
      translation: require('../lang/de.json'),
    },
    el: {
      translation: require('../lang/el.json'),
    },
    fr: {
      translation: require('../lang/fr.json'),
    },
    he: {
      translation: require('../lang/he.json'),
    },
    id: {
      translation: require('../lang/id.json'),
    },
    ja: {
      translation: require('../lang/ja.json'),
    },
    ko: {
      translation: require('../lang/ko.json'),
    },
    lo: {
      translation: require('../lang/lo.json'),
    },
    nl: {
      translation: require('../lang/nl.json'),
    },
    zh: {
      translation: require('../lang/zh.json'),
    },
    fa: {
      translation: require('../lang/fa.json'),
    },
    km: {
      translation: require('../lang/km.json'),
    },
  },
};
