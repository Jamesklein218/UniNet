import { injectable, inject } from 'inversify';
import crypto from 'crypto';
import passport from 'passport';
import {
    Strategy,
    ExtractJwt,
    StrategyOptions,
    VerifiedCallback,
} from 'passport-jwt';
import jwt from 'jwt-simple';
import { NextFunction } from 'express';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import { Collection, ObjectID, ObjectId } from 'mongodb';

import {
    JWT_SECRET,
    TOKEN_TTL,
    SocialAccountType,
    FE_ADDRESS,
    EMAIL_SENDER,
    HASH_ROUNDS,
} from '../config';
import { Request, Response, ServiceType } from '../types';
import { ErrorUserInvalid } from '../lib/errors';

import { DatabaseService } from './database.service';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import {
    Token,
    generateTokenMetadata,
    TokenMeta,
    parseTokenMeta,
} from '../models/token.model';
import { FacebookAPI } from '../apis/facebook';
import { ZaloZPI } from '../apis/zalo';
import { MailService } from '.';
import { lazyInject } from '../container';
import { hashingPassword } from '../lib/helper';

@injectable()
export class AuthService {
    private tokenCollection: Collection;

    @lazyInject(ServiceType.User) private userService: UserService;
    constructor(
        @inject(ServiceType.Database) private dbService: DatabaseService,
        @inject(ServiceType.Mail) private mailService: MailService,
    ) {
        console.log('[Auth Service] Construct');
        this.tokenCollection = this.dbService.db.collection('token');
    }

    applyMiddleware() {
        const options: StrategyOptions = {
            secretOrKey: JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        };
        const strategy = new Strategy(
            options,
            this.verifyAccountCode.bind(this),
        );
        passport.use(strategy);

        return passport.initialize();
    }

    async verifyAccountCode(payload: any, done: VerifiedCallback) {
        const tokenMeta = parseTokenMeta(payload);

        try {
            const token = await this.tokenCollection.findOne({
                _id: tokenMeta._id,
            });
            if (token) {
                return done(null, tokenMeta);
            }

            return done(null, false, 'Invalid token');
        } catch (error) {
            done(error, null);
        }
    }

    authenticate(block = true) {
        return (req: Request, res: Response, next: NextFunction) => {
            passport.authenticate('jwt', async (err: any, tokenMeta: any, info: any) => {
                req.tokenMeta = tokenMeta;
                if (block && _.isEmpty(tokenMeta)) {
                    res.composer.unauthorized();
                    return;
                }

                next();
            })(req, res, next);
        };
    }

    private async createToken(userId: ObjectID, userAgent: string) {
        const result = await this.tokenCollection.insertOne(<Token>{
            userId,
            createdAt: moment().unix(),
            expiredAt: moment().unix() + TOKEN_TTL,
            userAgent,
        });

        const createdToken = result.ops[0] as Token;

        return jwt.encode(generateTokenMetadata(createdToken), JWT_SECRET);
    }

    async generateTokenUsingUsername(
        username: string,
        password: string,
        userAgent: string,
    ) {
        const user = await this.userService.findOne({ username }, true);

        if (_.isEmpty(user)) {
            throw new ErrorUserInvalid('User not exist');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new ErrorUserInvalid('Password not match');
        }

        // if (!user.isVerified) throw new Error('User is not verified');

        return await this.createToken(user._id, userAgent);
    }

    async generateTokenUsingSocialAccount(
        type: SocialAccountType,
        accessToken: string,
        userAgent: string,
    ) {
        // Verify token
        let queryResponse = null;

        switch (type) {
            case SocialAccountType.Facebook:
                queryResponse = await FacebookAPI.queryUserData(accessToken);
                break;
            case SocialAccountType.Zalo:
                queryResponse = await ZaloZPI.queryUserData(accessToken);
                break;
            default:
                throw new Error('Invalid Social type');
        }

        const userData = queryResponse.data;

        console.log(`[${type}] User Data`, userData);
        const { id } = userData;

        if (_.isEmpty(id)) {
            throw new Error('Invalid id / Login error');
        }

        let userId = null;
        try {
            const user = await this.userService.findOne(
                { [`social.${type}.id`]: id },
                true,
            );
            userId = user._id;
        } catch (error) {
            console.log('[Social Login Error]');
            console.log('Create user record for Facebook');
            // userId = (await this.userService.createSocial(type, userData))._id;
        }

        return await this.createToken(userId, userAgent);
    }

    async recoverPasswordRequest(email: string) {
        let user = null;
        try {
            user = await this.userService.findOne({ email }, true);
        } catch (err) {
            throw new Error(
                `The email address that you've entered doesn't match any account.`,
            );
        }

        const recoverPasswordCode = crypto.randomBytes(20).toString('hex');

        await this.userService.updateOne(user._id, {
            recoverPasswordCode,
            recoverPasswordExpires: moment().add(2, 'hours').unix(),
        });

        const msgTitle = `Bugs account recovery link`;
        const msgContent = `Hello Bugdy,
    
We received a request to recover your password.
Click on the following link (existing in the 2 hours) to reset your password:
${FE_ADDRESS}auth/recover-password?recoverPasswordCode=${recoverPasswordCode}

Thanks!
- Team BUGS -`;

        await this.mailService.send(EMAIL_SENDER, email, msgTitle, msgContent);
    }

    async recoverPassword(recoverPasswordCode: string, newPassword: string) {
        let user = null;
        try {
            user = await this.userService.findOne(
                { recoverPasswordCode },
                true,
            );
        } catch (err) {
            throw new Error(
                `The email address that you've entered doesn't match any account.`,
            );
        }

        if (user.recoverPasswordCode != recoverPasswordCode)
            throw new Error(
                `The link you have followed has expired or invalid.`,
            );

        newPassword = await bcrypt.hash(newPassword, HASH_ROUNDS);

        await this.userService.updateOne(user._id, {
            password: newPassword,
            recoverPasswordCode: null,
            recoverPasswordExpires: 0,
        });

        await this.tokenCollection.remove({ userId: user._id });
    }

    // async generateTokenForZalo(accessToken: string, userAgent: string) {
    //     // Verify token
    //     const queryResponse = await ZaloZPI.queryUserData(accessToken);
    //     const userData = queryResponse.data;

    //     console.log('User Data', userData);
    //     const { id, name } = userData;

    //     if (_.isEmpty(id)) {
    //         throw new Error('Invalid id / Login error');
    //     }

    //     let user = await UserService.findOne({ social: { facebook: '', zalo: id, gmail: '' } });
    //     if (_.isEmpty(user)) {
    //         console.log('Create user record for Zalo');
    //         user = await UserService.createZalo(id, name);
    //     }

    //     const token = await TokenModel.create({ userId: user._id, userAgent });
    //     const payload = { id: user._id, tokenId: token.id };

    //     return jwt.encode(payload, JWT_SECRET);
    // }
}
