import { ObjectID } from 'mongodb';
import _ from 'lodash';

export interface Token {
    _id?: ObjectID;
    userId: ObjectID;
    createdAt: number;
    expiredAt: number;

    userAgent: string;
}

export interface TokenMeta {
    _id: ObjectID;
    userId: ObjectID;
    createdAt: number;
    expiredAt: number;
}

export function generateTokenMetadata(token: Token): TokenMeta {
    const { _id, userId, createdAt, expiredAt } = token;
    return {
        _id,
        userId,
        createdAt,
        expiredAt,
    };
}

export function parseTokenMeta(tokenMeta: any): TokenMeta {
    return {
        ...tokenMeta,
        _id: ObjectID.createFromHexString(tokenMeta._id),
        userId: ObjectID.createFromHexString(tokenMeta.userId),
    };
}
