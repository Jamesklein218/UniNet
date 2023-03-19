import { injectable, inject } from 'inversify';
import { Collection, ObjectID, ObjectId } from 'mongodb';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import moment from 'moment';

import { DatabaseService } from './database.service';
import { User, Role, fillDefaultUserValue, USER_FORBIDDEN_FIELDS } from '../models/user.model';
import { DeviceToken } from '../models/device_token.model';

import { ErrorUserInvalid } from '../lib/errors';
import {
    HASH_ROUNDS,
    SocialAccountType,
    VERIRY_CODE_TTL,
    VERIFY_CODE_LENGTH,
    EMAIL_SENDER,
} from '../config';
import { BundleService } from './bundle.service';
import { ServiceType } from '../types';
import { MailService } from '.';

const USER_CREATE_ALLOW_FIELDS = ['password', 'email', 'username', 'firstName', 'lastName'];

@injectable()
export class UserService {
    private userCollection: Collection;
    private deviceTokenCollection: Collection;

    constructor(
        @inject(ServiceType.Database) private dbService: DatabaseService,
        @inject(ServiceType.Bundle) private bundleService: BundleService,
        @inject(ServiceType.Mail) private mailService: MailService,
    ) {
        this.userCollection = this.dbService.db.collection('users');
        this.deviceTokenCollection = this.dbService.db.collection('device_token');

        this.setupIndexes();
    }

    private async setupIndexes() {
        this.userCollection.createIndex('email', { unique: true });
        this.userCollection.createIndex('username', { unique: true });
        this.userCollection.createIndex({
            name: 'text',
            username: 'text',
        });
    }

    async registerNewDevice(token: string): Promise<DeviceToken> {
        let deviceToken: DeviceToken = {
            token: token,
            createdAt: Date.now(),
        };
        const addedDeviceToken = await this.deviceTokenCollection.insertOne(deviceToken);

        return addedDeviceToken.ops[0] as DeviceToken;
    }

    async registerNewUserToDeviceToken(tokenId: ObjectID, userId: ObjectID) {
        const opUpdateResult = await this.deviceTokenCollection.updateOne(
            { _id: tokenId },
            {
                $set: {
                    userId: userId,
                },
            },
        );

        return opUpdateResult.result.nModified;
    }

    async create(user: any): Promise<User> {
        if (_.isEmpty(user.password) || _.isEmpty(user.username)) {
            throw new ErrorUserInvalid('Missing input fields');
        }

        user.password = await bcrypt.hash(user.password, HASH_ROUNDS);
        const addedUser = await this.userCollection.insertOne(fillDefaultUserValue(user as User));

        return addedUser.ops[0] as User;
    }

    async checkRole(userId: ObjectID, role: Role) {
        const user = (await this.userCollection.findOne({ _id: userId })) as User;
        return user.role.includes(role);
    }

    async verifyAccountRequest(email: string) {
        let user = null;
        try {
            user = await this.findOne({ email }, true);
        } catch (err) {
            throw new Error(`The email address that you've entered doesn't match any account.`);
        }

        const verifyAccountCode = crypto.randomBytes(VERIFY_CODE_LENGTH).toString('hex');
        await this.updateOne(user._id, { verifyAccountCode });

        return this.mailService.send(
            EMAIL_SENDER,
            email,
            'Verify your account email address',
            `Hello Bugdy,
    
Click on the following link to verify your account email address:
https://www.bugs.vn/auth/verify-account?verifyAccountCode=${verifyAccountCode}

Thanks!
- Team BUGS -`,
        );
    }

    async verifyAccount(verifyAccountCode: string) {
        let user = null;
        try {
            user = await this.findOne({ verifyAccountCode }, true);
        } catch (err) {
            throw new Error(`The email address that you've entered doesn't match any account.`);
        }

        await this.updateOne(user._id, {
            verifyAccountCode: '',
            isVerified: true,
        });
    }

    createSocial(type: SocialAccountType, socialData: any) {
        // const {
        //     id: socialId,
        //     name = '',
        //     email,
        //     first_name,
        //     last_name,
        // } = socialData;
        // const nameInWords = name.split(' ');
        // const userData: User = {
        //     email: `1${type[0]}${socialId}@bugs.vn`,
        //     password: randomPassword(16),
        //     profile: {
        //         firstName: _.isEmpty(first_name)
        //             ? nameInWords.pop()
        //             : first_name,
        //         lastName: _.isEmpty(last_name)
        //             ? nameInWords.join(' ')
        //             : last_name,
        //     },
        //     contact: {
        //         email,
        //     },
        //     isVerified: true,
        //     social: {},
        // };
        // userData.social[type] = socialData;
        // return this.create(userData);
    }

    async find(query: any = {}) {
        const users = await this.userCollection.find(query).toArray();
        return users.map((user) => _.omit(user, USER_FORBIDDEN_FIELDS));
    }

    async findOne(query: any = {}, keepAll = false): Promise<User> {
        const user = (await this.userCollection.findOne(query)) as User;

        if (_.isEmpty(user)) throw new ErrorUserInvalid('User not found');
        return keepAll ? user : (_.omit(user, USER_FORBIDDEN_FIELDS) as User);
    }

    // async findByKeyword(keyword: string): {
    //     const users = await this.userCollection.find(query).toArray();
    //     return users.map((user) => _.omit(user, USER_FORBIDDEN_FIELDS));
    // }

    async updateOne(userId: ObjectID, data: any) {
        return await this.userCollection.findOneAndUpdate({ _id: userId }, { $set: data });
    }

    async pushOne(userId: ObjectID, data: any) {
        return await this.userCollection.findOneAndUpdate(
            { _id: userId },
            { $push: data }
        )
    }
    
    async pullOne(userId: ObjectID, data: any) {
        return await this.userCollection.findOneAndUpdate(
            { _id: userId },
            { $pull: data }
        )
    }

    async updateEventParticipated(userId: ObjectID, eventId: ObjectID, data: any) {
        await this.userCollection.updateOne(
            { _id: userId, 'eventParticipated.eventId': eventId },
            {
                $set: {
                    'eventParticipated.$.socialDay': data.socialDay,
                    'eventParticipated.$.firstCheck': data.firstCheck,
                    'eventParticipated.$.secondCheck': data.secondCheck,
                },
            },
        );
    }

    async addCreatedEvent(userId: ObjectID, eventId: ObjectID): Promise<void> {
        await this.userCollection.updateOne({ _id: userId }, { $push: { eventCreated: eventId } });
    }

    async removeCreatedEvent(userId: ObjectID, eventId: ObjectID): Promise<void> {
        await this.userCollection.updateOne({ _id: userId }, { $pull: { eventCreated: eventId } });
    }

    async addVerifiedEvent(userId: ObjectID, eventId: ObjectID): Promise<void> {
        await this.userCollection.updateOne({ _id: userId }, { $push: { eventVerified: eventId } });
    }

    private populateEventParticipated(aggreateCommand: any) {
        return _.concat(aggreateCommand, [
            {
                $unwind: {
                    path: '$eventParticipated',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'eventParticipated.eventId',
                    foreignField: '_id',
                    as: 'eventParticipated.eventInfo',
                },
            },
            {
                $unwind: {
                    path: '$eventParticipated.eventInfo',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    root: { $mergeObjects: '$$ROOT' },
                    eventParticipated: { $push: '$eventParticipated' },
                },
            },
            { $replaceRoot: { newRoot: { $mergeObjects: ['$root', '$$ROOT'] } } },
            { $project: { root: 0 } },
            {
                $set: {
                    eventParticipated: {
                        $cond: [
                            { $eq: [{ $anyElementTrue: ['$eventParticipated.eventId'] }, true] },
                            '$eventParticipated',
                            [],
                        ],
                    },
                },
            },
        ]);
    }

    async findUser(query: any = {}, populateEventParticipated = true): Promise<User[]> {
        let aggreateCommand: any[] = [{ $match: query }];
        if (populateEventParticipated)
            aggreateCommand = this.populateEventParticipated(aggreateCommand);
        const users = await this.userCollection.aggregate(aggreateCommand).toArray();
        return users as User[];
    }

    async checkEventOfUser(userId: ObjectID, eventId: ObjectID): Promise<boolean> {
        const user = await this.userCollection.findOne({
            _id: userId,
            'eventParticipated.eventId': { $in: [eventId] },
        });
        return user != null;
    }

    // async isCreator(userId: ObjectID) {
    //     const user = (await this.userCollection.findOne({
    //         _id: userId,
    //     })) as User;
    //     return user.role.includes(Role.Creator);
    // }

    // async isReporter(userId: ObjectID) {
    //     const user = (await this.userCollection.findOne({
    //         _id: userId,
    //     })) as User;
    //     return user.role.includes(Role.Reporter);
    // }

    // async isCensor(userId: ObjectID) {
    //     const user = (await this.userCollection.findOne({
    //         _id: userId,
    //     })) as User;
    //     return user.role.includes(Role.Censor);
    // }

    async increase(userId: ObjectID, field: string, value: number) {
        const opUpdateResult = await this.userCollection.updateOne(
            { _id: userId },
            { $inc: { [field]: value } },
        );
        return opUpdateResult.result.nModified;
    }

    async changePassword(userId: ObjectID, currentPassword: string, newPassword: string) {
        const user = await this.userCollection.findOne({ _id: userId });

        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            throw new Error(`Current password is incorrect`);
        }

        newPassword = await bcrypt.hash(newPassword, HASH_ROUNDS);
        const opUpdateResult = await this.userCollection.updateOne(
            { _id: userId },
            { $set: { password: newPassword } },
        );
        return opUpdateResult.result.nModified;
    }

    async registerEvent(userId: ObjectID, eventData: any): Promise<void> {
        await this.userCollection.updateOne(
            { _id: userId },
            { $push: { eventParticipated: eventData } },
        );
    }

    async unregisterEvent(userId: ObjectID, eventId: ObjectID): Promise<void> {
        await this.userCollection.updateOne(
            { _id: userId },
            { $pull: { eventParticipated: { eventId: eventId } } },
        );
    }

    async follow(userId: ObjectID, followedId: ObjectID) {
        if (userId === followedId) throw new Error('Followed user same as user excute.');
        const followedUser = await this.userCollection.findOne({
            _id: followedId,
        });
        if (!followedUser) throw new Error('Followed User Not Found');

        const promises: Array<Promise<any>> = [];

        promises.push(
            this.userCollection.updateOne(
                { _id: userId, following: { $nin: [followedId] } },
                {
                    $push: { following: followedId },
                    $inc: { followingCount: 1 },
                },
            ),
        );

        promises.push(
            this.userCollection.updateOne(
                { _id: followedId, followers: { $nin: [userId] } },
                {
                    $push: { followers: userId },
                    $inc: { followerCount: 1 },
                },
            ),
        );

        const results = await Promise.all(promises);
        return results[0].result.nModified;
    }

    async unfollow(userId: ObjectID, followedId: ObjectID) {
        if (userId === followedId) throw new Error('Followed user same as user excute.');
        // const followedUser = await this.userCollection.findOne({ _id: followedId });
        // if (!followedUser) throw new Error('Followed User Not Found');

        const promises: Array<Promise<any>> = [];

        promises.push(
            this.userCollection.updateOne(
                { _id: userId, following: { $in: [followedId] } },
                {
                    $pull: { following: followedId },
                    $inc: { followingCount: -1 },
                },
            ),
        );

        promises.push(
            this.userCollection.updateOne(
                { _id: followedId, followers: { $in: [userId] } },
                {
                    $pull: { followers: userId },
                    $inc: { followerCount: -1 },
                },
            ),
        );

        const results = await Promise.all(promises);
        return results[0].result.nModified;
    }

    async saveBundle(userId: ObjectId, bundleId: ObjectId) {
        // Validate bundle
        const bundleCount = await this.bundleService.count({ _id: bundleId });
        if (bundleCount != 1) throw new Error('Invalid bundle id');

        const updateResult = await this.userCollection.updateOne(
            { _id: userId, savedBundles: { $nin: [bundleId] } },
            {
                $push: { savedBundles: bundleId },
            },
        );

        if (updateResult.result.nModified != 1) throw new Error('Bundle already saved');
        return true;
    }

    async unsaveBundle(userId: ObjectId, bundleId: ObjectId) {
        const updateResult = await this.userCollection.updateOne(
            { _id: userId, savedBundles: { $in: [bundleId] } },
            {
                $pull: { savedBundles: bundleId },
            },
        );

        if (updateResult.result.nModified != 1)
            throw new Error('Bundle not exist / already deleted');
        return true;
    }
}
