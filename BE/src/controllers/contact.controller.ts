import { Router } from 'express';
import { inject, injectable } from 'inversify';
import _ from 'lodash';

import { Request, Response, ServiceType } from '../types';
import { Controller } from './controller';
import { ContactService } from '../services';
import * as admin from 'firebase-admin';

@injectable()
export class ContactController extends Controller {
    public readonly router = Router();
    public readonly path = '/contact';

    constructor(@inject(ServiceType.Contact) private contactService: ContactService) {
        super();

        this.router.get('/', this.relayContact.bind(this));
    }

    async relayContact(req: Request, res: Response) {
        try {
            const registrationTokens =
                'dwqeJg3PQ9OV_MFknBHiI-:APA91bGDe24veq9UZptafKkjxvfg2c4wEagjyadn0ITjawvmGEF_0RXl_0u4_EPPBNtkMrd0MIc_glk_urr9Tw89kdi46VUuoC4Xqsx3Y58hk9j032CipIV-NSYzISRuVcNDQ5dMtpbi';

            const message: admin.messaging.Message = {
                token: registrationTokens,
                notification: {
                    body: 'This is an FCM notification that displays an image!',
                    title: 'FCM Notification',
                },
            };

            admin
                .messaging()
                .send(message)
                .then((response: any) => {
                    console.log('Successfully sent message:', response);
                })
                .catch((error: any) => {
                    console.log('Error sending message:', error);
                });
            // await this.contactService.insert(req.body);
            res.composer.success('OK');
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }
}
