import { ObjectID } from 'mongodb';
import { EventType } from '../event.model';

export interface OpenEventDto {
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
    participant: {
        profilePicture: {
            original: string;
            thumbnail: string;
            small: string;
        };
    }[];
}
