import { ObjectID } from 'mongodb';

export interface CheckAttendanceAttendeeDto {
    _id: ObjectID;
    profilePicture?: {
        original: string,
        thumbnail: string,
        small: string
    }
    name?: string,
    roleName?: string
}