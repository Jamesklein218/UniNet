import { ObjectID } from 'mongodb';
import { EventType } from '../event.model';

export interface OpenEventByIdDto {
    _id: ObjectID;
    media: {
        original: string;
        thumbnail: string;
        small: string;
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
    information: {
        title: string;
        description: string;
        unitHeld?: string;
        type: EventType;
        formStart: number;
        formEnd: number;
        eventStart?: number;
        eventEnd?: number;
    };
    participantRole: {
        roleName?: string;
        roleId: number;
        description?: string;
        maxRegister: number;
        socialDay: number;
        isPublic: boolean;
        registerList: ObjectID[];
    }[];
    participant: {
        firstName: string;
        profilePicture: {
            original: string;
            thumbnail: string;
            small: string;
        };
    }[];
}
