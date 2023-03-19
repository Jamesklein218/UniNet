import { ObjectID } from 'mongodb';
import { User } from './user.model';
import { PrivacyType } from '../types';

export enum FileType {
    NOTE = 'note',
    CODE = 'code',
}

export enum BundlePrivacy {
    PUBLIC = 'public',
    PROTECTED = 'protected',
    PRIVATE = 'private',
}

export interface File {
    readonly _id?: ObjectID;
    readonly slug?: string;
    type: FileType;
    language: string;
    name: string;
    content: string;
    description: string;
    createdAt: number;
    isDeleted: boolean;
    // isPublished: boolean;
    isLocked: boolean;
    bundle?: ObjectID;
}

export interface Bundle {
    readonly _id?: ObjectID;
    slug?: string;
    name: string;
    description: string;
    privacy: PrivacyType;
    user: User | ObjectID;
    pin: string;
    files: File[] | ObjectID[];
    createdAt: number;
    isDeleted: boolean;
    likes: { user: ObjectID; createdAt: number; ip: string }[];
    views: { user: ObjectID; createdAt: number; ip: string }[];
}

export function fillDefaultFileValue(file: File): File {
    return {
        type: FileType.CODE,
        language: '',
        name: 'Untitled',
        content: '',
        description: '',
        createdAt: Date.now(),
        isDeleted: false,
        // isPublished: true,
        isLocked: false,
        ...file,
    };
}

export function fillDefaultBundleValue(bundle: Bundle): Bundle {
    return {
        name: '',
        description: '',
        privacy: BundlePrivacy.PUBLIC,
        pin: '',
        files: [],
        createdAt: Date.now(),
        isDeleted: false,
        likes: [],
        views: [],
        ...bundle,
    };
}

export const BUNDLE_KEYS = Object.keys(fillDefaultBundleValue(null));
export const FILE_KEYS = Object.keys(fillDefaultFileValue(null));
