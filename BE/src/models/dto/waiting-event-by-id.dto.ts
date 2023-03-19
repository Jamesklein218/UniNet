import { ObjectID } from 'mongodb';
import { EventPermission, EventType, VerifiedState } from '../event.model';

export interface WaitingEventByIdDto {
    _id: ObjectID;
    media: {
        original: string;
        thumbnail: string;
        small: string;
    }[];
    information: {
        title: string;
        description: string;
        unitHeld?: string;
        type: EventType;
        isUrgent: boolean;
        coordinate?: number[];
        formStart: number;
        formEnd: number;
        eventStart?: number;
        eventEnd?: number;
    };
    userCreated: {
        _id: ObjectID;
        profilePicture: {
            original: string;
            thumbnail: string;
            small: string;
        };
        name: string;
        email: string;
    };
    participantRole: {
        eventPermission: EventPermission[];
        roleId: number;
        roleName: string;
        description: string;
        maxRegister: number;
        socialDay: number;
        isPublic: boolean;
    }[];
    verifyStatus: VerifiedState;
    submitAt: number;
}
