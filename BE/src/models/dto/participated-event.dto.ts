import { ObjectID } from 'mongodb';
import { EventState, EventType } from '../event.model';

export interface ParticipatedEventDto {
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
    eventState: EventState;
    roleName: string;
    
    // A list of participants, only visible to leaders and scanners
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
