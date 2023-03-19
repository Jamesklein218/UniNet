import { ObjectID } from 'mongodb';
import { EventPermission, EventType } from '../event.model';

export interface VerifiedEventByIdDto {
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
    participantRole: {
        eventPermission: EventPermission[];
        roleName: string;
        description: string;
        maxRegister: number;
        socialDay: number;
        isPublic: boolean;
    }[];
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
}
