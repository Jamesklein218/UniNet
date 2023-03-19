import { injectable, inject } from 'inversify';
import { Collection, ObjectID, ObjectId } from 'mongodb';
import _ from 'lodash';

import {
    Bundle,
    File,
    BUNDLE_KEYS,
    FILE_KEYS,
    fillDefaultBundleValue,
    fillDefaultFileValue,
} from '../models/bundle.model';
import { ErrorBundleInvalid } from '../lib/errors';
import { encodeObjectId } from '../lib/helper';

import { DatabaseService } from './database.service';
import { UserService } from './user.service';
import { lazyInject } from '../container';
import { ServiceType } from '../types';
import {
    User,
    USER_FORBIDDEN_FIELDS,
    USER_SIMPLIFIED_FIELDS,
} from '../models/user.model';

@injectable()
export class BundleService {
    private bundleCollection: Collection;
    private fileCollection: Collection;

    @lazyInject(ServiceType.User) private userService: UserService;

    constructor(
        @inject(ServiceType.Database) private dbService: DatabaseService,
    ) {
        console.log('[Bundle service] Construct');
        this.bundleCollection = this.dbService.db.collection('bundles');
        this.fileCollection = this.dbService.db.collection('files');

        this.setupIndexes();
    }

    private async setupIndexes() {
        await Promise.all([
            this.bundleCollection.createIndex({ slug: 1 }),
            this.fileCollection.createIndex({ slug: 1 }),
        ]);
    }

    private populateUser(aggreateCommand: any) {
        return _.concat(aggreateCommand, [
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
        ]);
    }

    async updateBundleCount(userId: ObjectId) {
        // Update user bundle count
        return await this.userService.updateOne(userId, {
            bundleCount: await this.bundleCollection.countDocuments({
                user: userId,
                isDeleted: false,
                'files.0': { $exists: true },
            }),
        });
    }

    async sortFiles(bundleId: ObjectID, files: string[]) {
        const bundle = (await this.bundleCollection.findOne({
            _id: bundleId,
        })) as Bundle;

        // Validate 2 array
        if (
            !_.isEqual(
                _.sortBy(
                    (bundle.files as ObjectId[]).map((f: ObjectId) =>
                        f.toHexString(),
                    ),
                ),
                _.sortBy(files),
            )
        ) {
            throw new Error('Mismatch files in bundle');
        }

        const affectedRow = await this.update(bundleId, {
            files: files.map((f) => ObjectId.createFromHexString(f)),
        });
        if (affectedRow == 0)
            throw new Error('Unable to update bundle files / Nothing changed');

        return (await this.find({ _id: bundleId }, true, 1, false))[0];
    }

    async create(userId: ObjectId): Promise<Bundle> {
        const opBundleInsertResult = await this.bundleCollection.insertOne(
            fillDefaultBundleValue({ user: userId } as Bundle),
        );

        const createdBundleId = opBundleInsertResult.insertedId;

        // Update slug for bundle
        const bundleSlug = encodeObjectId(createdBundleId.toHexString(), 2);
        const affectedRow = await this.update(createdBundleId, {
            slug: bundleSlug,
        });
        if (affectedRow == 0) throw new Error('Unable to update bundle slug');

        const createdBundle = opBundleInsertResult.ops[0] as Bundle;
        createdBundle.files = [await this.createFile(createdBundle._id)];
        createdBundle.slug = bundleSlug;

        await this.updateBundleCount(userId);
        return createdBundle;
    }

    async update(bundleId: ObjectID, data: any) {
        const opUpdateResult = await this.bundleCollection.updateOne(
            { _id: bundleId },
            { $set: data },
        );
        return opUpdateResult.result.nModified;
    }

    async validateBundle(bundleId: ObjectId, userId: ObjectId) {
        const bundle = await this.bundleCollection.findOne({
            _id: bundleId,
            user: userId,
        });
        if (_.isEmpty(bundle)) throw new ErrorBundleInvalid('Bundle not found');

        return true;
    }

    async createFile(bundleId: ObjectId, position: number = -1) {
        const opFileInsertResult = await this.fileCollection.insertOne(
            fillDefaultFileValue({ bundle: bundleId } as File),
        );

        const insertedFile = opFileInsertResult.ops[0] as File;

        // Update slug for file
        const fileSlug = encodeObjectId(insertedFile._id.toHexString(), 2);
        const affectedRow = await this.updateFile(insertedFile._id, {
            slug: fileSlug,
        });

        if (affectedRow == 0) throw new Error("Unable to update file's slug");

        // Add new file to bundle
        const affectedBundle = await this.bundleCollection.updateOne(
            { _id: bundleId },
            {
                $push: {
                    files: {
                        $each: [insertedFile._id],
                        ...(position >= 0 && { $position: position }),
                    },
                },
            },
        );

        if (affectedBundle.modifiedCount == 0)
            throw new Error('Unable to add file to bundle');

        return { ...insertedFile, slug: fileSlug };
    }

    async likeBundle(bundleId: ObjectID, userId: ObjectID, clienIp: string) {
        const bundleCount = await this.count({ _id: bundleId });
        if (bundleCount != 1) throw new Error('Invalid event id');

        // Check if bundle already liked
        const bundle = await this.bundleCollection.findOne({ _id: bundleId });
        if (bundle.likes != undefined) {
            await bundle.likes.forEach((Element: any) => {
                const curUser = Element.user + '';
                const user = userId + '';
                if (curUser.localeCompare(user) == 0) {
                    throw new Error('Bundle already liked');
                }
            });
        }

        const updateResult = await this.bundleCollection.updateOne(
            {
                _id: bundleId,
            },
            {
                $push: {
                    likes: { user: userId, createdAt: Date.now(), ip: clienIp },
                },
            },
        );

        if (updateResult.result.nModified != 1)
            throw new Error('Bundle already liked');
        return true;
    }

    async unlikeBundle(bundleId: ObjectID, userId: ObjectID) {
        const updateResult = await this.bundleCollection.updateOne(
            {
                _id: bundleId,
            },
            {
                $pull: {
                    likes: { user: userId },
                },
            },
        );

        if (updateResult.result.nModified != 1)
            throw new Error('Bundle not exist / already unliked');
        return true;
    }

    async viewBundle(bundleId: ObjectID, userId: ObjectID, clienIp: string) {
        const bundle = await this.bundleCollection.findOne({ _id: bundleId });
        let viewed = false;

        if (bundle.views != undefined) {
            await bundle.views.forEach((Element: any) => {
                const curUser = Element.user + '';
                const user = userId + '';
                if (curUser.localeCompare(user) == 0) {
                    viewed = true;
                    return;
                }
            });
        }

        if (viewed == false) {
            await this.bundleCollection.update(
                {
                    _id: bundleId,
                },
                {
                    $push: {
                        views: {
                            user: userId,
                            createdAt: Date.now(),
                            ip: clienIp,
                        },
                    },
                },
            );
            return true;
        }

        return false;
    }

    async updateFile(fileId: ObjectID, data: any) {
        const opUpdateResult = await this.fileCollection.updateOne(
            { _id: fileId },
            { $set: data },
        );
        return opUpdateResult.result.nModified;
    }

    async find(
        query: any = {},
        populateUser = false,
        limit = 10,
        simplify = false,
    ): Promise<Bundle[]> {
        let aggreateCommand: any[] = [
            { $match: query },
            { $sort: { _id: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'files',
                    let: { fileIds: '$files' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$_id', '$$fileIds'] },
                            },
                        },
                        {
                            $addFields: {
                                sort: {
                                    $indexOfArray: ['$$fileIds', '$_id'],
                                },
                            },
                        },
                        { $sort: { sort: 1 } },
                        { $addFields: { sort: '$$REMOVE' } },
                    ],
                    as: 'files',
                },
            },
        ];

        if (populateUser) aggreateCommand = this.populateUser(aggreateCommand);

        const bundles = await this.bundleCollection
            .aggregate(aggreateCommand)
            .toArray();

        return bundles.map((bundle: Bundle) => {
            bundle.files = (bundle.files as File[]).map(
                (f: File, index: number): File =>
                    ({
                        ..._.omit(f, 'isDeleted'),
                        ...(simplify && {
                            content: f.content.substring(0, 255),
                        }),
                    } as File),
            );
            bundle.user = _.pick(bundle.user, USER_SIMPLIFIED_FIELDS) as User;

            delete bundle.pin;

            return bundle;
        }) as Bundle[];
    }

    async count(query: any = {}): Promise<number> {
        return ((await this.bundleCollection.countDocuments(
            query,
        )) as any) as number;
    }

    async delete(bundleId: ObjectID) {
        return this.update(bundleId, { isDeleted: true });
    }

    async deleteFile(bundleId: ObjectID, fileId: ObjectID) {
        const deletedCount = await this.updateFile(fileId, { isDeleted: true });
        if (deletedCount == 0) throw new Error('Unable to delete file');

        const opResult = await this.bundleCollection.updateOne(
            { _id: bundleId },
            {
                $pull: { files: fileId },
            },
        );

        if (opResult.result.nModified == 0)
            throw new Error('Unable to delete file in bundle');
        return opResult.result.nModified;
    }
}
