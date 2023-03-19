import { Router } from 'express';
import { inject, injectable } from 'inversify';
import _ from 'lodash';
import { Request, Response, ServiceType, PrivacyType } from '../types';
import { Controller } from './controller';

import { User } from '../models/user.model';
import { UserService, BundleService, MailService, AuthService } from '../services';
import { ObjectID, ObjectId } from 'mongodb';
import { EMAIL_SENDER, LIMIT_PAGING } from '../config';
import { Bundle } from '../models/bundle.model';

@injectable()
export class UserController extends Controller {
    public readonly router = Router();
    public readonly path = '/users';

    constructor(
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Bundle) private bundleService: BundleService,
        @inject(ServiceType.Mail) private mailService: MailService,
        @inject(ServiceType.Auth) private authService: AuthService,
    ) {
        super();

        this.router.all('*', this.authService.authenticate(false));

        // Sign up
        this.router.post('/', this.createUser.bind(this));
        this.router.post('/register_device', this.registerDevice.bind(this));

        this.router.get('/', this.getUsers.bind(this));
        this.router.get('/search', this.getByKeyword.bind(this));
        // this.router.get('/:username', this.getByUsername.bind(this));
        this.router.get('/:userId', this.getByUserId.bind(this));

        this.router.all('*', this.authService.authenticate());
        this.router.post('/device_token', this.matchUserWithDevice.bind(this));

        // this.router.post(
        //     '/verify-account-request',
        //     this.verifyAccountRequest.bind(this),
        // );
        // this.router.post('/verify-account', this.verifyAccount.bind(this));
        // this.router.get('/:userid/bundles', this.getBundles.bind(this));
        // this.router.get('/:userid/following', this.getFollowing.bind(this));
        // this.router.get('/:userid/followers', this.getFollower.bind(this));
    }

    public async shouldFilterData(req: Request) {
        const { userid } = req.params;
        const { userId: tokenUserId } = req.tokenMeta;
        const user = await this.userService.findOne({
            _id: ObjectID.createFromHexString(userid),
        });

        return !(tokenUserId && userid == tokenUserId.toHexString());
    }

    async createUser(req: Request, res: Response) {
        const user: User = _.pick(req.body, ['username', 'password']) as any;

        try {
            const createdUser = await this.userService.create(user);
            // await this.userService.verifyAccountRequest(createdUser.email);

            res.composer.success(createdUser._id);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async registerDevice(req: Request, res: Response) {
        try {
            const createdUser = await this.userService.registerNewDevice(req.body.token);
            // await this.userService.verifyAccountRequest(createdUser.email);

            res.composer.success(createdUser._id);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async matchUserWithDevice(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;
            console.log('Test match', req.body.tokenId);
            const createdUser = await this.userService.registerNewUserToDeviceToken(
                ObjectID.createFromHexString(req.body.tokenId),
                userId,
            );
            // await this.userService.verifyAccountRequest(createdUser.email);

            res.composer.success(createdUser);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async verifyAccountRequest(req: Request, res: Response) {
        const { email: rawEmail } = req.body;
        const email = _.trim(rawEmail).toLowerCase().toString();

        try {
            res.composer.success(await this.userService.verifyAccountRequest(email));
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async verifyAccount(req: Request, res: Response) {
        const { verifyAccountCode } = req.body;

        try {
            res.composer.success(await this.userService.verifyAccount(verifyAccountCode));
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            const users = await this.userService.find();
            res.composer.success(users);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getByUserId(req: Request, res: Response) {
        try {
            const userId = ObjectID.createFromHexString(req.params.userId);
            const user = (await this.userService.findOne({ _id: userId }, true)) as User;
            const result: any = {
                ..._.pick(user, [
                    '_id',
                    'profilePicture',
                    'name',
                    'role',
                    'address',
                    'description',
                ]),
            };
            res.composer.success(result);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async getByUsername(req: Request, res: Response) {
        const { username } = req.params;
        const { userId: tokenUserId } = req.tokenMeta;

        try {
            const user = await this.userService.findOne({ username });
            if (!user) {
                res.composer.notFound('User not found');
            }

            // if (!user.isPublishedProfile && !_.isEqual(tokenUserId, user._id)) {
            //     res.composer.notFound('User not published');
            //     return;
            // }

            // if (!user.isPublishedContact && !_.isEqual(tokenUserId, user._id)) {
            //     delete user.contact;
            // }

            // delete user.isPublishedProfile;
            // delete user.isPublishedContact;

            res.composer.success(user);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getByKeyword(req: Request, res: Response) {
        const { keyword } = req.query
        const { userId } = req.tokenMeta

        try {
            const users = (await this.userService.find({
                $text: { $search: keyword },
            })).filter((user: any) => !user._id.equals(userId));

            res.composer.success(users);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getBundles(req: Request, res: Response) {
        // const { startAfter } = req.query;
        // let { limit = LIMIT_PAGING } = req.query;
        // limit = Math.min(limit, LIMIT_PAGING);
        // const { userid } = req.params;
        // const queryCommand = {
        //     isDeleted: false,
        //     files: { $exists: true, $ne: <any>[] },
        //     user: ObjectID.createFromHexString(userid),
        //     privacy: PrivacyType.PUBLIC,
        //     ...(startAfter && { _id: { $lt: ObjectID.createFromHexString(startAfter) } }),
        // };
        // try {
        //     const bundles =
        //         await this.shouldFilterData(req)
        //             ? []
        //             : await this.bundleService.find(queryCommand, true, +limit);
        //     res.composer.success(bundles);
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }

    async getFollowing(req: Request, res: Response) {
        // const { userid } = req.params;
        // const user = await this.userService.findOne({
        //     _id: ObjectID.createFromHexString(userid),
        // });
        // try {
        //     const followingUsers = (await this.shouldFilterData(req))
        //         ? []
        //         : await this.userService.find({ _id: { $in: user.following } });
        //     res.composer.success(followingUsers);
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }

    async getFollower(req: Request, res: Response) {
        // const { userid } = req.params;
        // const user = await this.userService.findOne({
        //     _id: ObjectID.createFromHexString(userid),
        // });
        // try {
        //     const followingUsers = (await this.shouldFilterData(req))
        //         ? []
        //         : await this.userService.find({ _id: { $in: user.followers } });
        //     res.composer.success(followingUsers);
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }
}
