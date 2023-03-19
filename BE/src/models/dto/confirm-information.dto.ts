import { ObjectID } from 'mongodb';

export interface ConfirmInformationDto {
    _id: ObjectID;
    information: {
        title: string;
    };
    createdAt: number;
    submitAt: number;
    verifiedAt: number;
    verifiedBy: {
        name: string;
        email: string;
    };

    eventStart: number;
    eventEnd: number;

    firstCheck: number;
    endFirstCheck: number;
    numberOfFirstCheck: number;
    secondCheck: number;
    endSecondCheck: number;
    numberOfSecondCheck: number;
    totalParticipant: number;

    leaderNote: string;
    creatorNote: string;

    leaderConfirm?: {
        name: string;
        email: string;
        confirmAt: number;
    };

    creatorConfirm?: {
        name: string;
        email: string;
        confirmAt: number;
    };

    censorConfirm?: {
        name: string;
        email: string;
        confirmAt: number;
    };
}
