import { ObjectId, ObjectID } from 'mongodb';
import _ from 'lodash';

export enum EventState {
    prepare = 'PREPARE',
    start = 'START',
    firstCheck = 'FIRST_CHECK',
    endFirstCheck = 'END_FIRST_CHECK',
    secondCheck = 'SECOND_CHECK',
    endSecondCheck = 'END_SECOND_CHECK',
    finish = 'FINISH',
    closing = 'CLOSING',
}

export enum VerifiedState {
    preparing = 'PREPARING',
    waiting = 'WAITING',
    failed = 'FAILED',
    successful = 'SUCCESSFUL',
}

export enum EventType {
    general = 'GENERAL',
    chain = 'CHAIN',
    other = 'OTHER',
}

export enum EventPermission {
    scanner = 'SCANNER',
    register = 'REGISTER',
    leader = 'LEADER',
}

export const INFORMATION_FIELDS = [
    'title',
    'description',
    'unitHeld',
    'type',
    'isUrgent',
    'coordinate',
    'formStart',
    'formEnd',
    'eventStart',
    'eventEnd',
];

/**
 * Model Event for the event when admin create and when user register
 *
 * @attrinute _id is the primary key in ObjectID
 * @attribute createdAt is the time the Event was created in miliseconds
 * @attribute updateAt is the time of the last update in miliseconds
 * @attribute userCreated is the id of creator
 * @attribute title is the required title for the event
 * @attribute description is the required description of the event
 * @attribute socialDays is the socialDays that user received when the event finish
 * @attribute eventStart is the real time that the event start
 * @attribute eventEnd is the real time that the event end
 * @attribute unitHeld is the information of the unit that held the event
 * @attribute type is the type of the event: general for independent event and chain for periodic event such as voluntary spring, green summer and other types
 * @attribute isUrgent is used to identify whether the event is urgent or not
 * @attribute coordinate is the location that the event was held in google map api
 * @attribute leaderConfirm is the confirmation of the leader when the event finish
 * @attribute leaderNote is the leader note when the leader confirm
 * @attribute adminConfirm is the confirmation of the admin when leader had confirmed
 * @attribute adminNote is the admin note when the admin confirm
 * @attribute myBKConfirm is the confirmation of myBK for updating social days
 * @attribute message is a simple chat log between user and staff of that event. Each message need to contain infomation of the sender and the text
 * @attribute form is the form information containing necessary data for checking user to check information of the event when posting and when doing
 * @attribute media is the array contain images, videos for the event
 * @attribute staff is the list of staff of the event
 * @attribute register is the list of register of the event
 * @attribute seen is the list of user who saw the event
 */

// export interface Event {
//     _id: ObjectID;
//     createdAt: number;
//     updateAt: number;
//     userCreated: ObjectID;

//     information: {
//         title: string;
//         description: string;
//         socialDays?: number;
//         unitHeld?: string;
//         type: EventType;
//         isUrgent: boolean;
//         coordinate?: number[];
//         formStart: number;
//         formEnd: number;
//         eventStart?: number;
//         eventEnd?: number;
//         maxRegister: number;
//     };

//     eventState: EventState;
//     eventStart?: number;
//     eventEnd?: number;
//     myBKConfirm: number;
//     leaderConfirm: number;
//     leaderNote?: string;
//     creatorConfirm: number;
//     creatorNote?: string;

//     firstCheck: number;
//     endFirstCheck: number;
//     numberOfFirstCheck: number;
//     secondCheck: number;
//     endSecondCheck: number;
//     numberOfSecondCheck: number;

//     ivFirstCheck?: string;
//     ivSecondCheck?: string;

//     message: {
//         text: string;
//         createdAt: number;
//         userCreated: ObjectID;
//     }[];

//     media: {
//         original: string;
//         thumbnail: string;
//         small: string;
//     }[];
//     staff: {
//         note: string;
//         userId: ObjectID;
//         attempAt: number;
//         socialDay: number;
//         staffRole: StaffType;
//     }[];
//     register: {
//         code: string;
//         socialDay: number;
//         firstCheck: number;
//         secondCheck: number;
//         registerAt: number;
//         note: string;
//         userId: ObjectID;
//     }[];
//     seen: {
//         userId: ObjectID;
//         seenAt: number;
//     }[];
// }

export interface Event {
    _id: ObjectID;
    createdAt: number;
    updateAt: number;
    userCreated: ObjectID;

    information: {
        title: string;
        description: string;
        unitHeld?: string;
        type: EventType;
        isUrgent: boolean;
        coordinate?: number[];
        formStart: number;
        formEnd: number;
        eventStart: number;
        eventEnd: number;
    };

    eventState: EventState;
    eventStart: number;
    eventEnd: number;

    leaderConfirm?: ObjectID;
    leaderConfirmAt: number;
    leaderNote?: string;

    creatorConfirmAt: number;
    creatorNote?: string;

    censorConfirmAt: number;
    
    attendancePeriods: {
        title: string,
        checkStart: number,
        checkEnd: number,
        ivCheck: string,
        checkedParticipants: ObjectID[],
    }[]
    currentAttendancePeriod: number,

    message: {
        text: string;
        createdAt: number;
        userCreated: ObjectID;
    }[];

    media: {
        original: string;
        thumbnail: string;
        small: string;
    }[];
    seen: {
        userId: ObjectID;
        seenAt: number;
    }[];

    participantRole: {
        roleId: number;
        eventPermission: EventPermission[];
        roleName?: string;
        description?: string;
        maxRegister: number;
        socialDay: number;
        isPublic: boolean;
        registerList: ObjectID[];
    }[];

    participant: {
        userId: ObjectID;
        roleId: number;
        roleName: string;
        registerAt: number;
        note?: string;
        code: string;
        socialDay?: number;
    }[];

    submitAt?: number;
    verifyStatus: VerifiedState;
    verifiedAt?: number;
    verifiedBy?: ObjectID;
    verifiedMessage?: string;
}

export function fillDefaultEventValue(event: Event): Event {
    return _.merge(
        {
            createdAt: Date.now(),
            message: [],

            eventState: EventState.prepare,
            eventStart: 0,
            eventEnd: 0,
            censorConfirmAt: 0,
            leaderConfirmAt: 0,
            leaderNote: '',
            creatorConfirmAt: 0,
            creatorNote: '',

            attendancePeriods: [],
            currentAttendancePeriod: -1,

            information: {
                title: 'Untitled',
                description: '',
                type: EventType.general,
                isUrgent: false,
                eventStart: 0,
                eventEnd: 0,
                formStart: 0,
                formEnd: 0,
            },

            participant: [],

            reportLastSubmitAt: 0,

            media: [
                {
                    original:
                        '/static/default/event-' +
                        Math.floor(Math.random() * Math.floor(7)) +
                        '.jpg',
                    thumbnail:
                        '/static/default/event-' +
                        Math.floor(Math.random() * Math.floor(7)) +
                        '.jpg',
                    small:
                        '/static/default/event-' +
                        Math.floor(Math.random() * Math.floor(7)) +
                        '.jpg',
                },
            ],
            verifyStatus: VerifiedState.preparing,
        },
        event,
    );
}

export function fillDefaultParticipantRole(): any[] {
    const defaultParticipantRole = [
        {
            roleId: 0,
            eventPermission: [EventPermission.leader],
            roleName: 'Event Manager',
            description: 'Leader of the event',
            maxRegister: 1,
            socialDay: 1,
            isPublic: false,
            registerList: [] as any[],
        },
        {
            roleId: 1,
            eventPermission: [EventPermission.scanner],
            roleName: 'Event Checker',
            description: 'Scanner of the event',
            maxRegister: 1,
            socialDay: 1,
            isPublic: false,
            registerList: [] as any[],
        },
    ];
    return defaultParticipantRole;
}
// export function fillDefaultEventValue(event: Event): Event {
//     return _.merge(
//         {
//             createdAt: Date.now(),

//             message: [],

//             eventState: EventState.prepare,
//             eventStart: 0,
//             eventEnd: 0,
//             myBKConfirm: 0,
//             leaderConfirm: 0,
//             leaderNote: '',
//             creatorConfirm: 0,
//             creatorNote: '',

//             firstCheck: 0,
//             numberOfFirstCheck: 0,
//             secondCheck: 0,
//             numberOfSecondCheck: 0,
//             information: {
//                 title: 'Amazing Event',
//                 description: 'This is an amazing event',
//                 type: EventType.general,
//                 isUrgent: false,
//                 eventStart: 0,
//                 eventEnd: 0,
//                 formStart: 0,
//                 formEnd: 0,
//                 maxRegister: 0,
//             },

//             media: [
//                 {
//                     original:
//                         '/static/default/event-' +
//                         Math.floor(Math.random() * Math.floor(7)) +
//                         '.jpg',
//                     thumbnail:
//                         '/static/default/event-' +
//                         Math.floor(Math.random() * Math.floor(7)) +
//                         '.jpg',
//                     small:
//                         '/static/default/event-' +
//                         Math.floor(Math.random() * Math.floor(7)) +
//                         '.jpg',
//                 },
//             ],
//             staff: [],
//             register: [],
//         },
//         event,
//     );
// }
