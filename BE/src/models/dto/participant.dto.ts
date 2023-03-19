import { ObjectID } from 'mongodb';

export interface ParticipantDto {
    _id: ObjectID;
    profilePicture: {
        original: string;
        thumbnail: string;
        small: string;
    };
    name: string;
    roleName: string;
    socialDay?: number;
    firstCheck?: number;
    secondCheck?: number;
}
