import { ObjectID } from 'mongodb';
import _ from 'lodash';

export enum RefType {
    DEFAULT = 'Default',
    EVENT = 'Event',
    USER = 'User',
    REPORT = 'Report',
}

export enum RefIdType {
    DEFAULT = 'none',
    EVENT = 'event',
    USER = 'user',
    POST = 'post'
}

export enum RefName {
    DEFAULT = 'Default',
    VERIFY_FAIL = 'VERIFY_FAIL',
    VERIFY_SUCCESS = 'VERIFY_SUCCESS',
    EVENT_START = 'EVENT_START',
    EVENT_START_FIRST_CHECK = 'EVENT_START_FIRST_CHECK',
    EVENT_END_FIRST_CHECK = 'EVENT_END_FIRST_CHECK',
    EVENT_START_SECOND_CHECK = 'EVENT_START_SECOND_CHECK',
    EVENT_END_SECOND_CHECK = 'EVENT_END_SECOND_CHECK',
    EVENT_END = 'EVENT_END',
    CHECK_SUCCESS = 'CHECK_SUCCESS',
    UPDATE_SOCIAL = 'UPDATE_SOCIAL',
    VERIFY_EVENT = 'VERIFY_EVENT',
    SUBMITTED_BY_LEADER = 'SUBMITTED_BY_LEADER',
    SUBMITTED_BY_CREATOR = 'SUBMITTED_BY_CREATOR',
}

export interface Notification {
    readonly _id?: ObjectID;
    fromUser?: ObjectID;
    toUser: ObjectID;
    title: string;
    message: string;
    refType?: RefType;
    refId?: ObjectID;
    refName?: RefName;
    isRead: boolean;
    createdAt: number;
}

export function fillDefaultNotificationValue(notification: Notification): Notification {
    return _.merge(
        {
            title: '',
            message: '',
            isRead: false,
            refName: RefName.DEFAULT,
            refType: RefType.EVENT,
            createdAt: Date.now(),
        },
        notification,
    );
}
