import { inject, injectable } from 'inversify';
import { Collection, ObjectID } from 'mongodb';
import { ServiceType } from './../types';
import { DatabaseService } from './database.service';
import { RefName, RefType, RefIdType } from '../models/notification.model';
import { Notification, fillDefaultNotificationValue } from './../models/notification.model';
import * as admin from 'firebase-admin';
import _ from 'lodash';

@injectable()
export class NotificationService {
    private notificationCollection: Collection;
    private deviceTokenCollection: Collection;

    constructor(@inject(ServiceType.Database) private dbService: DatabaseService) {
        this.notificationCollection = this.dbService.db.collection('notification');
        this.deviceTokenCollection = this.dbService.db.collection('device_token');
    }

    async create(notification: any): Promise<Notification> {
        const newNotification = await this.notificationCollection.insertOne(
            fillDefaultNotificationValue(notification),
        );
        return newNotification.ops[0] as Notification;
    }

    async find(query: any = {}): Promise<Notification[]> {
        const notifications = await this.notificationCollection
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();
        return notifications;
    }

    async findOne(query: any = {}): Promise<Notification> {
        const notification: Notification = await this.notificationCollection.findOne(query);
        return notification;
    }

    async deleteOne(notiId: ObjectID): Promise<void> {
        await this.notificationCollection.deleteOne({ _id: notiId });
    }

    async updateOne(notiId: ObjectID, data: any) {
        const opUpdateResult = await this.notificationCollection.updateOne(
            { _id: notiId },
            { $set: data },
        );
        return opUpdateResult.result.nModified;
    }

    async sendNotifications(
        users: ObjectID[],
        notification: any,
        refIdType: RefIdType = RefIdType.EVENT,
    ) {
        console.log('==> NOTIFICATION TITLE:', notification.title);
        _.forEach(users, async (userId: ObjectID) => {
            const noti = await this.create({
                toUser: userId,
                ...notification,
            });
            if (refIdType == RefIdType.USER) {
                const a = await this.updateOne(noti._id, { refId: userId });
            }
            const tokenRegister = await this.deviceTokenCollection
                .find({ userId: userId })
                .toArray();
            if (tokenRegister.length > 0) {
                _.forEach(tokenRegister, (device) => {
                    const message: admin.messaging.Message = {
                        token: device.token,
                        notification: {
                            body: noti.message,
                            title: noti.title,
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
                });
            } else console.log(`Device token not found for user ${userId}`);
        });
    }
}
