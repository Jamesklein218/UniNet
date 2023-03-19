import { ObjectID } from 'mongodb';
import { EventType, VerifiedState } from '../event.model';

export interface VerifiedEventDto {
    _id: ObjectID;
    information: {
        title: string;
        type: EventType;
        eventStart: number;
    };
    verifyStatus: VerifiedState;
}
