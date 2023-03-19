import { ObjectID } from 'mongodb';
import _ from 'lodash';

export interface DeviceToken {
    readonly _id?: ObjectID;
    userId?: ObjectID;
    token: string;
    createdAt: number;
}
