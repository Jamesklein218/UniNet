import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { Request, Response, ServiceType, HttpMethod } from '../types';
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
import { ObjectID } from 'mongodb';
import { Notification } from '../models/notification.model';
import _ from 'lodash';

@injectable()
export class NotificationController extends Controller {
    public readonly router = Router();
    public readonly path = '/notification';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.Event) private eventService: EventService,
        @inject(ServiceType.Notification) private notiService: NotificationService,
    ) {
        super();
        this.router.all('*', this.authService.authenticate());
        this.router.post('/:notiId', this.readNotification.bind(this));
    }

    async readNotification(req: Request, res: Response) {
        try {
            const notiId = ObjectID.createFromHexString(req.params.notiId);
            const thisNotification = (await this.notiService.findOne({
                _id: notiId,
            })) as Notification;
            if (!thisNotification.isRead) {
                const isReadUpdate = await this.notiService.updateOne(notiId, {
                    isRead: true,
                });
            }
            const referenceEvent = await this.eventService.findById(thisNotification.refId);
            if (referenceEvent)
                res.composer.success({
                    ..._.pick(referenceEvent, ['userCreated', 'verifiedBy']),
                });
            else res.composer.success({});
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }
}
