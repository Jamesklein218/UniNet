import _ from 'lodash';
import { injectable } from 'inversify';
import { Event, EventPermission } from '../models/event.model';
import { OpenEventDto } from '../models/dto/open-event.dto';
import { OpenEventByIdDto } from '../models/dto/open-event-by-id.dto';
import { CreatedEventDto } from '../models/dto/created-event.dto';
import { ParticipatedEventDto } from '../models/dto/participated-event.dto';
import { ObjectID } from 'mongodb';
import { WaitingEventDto } from '../models/dto/waiting-event.dto';
import { CreatedEventByIdDto } from './../models/dto/created-event-by-id.dto';
import { ParticipatedEventByIdDto } from '../models/dto/participated-event-by-id.dto';
import { WaitingEventByIdDto } from './../models/dto/waiting-event-by-id.dto';
import { CheckAttendanceAttendeeDto } from '../models/dto/checked-attendee';
import { VerifiedEventDto } from './../models/dto/verified-event.dto';
import { VerifiedEventByIdDto } from './../models/dto/verified-event-by-id.dto';
import { ConfirmInformationDto } from '../models/dto/confirm-information.dto';

@injectable()
export class MapperService {
    async toOpenEventDto(event: any): Promise<OpenEventDto> {
        var result: OpenEventDto = {
            ..._.pick(event, ['_id', 'media', 'information']),
            participant: await Promise.all(
                event.participant.map((participant: any) => ({
                    profilePicture: _.get(participant, 'userInfo.profilePicture'),
                })),
            ),
        };
        return result;
    }

    async toOpenEventByIdDto(event: any): Promise<OpenEventByIdDto> {
        var result: OpenEventByIdDto = {
            _id: event._id,
            media: event.media,
            userCreated: {
                ..._.pick(event.userCreated, ['_id', 'profilePicture', 'name', 'email']),
            } as any,
            information: {
                ..._.pick(event.information, [
                    'title',
                    'description',
                    'unitHeld',
                    'type',
                    'formStart',
                    'formEnd',
                    'eventStart',
                    'eventEnd',
                ]),
            } as any,
            participantRole: await Promise.all(
                event.participantRole.map((participantRole: any) => ({
                    ..._.pick(participantRole, [
                        'roleName',
                        'roleId',
                        'description',
                        'maxRegister',
                        'socialDay',
                        'isPublic',
                        'registerList',
                    ]),
                })),
            ),
            participant: await Promise.all(
                event.participant.map((participant: any) => ({
                    firstName: _.get(participant, 'userInfo.firstName'),
                    profilePicture: _.get(participant, 'userInfo.profilePicture'),
                })),
            ),
        };
        return result;
    }

    async toCreatedEventDto(event: Event): Promise<CreatedEventDto> {
        var result: CreatedEventDto = {
            ..._.pick(event, ['_id', 'media', 'verifyStatus']),
            information: {
                ..._.pick(event.information, ['title', 'eventStart', 'type']),
            },
        };
        return result;
    }

    async toCreatedEventById(event: Event): Promise<CreatedEventByIdDto> {
        const result: CreatedEventByIdDto = {
            ..._.pick(event, [
                '_id',
                'media',
                'information',
                'verifyStatus',
                'eventState',
                'submitAt',
                'createdAt',
                `attendancePeriods`,
                `currentAttendancePeriod`
            ]),
            participantRole: event.participantRole.map(role => _.pick(role, [
                'roleId',
                'eventPermission',
                'roleName',
                'description',
                'maxRegister',
                'socialDay',
                'isPublic',
            ]))
        };
        return result;
    }

    async toParticipatedEventDto(event: Event, userId: ObjectID): Promise<ParticipatedEventDto> {
        let roleName = _.find(event.participant, (user: any) => user.userId.equals(userId)).roleName
        let result: ParticipatedEventDto = {
            ..._.pick(event, ['_id', 'media', 'eventState']),
            information: {
                ..._.pick(event.information, ['title', 'eventStart', 'type']),
            },
            roleName: roleName,
        }
        return result
    }

    async toParticipatedEventById(event: any, userId: ObjectID): Promise<ParticipatedEventByIdDto> {
        var participantInfo: any = await _.find(event.participant, (obj: any) => {
            return obj.userId.equals(userId);
        });
        var result: ParticipatedEventByIdDto = {
            ..._.pick(event, [
                '_id',
                'media',
                'information',
                'verifyStatus',
                'eventState',
                'firstCheck',
                'endFirstCheck',
                'secondCheck',
                'endSecondCheck',
                'eventStart',
                'eventEnd',
                'myBKConfirm',
                'leaderConfirm',
                'creatorConfirm',
            ]),
            userCreated: {
                ..._.pick(event.userCreated, ['_id', 'profilePicture', 'name', 'email']),
            } as any,
            roleName: participantInfo.roleName,
            socialDay: participantInfo.socialDay,
            suggestSocialDay: event.participantRole[participantInfo.roleId].socialDay,
            permission: event.participantRole[participantInfo.roleId].eventPermission,
            firstCheckUser: participantInfo.firstCheck,
            secondCheckUser: participantInfo.secondCheck,
        };
        return result;
    }

    async toWaitingEventDto(event: any): Promise<WaitingEventDto> {
        var result: WaitingEventDto = {
            ..._.pick(event, ['_id', 'media', 'verifyStatus', 'submitAt']),
            information: { ..._.pick(event.information, ['title', 'isUrgent']) },
            userCreated: { ..._.pick(event.userCreated, ['name', 'profilePicture']) },
        };
        return result;
    }

    async toWaitingEventByIdDto(event: any): Promise<WaitingEventByIdDto> {
        var result: WaitingEventByIdDto = {
            ..._.pick(event, ['_id', 'media', 'information', 'verifyStatus', 'submitAt']),
            userCreated: {
                ..._.pick(event.userCreated, ['_id', 'profilePicture', 'name', 'email']),
            } as any,
            participantRole: await Promise.all(
                event.participantRole.map((participantRole: any) => ({
                    ..._.pick(participantRole, [
                        'eventPermission',
                        'roleId',
                        'roleName',
                        'description',
                        'maxRegister',
                        'socialDay',
                        'isPublic',
                    ]),
                })),
            ),
        };
        return result;
    }

    async toVerifiedEventDto(event: any): Promise<VerifiedEventDto> {
        var result: VerifiedEventDto = {
            ..._.pick(event, ['_id', 'verifyStatus']),
            information: { ..._.pick(event.information, ['title', 'type', 'eventStart']) },
        };
        return result;
    }

    async toVerifiedEventById(event: any): Promise<VerifiedEventByIdDto> {
        var result: VerifiedEventByIdDto = {
            ..._.pick(event, ['_id', 'media', 'information']),
            participantRole: await Promise.all(
                event.participantRole.map((participantRole: any) => ({
                    ..._.pick(participantRole, [
                        'eventPermission',
                        'roleName',
                        'description',
                        'maxRegister',
                        'socialDay',
                        'isPublic',
                    ]),
                })),
            ),
            userCreated: {
                ..._.pick(event.userCreated, ['_id', 'profilePicture', 'name', 'email']),
            },
        };
        return result;
    }

    async toConfirmInformationDto(event: any): Promise<ConfirmInformationDto> {
        var leaderConfirm: any = {},
            creatorConfirm: any = {},
            censorConfirm: any = {};
        if (event.leaderConfirmAt > 0)
            leaderConfirm = {
                ..._.pick(event.leaderConfirm, ['name', 'email']),
                confirmAt: event.leaderConfirmAt,
            };
        if (event.creatorConfirmAt > 0)
            creatorConfirm = {
                ..._.pick(event.userCreated, ['name', 'email']),
                confirmAt: event.creatorConfirmAt,
            };
        if (event.censorConfirmAt > 0)
            censorConfirm = {
                ..._.pick(event.verifiedBy, ['name', 'email']),
                confirmAt: event.censorConfirmAt,
            };
        var result: ConfirmInformationDto = {
            ..._.pick(event, [
                '_id',
                'createdAt',
                'submitAt',
                'verifiedAt',
                'eventStart',
                'eventEnd',
                'firstCheck',
                'endFirstCheck',
                'numberOfFirstCheck',
                'secondCheck',
                'endSecondCheck',
                'numberOfSecondCheck',
                'leaderNote',
                'creatorNote',
            ]),
            information: { ..._.pick(event.information, ['title']) },
            verifiedBy: { ..._.pick(event.verifiedBy, ['name', 'email']) },
            totalParticipant: event.participant.length,

            leaderConfirm: leaderConfirm,
            creatorConfirm: creatorConfirm,
            censorConfirm: censorConfirm,
        };
        return result;
    }

    async toAttendanceAttendeeDto(attendee: any): Promise<CheckAttendanceAttendeeDto> {
        return {
            _id: attendee.userId
        }
    }
}
