import { Router } from 'express';
import { inject, injectable } from 'inversify';
import _ from 'lodash';
import { Request, Response, ServiceType, PrivacyType } from '../types';
import { Controller } from './controller';
import { BundleService, AuthService } from '../services';
import {
    Bundle,
    BundlePrivacy,
    BUNDLE_KEYS,
    FILE_KEYS,
} from '../models/bundle.model';
import { ObjectID } from 'mongodb';
import { User } from '../models/user.model';
import { read } from 'fs-extra';
import AdmZip from 'adm-zip';
import requestIp from 'request-ip';
import { LIMIT_PAGING } from '../config';

@injectable()
export class BundleController extends Controller {
    public readonly router = Router();
    public readonly path = '/bundles';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.Bundle) private bundleService: BundleService,
    ) {
        super();

        this.router.get(
            '/:slug',
            this.authService.authenticate(false),
            this.getBundleBySlug.bind(this),
        );
        this.router.get('/', this.getBundles.bind(this));

        // Force authenticate all routes
        this.router.all('*', this.authService.authenticate());

        // Config child routes
        this.router.post('/', this.createBundle.bind(this));
        this.router.post('/:bundleId/file', this.createFile.bind(this));
        this.router.post('/:bundleId/sort', this.sortFiles.bind(this));

        this.router.post('/:bundleId/like', this.likeBundle.bind(this));
        this.router.post('/:bundleId/unlike', this.unlikeBundle.bind(this));

        this.router.post('/protected', this.getProtectedBundle.bind(this));
        // this.router.get('/download/file/:fileId', this.downloadFile.bind(this));
        // this.router.get('/download/bundle/:bundleId', this.downloadBundle.bind(this));

        this.router.patch(
            '/:bundleId/file/:fileId',
            this.updateFile.bind(this),
        );
        this.router.patch('/:bundleId', this.updateBundle.bind(this));

        this.router.put('/:bundleId', this.changeBundlePrivacy.bind(this));

        this.router.delete(
            '/:bundleId/file/:fileId',
            this.deleteFile.bind(this),
        );
        this.router.delete('/:bundleId', this.deleteBundle.bind(this));
    }

    async sortFiles(req: Request, res: Response) {
        try {
            const { bundleId } = req.params;
            const { files } = req.body;
            const { userId } = req.tokenMeta;

            await this.bundleService.validateBundle(
                ObjectID.createFromHexString(bundleId),
                userId,
            );

            const sortedBundle = await this.bundleService.sortFiles(
                ObjectID.createFromHexString(bundleId),
                files,
            );

            res.composer.success(sortedBundle);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async createBundle(req: Request, res: Response) {
        try {
            const createdSlug = await this.bundleService.create(
                req.tokenMeta.userId,
            );
            res.composer.success(createdSlug);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async createFile(req: Request, res: Response) {
        try {
            const bundleId = ObjectID.createFromHexString(req.params.bundleId);
            await this.bundleService.validateBundle(
                bundleId,
                req.tokenMeta.userId,
            );

            const position = +req.body.position;
            const addedFile = await this.bundleService.createFile(
                bundleId,
                position,
            );
            res.composer.success(addedFile);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async likeBundle(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;
            const bundleId = ObjectID.createFromHexString(req.params.bundleId);

            const clientIp = requestIp.getClientIp(req);

            const likeBundle = await this.bundleService.likeBundle(
                bundleId,
                userId,
                clientIp,
            );
            res.composer.success(likeBundle);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async unlikeBundle(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;
            const bundleId = ObjectID.createFromHexString(req.params.bundleId);

            const unlikeBundle = await this.bundleService.unlikeBundle(
                bundleId,
                userId,
            );
            res.composer.success(unlikeBundle);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async updateBundle(req: Request, res: Response) {
        try {
            const bundleId = ObjectID.createFromHexString(req.params.bundleId);
            await this.bundleService.validateBundle(
                bundleId,
                req.tokenMeta.userId,
            );
            const affectedCount = await this.bundleService.update(
                bundleId,
                _.pick(req.body, ['name', 'description']),
            );

            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async changeBundlePrivacy(req: Request, res: Response) {
        try {
            const bundleId = ObjectID.createFromHexString(req.params.bundleId);
            await this.bundleService.validateBundle(
                bundleId,
                req.tokenMeta.userId,
            );
            const { privacy } = req.query;
            const { pin } = req.body;

            switch (privacy) {
                case PrivacyType.PROTECTED: {
                    if (_.isEmpty(pin) || _.size(pin) != 4)
                        throw new Error('PIN must be 4 character');
                }
                case PrivacyType.PUBLIC:
                case PrivacyType.PRIVATE:
                    {
                        const affectedCount = await this.bundleService.update(
                            bundleId,
                            {
                                privacy,
                                pin,
                            },
                        );
                        res.composer.success(affectedCount);
                    }
                    break;
                default:
                    throw new Error(
                        'Invalid privacy. Must be public / protected / private',
                    );
            }
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async updateFile(req: Request, res: Response) {
        try {
            const bundleId = ObjectID.createFromHexString(req.params.bundleId);
            await this.bundleService.validateBundle(
                bundleId,
                req.tokenMeta.userId,
            );

            const fileId = ObjectID.createFromHexString(req.params.fileId);
            const affectedCount = await this.bundleService.updateFile(
                fileId,
                _.pick(req.body, [
                    'name',
                    'content',
                    'type',
                    'description',
                    'isLocked',
                    'isPublished',
                ]),
            );

            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async deleteFile(req: Request, res: Response) {
        try {
            const bundleId = ObjectID.createFromHexString(req.params.bundleId);
            await this.bundleService.validateBundle(
                bundleId,
                req.tokenMeta.userId,
            );

            const fileId = ObjectID.createFromHexString(req.params.fileId);
            const affectedCount = await this.bundleService.deleteFile(
                bundleId,
                fileId,
            );

            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async deleteBundle(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;

            const bundleId = ObjectID.createFromHexString(req.params.bundleId);
            await this.bundleService.validateBundle(bundleId, userId);
            const affectedCount = await this.bundleService.delete(bundleId);
            this.bundleService.updateBundleCount(userId);

            if (affectedCount == 0) throw new Error('Bundle already deleted');

            res.composer.success(bundleId);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getBundles(req: Request, res: Response) {
        // const { startAfter } = req.query;
        // let { limit = LIMIT_PAGING } = req.query;
        // limit = Math.min(limit, LIMIT_PAGING);
        // const queryCommand = {
        //     privacy: BundlePrivacy.PUBLIC,
        //     isDeleted: false,
        //     files: { $exists: true, $ne: <any>[] },
        //     ...(startAfter && { _id: { $lt: ObjectID.createFromHexString(startAfter) } }),
        // };
        // try {
        //     const bundles = await this.bundleService.find(queryCommand, true, +limit, true);
        //     res.composer.success(
        //         bundles
        //             .filter((bundle: Bundle) => !(bundle.user as User).isPublishedProfile)
        //     );
        // } catch (error) {
        //     res.composer.badRequest(error.message);
        // }
    }

    async getBundleBySlug(req: Request, res: Response) {
        const { slug } = req.params;

        const queryCommand = {
            slug,
            isDeleted: false,
            files: { $exists: true, $ne: <any>[] },
        };

        try {
            const bundle = (
                await this.bundleService.find(queryCommand, true, 1)
            )[0];

            if (!bundle) {
                res.composer.notFound(`Bundle ${slug} unavailable`);
                return;
            }

            if (
                bundle.privacy != PrivacyType.PUBLIC &&
                !_.isEqual(req.tokenMeta.userId, (bundle.user as User)._id)
            ) {
                switch (bundle.privacy) {
                    case PrivacyType.PRIVATE:
                        res.composer.notAllowed();
                        break;
                    case PrivacyType.PROTECTED:
                        res.composer.locked();
                        break;
                }
                return;
            }

            if (req.tokenMeta.userId) {
                const clientIp = requestIp.getClientIp(req);
                await this.bundleService.viewBundle(
                    bundle._id,
                    req.tokenMeta.userId,
                    clientIp,
                );
            }

            res.composer.success(bundle);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getProtectedBundle(req: Request, res: Response) {
        const { slug, pin } = req.body;

        const queryCommand = {
            slug,
            pin,
            isDeleted: false,
            files: { $exists: true, $ne: <any>[] },
        };

        try {
            const bundle = (
                await this.bundleService.find(queryCommand, true, 1)
            )[0];

            if (!bundle) {
                res.composer.notFound(
                    `Bundle ${slug} unavailable / Incorrect PIN`,
                );
                return;
            }

            res.composer.success(bundle);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }
}
