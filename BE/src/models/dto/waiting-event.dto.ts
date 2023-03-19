import { ObjectID } from 'mongodb';
import { VerifiedState } from '../event.model';

export interface WaitingEventDto {
    _id: ObjectID;
    media: {
        original: string;
        thumbnail: string;
        small: string;
    }[];
    information: {
        title: string;
        isUrgent: boolean;
    };
    userCreated: {
        name: string;
        profilePicture: {
            original: string;
            thumbnail: string;
            small: string;
        };
    };
    verifyStatus: VerifiedState;
    submitAt: number;
}
