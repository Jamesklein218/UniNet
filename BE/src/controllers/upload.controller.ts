import { Router } from 'express';
import { inject, injectable } from 'inversify';
import _ from 'lodash';

import { Request, Response, ServiceType } from '../types';
import { Controller } from './controller';
import { UploadService, AuthService } from '../services';
import { User } from '../models/user.model';
import { UPLOAD_DIR } from '../config';

@injectable()
export class UploadController extends Controller {
    public readonly router = Router();
    public readonly path = '/upload';

    constructor(
        @inject(ServiceType.Upload) private uploadService: UploadService,
        @inject(ServiceType.Auth) private authService: AuthService,
    ) {
        super();

        // Confing child routes
        this.router.post('/image', this.authService.authenticate(), this.uploadImage.bind(this));
    }

    async uploadImage(req: Request, res: Response) {
        try {
            const uploadedPath = await this.uploadService.handleImageUpload(req);
            res.composer.success(uploadedPath);
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
