import _ from 'lodash';
import crypto from 'crypto';
import { PASSWORD_SCERET_KEY } from '../config';
const CHARACTERS = '01234defghijkl56789NOPQRSTUVWXYZabcmnoABCDEFGHIJKLMpqrstuvwxyz';

export type EncodeCompressionLevel = 0 | 1 | 2;

export function castToBoolean(value: string) {
    return /true/i.test(value);
}

export function randomPassword(length: number) {
    return [...new Array(length)].map(() => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]).join('');
}

export function generateRandomStringNumber(length: number) {
    let numberString = '';
    for (let i = 0; i < length; i++) {
        numberString += Math.floor(Math.random() * 10);
    }
    return numberString;
}

export function encodeObjectId(objectId: string, compressLevel: EncodeCompressionLevel = 0) {
    let blocks = [];
    if (compressLevel == 1) {
        blocks = [parseInt(objectId.slice(8, 16), 16), parseInt(objectId.slice(16), 16)];
    } else if (compressLevel == 2) {
        blocks = [parseInt(objectId.slice(18), 16)];
        if (Math.random() > 0.5) {
            blocks = [...blocks, Math.floor(Math.random() * 128)];
        } else {
            blocks = [Math.floor(Math.random() * 128), ...blocks];
        }
    } else {
        blocks = [parseInt(objectId.slice(0, 12), 16), parseInt(objectId.slice(12), 16)];
    }

    return blocks
        .map(n => {
            let bundleSlug = '';
            while (n > 0) {
                bundleSlug += CHARACTERS[n % 62];
                n = Math.floor(n / 62);
            }
            return bundleSlug;
        })
        .join('');
}

export function hashingPassword(password: string) {
    let hashedPassword = PASSWORD_SCERET_KEY + password;
    return crypto.createHash('sha256')
        .update(hashedPassword)
        .digest('hex');
}