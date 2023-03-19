import { inject, injectable } from 'inversify';
import fs from 'fs-extra';
import formidable from 'formidable';
import { IncomingForm } from 'formidable'
import { Collection } from 'mongodb';
import sharp from 'sharp';
import _ from 'lodash';
import rimraf from 'rimraf';

import { UPLOAD_DIR, STATIC_DIR } from '../config';
import { Request, ServiceType } from '../types';
import { DatabaseService } from './database.service';
import { Upload } from '../models/upload.model';

const path = require('path')

@injectable()
export class UploadService {
    uploadCollection: Collection;

    constructor(
        @inject(ServiceType.Database) private dbService: DatabaseService,
    ) {
        fs.ensureDir(UPLOAD_DIR);
        this.uploadCollection = this.dbService.db.collection('uploads');
    }

    private generateForm() {
        return new IncomingForm({
			keepExtensions: true
		})
    }

    handleImageUpload(req: Request) {
        return new Promise<{
            original: string;
            thumbnail: string;
            small: string;
        }>(async (resolve, reject) => {
            const { userId } = req.tokenMeta;
            const userPath = `images/${userId.toHexString()}`;

            const staticPath = path.join(STATIC_DIR, userPath);
            const tmpPath = path.join(UPLOAD_DIR, userPath);

            console.log('[Upload] Static path', staticPath);
            console.log('[Upload] Temp path', tmpPath);

            await fs.ensureDir(staticPath);
            await fs.ensureDir(tmpPath);

            const form = this.generateForm();
            form.parse(req);

            let originalName = '';
            let thumbnailName = '';
            let smallName = '';
            let uploadedPath = '';

            form.on('fileBegin', (name, file) => {
                const fileName = `${Date.now()}`;
                const fileExt = path.extname(file.originalFilename);

                originalName = `${fileName}${fileExt}`;
                thumbnailName = `${fileName}_thumbnail${fileExt}`;
                smallName = `${fileName}_small${fileExt}`;

                uploadedPath = path.join(tmpPath, originalName);
                file.filepath = uploadedPath;
            });

            form.on('end', async () => {
                await sharp(uploadedPath)
                    .resize(1024)
                    .toFile(path.join(staticPath, thumbnailName));
                await sharp(uploadedPath)
                    .resize(512)
                    .toFile(path.join(staticPath, smallName));
                await fs.copy(
                    uploadedPath,
                    path.join(staticPath, originalName),
                );

                // Cleanup temporary
                rimraf(tmpPath, (error) => {
                    if (!_.isEmpty(error)) {
                        console.log('[rimraf]', error);
                    }
                });

                // Record upload data
                const uploadRecord: Upload = {
                    userId,
                    createdAt: Date.now(),
                    path: `static/${userPath}/${originalName}`,
                    type: 'image',
                };
                const opResult = await this.uploadCollection.insertOne(
                    uploadRecord,
                );

                resolve({
                    original: `static/${userPath}/${originalName}`,
                    thumbnail: `static/${userPath}/${thumbnailName}`,
                    small: `static/${userPath}/${smallName}`,
                });
            });
        });
    }
}
