import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { Request, Response, ServiceType, PrivacyType, HttpMethod } from '../types';
import { Controller } from './controller';
import {
    UserService,
    EventService,
    AuthService,
    UploadService,
    BundleService,
    PracticeReportService,
    NotificationService,
} from '../services';
import { VerifiedState } from '../models/event.model';
import { User, Role } from '../models/user.model';
import _ from 'lodash';
import { ObjectID } from 'mongodb';
import { ErrorInvalidData } from '../lib/errors';

@injectable()
export class MeController extends Controller {
    public readonly router = Router();
    public readonly path = '/me';

    constructor(
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.Event) private eventService: EventService,
        @inject(ServiceType.Upload) private uploadService: UploadService,
        @inject(ServiceType.Notification) private notiService: NotificationService,
        @inject(ServiceType.PracticeReport) private practiceReportService: PracticeReportService,
    ) {
        super();

        this.router.all('*', this.authService.authenticate());

        this.router.get('/', this.getProfile.bind(this));
        this.router.patch('/profile', this.updateProfile.bind(this));
        this.router.post('/change-password', this.changePassword.bind(this));
        this.router.post('/profile/picture', this.updateProfilePicture.bind(this));

        this.router.get('/report-answers', this.getReportAnswers.bind(this));
        this.router.get('/event', this.getEvents.bind(this));
        this.router.get('/notification', this.getNotifications.bind(this));
        this.router.get('/created-event', this.getCreatedEvent.bind(this));
        this.router.get('/participated-event', this.getEventParticipated.bind(this));
        this.router.get('/verified-event', this.getVerifiedEvent.bind(this));

        // this.router.get('/bundles', this.getBundles.bind(this));
        // this.router.get('/bundles/discover', this.discoverBundles.bind(this));
        // this.router.get('/following', this.getFollowing.bind(this));
        // this.router.get('/followers', this.getFollower.bind(this));
        // this.router.get('/saved', this.getSavedBundles.bind(this));
        // this.router.post('/follow/:followedid', this.follow.bind(this));
        // this.router.delete('/follow/:followedid', this.unfollow.bind(this));
        // this.router.post('/save/:bundleId', this.saveBundle.bind(this));
        // this.router.delete('/save/:bundleId', this.saveBundle.bind(this));
    }

    async getProfile(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        try {
            const user = await this.userService.findOne({ _id: userId });
            res.composer.success(user);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getBundles(req: Request, res: Response) {
        // const { startAfter } = req.query;
        // let { limit = LIMIT_PAGING } = req.query;
        // limit = Math.min(limit, LIMIT_PAGING);
        // const { userId } = req.tokenMeta;
        // const queryCommand = {
        //     isDeleted: false,
        //     files: { $exists: true, $ne: <any>[] },
        //     user: userId,
        //     ...(startAfter && { _id: { $lt: ObjectID.createFromHexString(startAfter) } }),
        // };
        // try {
        //     const bundles = await this.bundleService.find(queryCommand, true, +limit);
        //     res.composer.success(bundles);
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }

    async discoverBundles(req: Request, res: Response) {
        // const { limit = 10, startAfter } = req.query;
        // const { userId } = req.tokenMeta;
        // const user = await this.userService.findOne({ _id: userId });
        // const queryCommand = {
        //     isDeleted: false,
        //     privacy: PrivacyType.PUBLIC,
        //     files: { $exists: true, $ne: <any>[] },
        //     user: { $in: user.following },
        //     ...(startAfter && { _id: { $lt: ObjectID.createFromHexString(startAfter) } }),
        // };
        // try {
        //     const bundles = await this.bundleService.find(queryCommand, true, +limit);
        //     res.composer.success(bundles);
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }

    async getFollowing(req: Request, res: Response) {
        // const { userId } = req.tokenMeta;
        // const user = await this.userService.findOne({ _id: userId });
        // try {
        //     const followingUsers = await this.userService.find({
        //         _id: { $in: user.following },
        //     });
        //     res.composer.success(followingUsers);
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }

    async getFollower(req: Request, res: Response) {
        // const { userId } = req.tokenMeta;
        // const user = await this.userService.findOne({ _id: userId });
        // try {
        //     const followingUsers = await this.userService.find({
        //         _id: { $in: user.followers },
        //     });
        //     res.composer.success(followingUsers);
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }

    async updateProfile(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        const PROFILE_KEYS = [
            'email',
            'phone',
            'name',
            'address',
            'description',
            'firstName',
            'lastName',
            'dob',
            'gender',
            "classId",
            "major",
            "studentId"
        ];
        const userData = _.pick(req.body, PROFILE_KEYS);

        try {
            if (_.isEmpty(userData)) throw new Error(`Field name must be ${PROFILE_KEYS}`);
            const updateCommand = _.mapKeys(userData, (v: any, k: any) => `${k}`);

            const affectedCount = await this.userService.updateOne(userId, updateCommand);
            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async changePassword(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        const { currentPassword, newPassword } = req.body;
        try {
            if (currentPassword === newPassword) {
                throw new ErrorInvalidData(`Old and new passwords cannot match`)
            }
            const affectedCount = await this.userService.changePassword(
                userId,
                currentPassword,
                newPassword,
            );
            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async follow(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        const followedID = ObjectID.createFromHexString(req.params.followedid);
        try {
            const affectedCount = await this.userService.follow(userId, followedID);
            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getNotifications(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        try {
            const notifications = await this.notiService.find({ toUser: userId });
            res.composer.success(notifications);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async unfollow(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        const followedID = ObjectID.createFromHexString(req.params.followedid);
        try {
            const affectedCount = await this.userService.unfollow(userId, followedID);
            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async updateProfilePicture(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;

            const uploadedPath = await this.uploadService.handleImageUpload(req);
            const affectedCount = await this.userService.updateOne(userId, {
                profilePicture: uploadedPath,
            });

            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getReportAnswers(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        try {
            const answers = await this.practiceReportService.findAnswerByUserId({
                userCreated: userId,
            });
            res.composer.success(answers);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getEvents(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        try {
            // const userInfo = (await this.userService.findUser({ _id: userId }))[0] as any;
            // res.composer.success(userInfo.eventParticipated);
            const events = await this.eventService.findEvents(
                {
                    $or: [
                        { userCreated: userId },
                        { 'participant.userId': userId },
                        { verifiedBy: userId },
                    ],
                    verifyStatus: VerifiedState.successful,
                },
                false,
                true,
                false,
            );
            for (let i = 0; i < events.length; i++) {
                const event = events[i] as any;
                const userInfoInEvent = event.participant.find((obj: any) => {
                    return obj.userId.equals(userId);
                });
                if (!userInfoInEvent) {
                    event['roleName'] = 'Creator';
                    event['socialDay'] = 0;
                } else {
                    event['roleName'] = userInfoInEvent.roleName;
                    event['socialDay'] = userInfoInEvent.socialDay;
                }
                events[i] = event;
            }
            res.composer.success(events);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getEventParticipated(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        try {
            const events = await this.eventService.findEvents(
                { 'participant.userId': userId },
                false,
                true,
                false,
            );
            for (let i = 0; i < events.length; i++) {
                const event = events[i] as any;
                const userInfoInEvent = event.participant.find((obj: any) => {
                    return obj.userId.equals(userId);
                });
                if (!userInfoInEvent) {
                    event['roleName'] = 'Creator';
                    event['socialDay'] = 0;
                } else {
                    event['roleName'] = userInfoInEvent.roleName;
                    event['socialDay'] = userInfoInEvent.socialDay;
                }
                events[i] = event;
            }
            res.composer.success(events);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    // For Role Creator
    async getCreatedEvent(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        const isCreator = await this.userService.checkRole(userId, Role.Creator);
        if (!isCreator) {
            res.composer.notAllowed('Must be Creator');
            return;
        }
        try {
            const events = await this.eventService.findEvents(
                { userCreated: userId },
                false,
                true,
                false,
            );
            res.composer.success(events);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    // For Role Censor
    async getVerifiedEvent(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        const isCensor = await this.userService.checkRole(userId, Role.Censor);
        if (!isCensor) {
            res.composer.notAllowed('Must be Censor');
            return;
        }
        try {
            const events = await this.eventService.findEvents(
                { verifiedBy: userId },
                false,
                true,
                false,
            );
            res.composer.success(events);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async saveBundle(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        const bundleId = ObjectID.createFromHexString(req.params.bundleId);

        try {
            let isSuccess = false;

            switch (req.method) {
                case HttpMethod.POST:
                    isSuccess = await this.userService.saveBundle(userId, bundleId);
                    break;
                case HttpMethod.DELETE:
                    isSuccess = await this.userService.unsaveBundle(userId, bundleId);
                    break;
                default:
                    throw new Error('Invalid HTTP method');
            }

            res.composer.success(isSuccess);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getSavedBundles(req: Request, res: Response) {
        // const { userId } = req.tokenMeta;
        // try {
        //     const user = await this.userService.findOne({ _id: userId }, true);
        //     const bundles = await this.bundleService.find(
        //         { _id: { $in: user.savedBundles } },
        //         true,
        //     );
        //     res.composer.success(bundles);
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }
}
