import { ObjectID } from 'mongodb';
import { EventPermission } from '../models/event.model';
import _ from 'lodash';

export const USER_FORBIDDEN_FIELDS = [
    'password',
    'isArchived',
    'isActivated',
    'isVerified',
    'recoverPasswordCode',
    'recoverPasswordExpires',
    'verifyAccountCode',
];

export const USER_SIMPLIFIED_FIELDS = [
    '_id',
    'username',
    'profile.firstName',
    'profile.lastName',
    'profilePicture',
    'bundleCount',
    'followingCount',
];

export const CONTACT_FIELDS = ['phone', 'email', 'website'];
export const BASIC_FIELDS = ['_id', 'firstName', 'lastName', 'profilePicture', 'username'];

export enum Role {
    Creator = 'CREATOR', // Create new event
    Student = 'STUDENT', // Student
    Reporter = 'REPORTER', // Create a report session
    Censor = 'CENSOR', // Verify and publish new event
}

export enum ClassRole {
    Secretary = 'SECRETARY',
    President = 'PRESIDENT',
    VicePresident = 'VICEPRESIDENT',
    Member = 'MEMBER',
}

// export enum EventRole {
//     leader = 'SCANNER',
//     scanner = 'REGISTER',
//     other = 'LEADER',
// }

enum Sex {
    Male = 'MALE',
    Female = 'FEMALE',
}

/**
 * Model User for both user account and admin account
 *
 * @attrinute _id is the primary key in ObjectID
 * @attribute createdAt is the time the Admin was created in miliseconds
 * @attribute username is used for log-in
 * @attribute password will be encrypted for log-in
 * @attribute role is the role to distinguish between user and admin
 * @attribute email is the email of the admin
 * @attribute phone is the phone number of the admin
 * @attribute address is the address of the admin
 * @attribute name is the name of the admin
 * @attribute description is the description for the profile of the admin
 * @attribute profilePicture is the object contain the picture for the admin
 * @attribute postCreated is the list of post created by this account
 * @attribute eventCreated is the list of event created by this account
 * @attribute isActivated is used for checking whether the user account is online or not
 * @attribute isBan is used for checking whether the user account is banned or not
 * @attribute banReasons is history of reasons for banning
 * @attribute socialDay is the number of social days the student has
 * @attribute firstName is the first name of the user
 * @attribute lastName is the last name of the user
 * @attribute dob is the date of birth of the user in milisecond
 * @attribute gender is the gender of the user: Male or Female
 * @attribute classId is the class id of the user
 * @attribute major is the major that the user is studying
 * @attribute studentId is the id of the student
 * @attribute studentCard is the object contain the picture for the student card
 * @attribute eventStaff is the list of event that the user staff for
 * @attribute eventRegister is the list of event that the user register
 */

export interface User {
    /* User */
    _id: ObjectID;
    createdAt: number;
    username: string;
    password: string;
    role: Role[];
    email: string;
    phone: string;
    address?: string;
    name: string;
    description?: string;
    profilePicture: {
        original: string;
        thumbnail: string;
        small: string;
    };
    isActivated: boolean;
    isBan: boolean;
    banReason: string;
    isVerified: boolean;

    recoverPasswordCode?: string;
    recoverPasswordExpires?: number;
    verifyAccountCode?: string;

    /* Creator */
    postCreated?: ObjectID[];
    eventCreated?: ObjectID[];

    /* Student */
    socialDays?: number;
    firstName?: string;
    lastName?: string;
    dob?: number;
    gender?: Sex;
    classId?: string;
    classRole: ClassRole;
    major?: string;
    faculty: string;
    studentId?: string;
    studentCard?: {
        original: string;
        thumbnail: string;
        small: string;
    };
    eventParticipated?: {
        eventId: ObjectID;
        eventPermission: EventPermission;
        socialDay: number;
        /* Register */
        roleId: number;
        roleName: string;
    }[];
    reportFilled?: ObjectID[];

    /* Class Staff */
    reportConfirmed?: ObjectID[];

    /* Censor */
    eventVerified?: ObjectID[];
    
    // forum posts
    posts: ObjectID[]
    comments: ObjectID[]
    
    post_upvotes: ObjectID[]
    post_downvotes: ObjectID[]
    
    comment_upvotes: ObjectID[]
    comment_downvotes: ObjectID[]
}

export function fillDefaultUserValue(user: User): User {
    return _.merge(
        {
            createdAt: Date.now(),
            username: '',
            password: '',
            name: '',
            email: user.username,

            role: [Role.Student],

            isActivated: true,
            isBan: false,
            banReason: '',
            isVerified: true,

            profilePicture: {
                original: '/static/default/default-profile.jpg',
                thumbnail: '/static/default/default-profile.jpg',
                small: '/static/default/default-profile.jpg',
            },
        },
        user,
    );
}

// export const PROFILE_KEYS = Object.keys(fillDefaultUserValue(null));
// export const CONTACT_KEYS = Object.keys(fillDefaultUserValue(null));
