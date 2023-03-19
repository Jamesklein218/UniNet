import path from 'path';
import { ServiceAccount } from 'firebase-admin';

export const IS_PRODUCTION = process.env.NODE_ENV == 'production';
console.log('Running on Node ', process.version);

export const SERVICE_PORT = +process.env.PORT || 4000;
export const SERVICE_NAME = '';

export const ROOT_DOMAIN = '';

export const FE_ADDRESS = IS_PRODUCTION
    ? ''
    : '';

const DB_HOST = IS_PRODUCTION ? '' : '';
const DB_PORT = IS_PRODUCTION ? 27017 : 27071;
const DB_USERNAME = '';
const DB_PASSWORD = '';

export const DB_NAME = '';
export const DB_CONN_STRING = '';

export const HASH_ROUNDS = 10;
export const PASSWORD_SCERET_KEY = '';
export const JWT_SECRET = '';

export const WORKING_DIR = path.resolve(process.env.WORKING_DIR);
export const STATIC_DIR = path.join(WORKING_DIR, 'static');
export const UPLOAD_DIR = path.join(WORKING_DIR, 'uploads');

console.log('WORKING_DIR', WORKING_DIR);
console.log('STATIC_DIR', STATIC_DIR);
console.log('UPLOAD_DIR', UPLOAD_DIR);

export const TOKEN_TTL = 365 * 24 * 60 * 60;
export const VERIFY_CODE_LENGTH = 32;
export const VERIRY_CODE_TTL = 365 * 24 * 60 * 60;

// Email config
export const EMAIL_API_KEY = '';
export const EMAIL_API_URL = '';
export const EMAIL_SENDER = '';

export enum SortType {
    ASC = 'asc',
    DESC = 'desc',
}

export enum SocialAccountType {
    Zalo = 'zalo',
    Facebook = 'facebook',
}

export const DATE_FORMAT = 'DD/MM/YYYY';

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum Language {
    VIETNAMESE = 'vi',
    ENGLISH = 'en',
}

export enum Theme {
    DARK = 'dark',
    LIGHT = 'light',
}

export const LIMIT_PAGING = 24;

export const firebaseConfig: ServiceAccount = require('./firebase-adminsdk.json');
