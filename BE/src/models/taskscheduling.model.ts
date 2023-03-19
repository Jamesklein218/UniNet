import { JobAttributesData } from "agenda";
import { ObjectID } from "mongodb";

export interface StartEventData extends JobAttributesData {
    eventId: ObjectID
}

export interface EndEventData extends JobAttributesData {
    eventId: ObjectID
}

export interface StartAttendanceData extends JobAttributesData {
    eventId: ObjectID
    index: number
}

export interface EndAttendanceData extends JobAttributesData {
    eventId: ObjectID
    index: number
}

export interface UpdateSocialDayData extends JobAttributesData {
    eventId: ObjectID
}

export function timestampToDate(timestamp: number) {
    return new Date(timestamp)
}