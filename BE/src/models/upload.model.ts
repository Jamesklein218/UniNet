import { ObjectID } from 'mongodb';

export interface Upload {
    _id?: ObjectID;
    userId: ObjectID;
    createdAt: number;
    type: string;
    path: string;
}
