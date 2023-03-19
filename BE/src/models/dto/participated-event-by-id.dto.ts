import { ObjectID } from 'mongodb';
import { EventPermission, EventState, EventType, VerifiedState } from '../event.model';

export interface ParticipatedEventByIdDto {
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
    verifyStatus: VerifiedState;
    eventState: EventState;
    firstCheck: number;
    endFirstCheck: number;
    secondCheck: number;
    endSecondCheck: number;
    eventStart: number;
    eventEnd: number;

    myBKConfirm: number;
    leaderConfirm: number;
    creatorConfirm: number;

    roleName: string;
    socialDay: number;
    suggestSocialDay: number;
    permission: EventPermission[];
    firstCheckUser: number;
    secondCheckUser: number;
    
    // A list of participants, only viewable to leaders and scanners
    participant?: {
        _id: ObjectID,
        profilePicture: {
            original: string
            thumbnail: string
            small: string
        }
        roleName: string
    }[]
}
