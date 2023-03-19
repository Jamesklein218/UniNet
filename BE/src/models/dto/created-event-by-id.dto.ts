import { ObjectID } from 'mongodb';
import { EventPermission, EventState, EventType, VerifiedState } from '../event.model';

export interface CreatedEventByIdDto {
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
        formStart: number;
        formEnd: number;
        eventStart?: number;
        eventEnd?: number;
    };
    participantRole: {
        roleId: number;
        eventPermission: EventPermission[];
        roleName?: string;
        description?: string;
        maxRegister: number;
        socialDay: number;
        isPublic: boolean;
    }[];
    attendancePeriods: {
        title: string,
        checkStart: number,
        checkEnd: number,
        ivCheck: string,
        checkedParticipants: ObjectID[],
    }[]
    currentAttendancePeriod: number,
    verifyStatus: VerifiedState;
    eventState: EventState;
    submitAt?: number;
    createdAt: number;

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
