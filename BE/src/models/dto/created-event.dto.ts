import { ObjectID } from 'mongodb';
import { EventType, VerifiedState } from '../event.model';

export interface CreatedEventDto {
    _id: ObjectID;
    media: {
        original: string;
        thumbnail: string;
        small: string;
    }[];
    information: {
        title: string;
        eventStart: number;
        type: EventType;
    };
    verifyStatus: VerifiedState;

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
