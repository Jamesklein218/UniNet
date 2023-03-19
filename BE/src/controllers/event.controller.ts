import e, { Router } from 'express';
import { inject, injectable } from 'inversify';
import _ from 'lodash';
import { Request, Response, ServiceType } from '../types';
import { Controller } from './controller';
import { Role } from '../models/user.model';
import {
    Event,
    INFORMATION_FIELDS,
    EventState,
    VerifiedState,
    EventPermission,
    fillDefaultParticipantRole,
} from '../models/event.model';
import { RefName, RefType, RefIdType } from '../models/notification.model';
import { EventService, UserService, AuthService, NotificationService } from '../services';
import crypto from 'crypto';
import { OpenEventDto } from '../models/dto/open-event.dto';
import { MapperService } from '../services/mapper.service';

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
import { ObjectID } from 'mongodb';
import { OpenEventByIdDto } from './../models/dto/open-event-by-id.dto';
import { ParticipatedEventDto } from './../models/dto/participated-event.dto';
import { WaitingEventDto } from '../models/dto/waiting-event.dto';
import { CreatedEventByIdDto } from './../models/dto/created-event-by-id.dto';
import { ParticipatedEventByIdDto } from './../models/dto/participated-event-by-id.dto';
import { WaitingEventByIdDto } from './../models/dto/waiting-event-by-id.dto';
import { VerifiedEventDto } from './../models/dto/verified-event.dto';
import { VerifiedEventByIdDto } from './../models/dto/verified-event-by-id.dto';
import { ParticipantDto } from './../models/dto/participant.dto';
import { ConfirmInformationDto } from './../models/dto/confirm-information.dto';
import { ErrorInvalidData, ErrorNotFound, ErrorUnauthorized, ErrorUserInvalid } from '../lib/errors';
import { checkCensorHasNotConfirmed, checkCreatorHasConfirmed, checkCreatorHasNotConfirmed,
         checkEventHasAttendancePeriod,
         checkEventHasRole, checkEventInAttendancePeriod, checkEventInFormPeriod, checkEventInPreparation, checkEventNotFinished,
         checkEventNotNull, checkEventRolePublic, checkEventStateIs, checkEventStateIsNot,
         checkEventVerifyStateIs, checkEventVerifyStateIsNot, checkLeaderHasConfirmed, checkLeaderHasNotConfirmed,
         checkRoleNotAtRegisterLimit, checkUserCanStartEvent, checkUserCreatedEvent, checkUserDidNotCreateEvent, checkUserDidNotRegisterEvent,
         checkUserIsCensor, checkUserIsCreator, checkUserRegisterEvent, checkUserVerifiedEvent } from '../lib/request-validation';
import { JobType, TaskSchedulingService } from '../services/taskscheduling.service';
import { CheckAttendanceAttendeeDto } from '../models/dto/checked-attendee';

@injectable()
export class EventController extends Controller {
    public readonly router = Router();
    public readonly path = '/event';

    constructor(
        @inject(ServiceType.Event) private eventService: EventService,
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.Notification) private notiService: NotificationService,
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Mapper) private mapperService: MapperService,
        @inject(ServiceType.TaskSchedule) private taskSchedulingService: TaskSchedulingService
    ) {
        super();
        this.router.all('*', this.authService.authenticate());

        // --------- Pre-event APIs ------------------
        this.router.post('/', this.createEvent.bind(this));
        this.router.patch('/:eventId', this.editEvent.bind(this));
        this.router.delete('/:eventId', this.deleteEvent.bind(this));
        this.router.post('/:eventId/role', this.addRole.bind(this));
        this.router.patch('/:eventId/role', this.editRole.bind(this));
        this.router.post("/:eventId/deleterole", this.deleteRole.bind(this))
        
        this.router.post("/:eventId/addattendanceperiod", this.addAttendancePeriod.bind(this))
        this.router.post("/:eventId/removeattendanceperiod", this.removeAttendancePeriod.bind(this))

        // --------- Verify Event ------------------
        this.router.post('/:eventId/submit', this.requestVerify.bind(this));
        this.router.post('/:eventId/verify', this.verifyEvent.bind(this));

        // --------- APIs Get Events ------------------
        // For Open events
        this.router.get('/open', this.getOpenEvents.bind(this));
        this.router.get('/open/:eventId', this.getOpenEventById.bind(this));
        // For Creators
        this.router.get('/created', this.getCreatedEvents.bind(this));
        this.router.get('/created/:eventId', this.getCreatedEventById.bind(this));
        // For Censors
        this.router.get('/waiting', this.getWaitingEvents.bind(this));
        this.router.get('/waiting/:eventId', this.getWaitingEventById.bind(this));
        this.router.get('/verified', this.getVerifiedEvents.bind(this));
        this.router.get('/verified/:eventId', this.getVerifiedEventById.bind(this));
        // For Participants
        this.router.get('/participated', this.getParticipatedEvents.bind(this));
        this.router.get('/participated/:eventId', this.getParticipatedEventById.bind(this));
        // By Keyword
        this.router.get('/search', this.getByKeyword.bind(this));

        // --------- Register + Unregister Event ------------------
        this.router.post('/:eventId/register', this.registerEvent.bind(this));
        this.router.patch('/:eventId/register', this.unregisterEvent.bind(this));
        this.router.post('/:eventId/register/by_creator', this.registerByCreator.bind(this));
        this.router.patch('/:eventId/register/by_creator', this.unregisterByCreator.bind(this));

        // --------- On-event APIs ------------------
        this.router.patch('/:eventId/next', this.nextStageEvent.bind(this));

        this.router.post('/:eventId/start', this.startEvent.bind(this));
        this.router.post('/:eventId/end', this.endEvent.bind(this));
        this.router.post('/:eventId/startattendanceperiod', this.startAttendancePeriod.bind(this));
        this.router.post('/:eventId/endattendanceperiod', this.endAttendancePeriod.bind(this));
        this.router.patch('/:eventId/editattendanceperiod', this.editAttendancePeriod.bind(this));

        // --------- Check attendance by QR code ------------------
        this.router.get('/:eventId/code', this.getQRCode.bind(this));
        this.router.post('/:eventId/code/verify', this.verifyQRCode.bind(this));
        this.router.post('/:eventId/check-attendance', this.checkAttendanceByQRCode.bind(this));
        // Get List of User have checked attendance
        this.router.get('/:eventId/attendance/nthcheck', this.getNthCheckAttendee.bind(this))

        // --------- Post-even API ------------------
        // Fixed by Kiet
        this.router.get('/:eventId/participant', this.getListOfParticipants.bind(this));
        this.router.get('/:eventId/confirm', this.getEventReportInformation.bind(this));
        this.router.get(
            '/:eventId/confirm/participant',
            this.getListOfParticipantsToConfirm.bind(this),
        );
        this.router.patch(
            '/:eventId/socialday/:participantId',
            this.updateSocialDayForParticipant.bind(this),
        );
        this.router.patch('/:eventId/confirm/leader', this.submitReportByLeader.bind(this));
        this.router.patch('/:eventId/confirm/creator', this.submitReportByCreator.bind(this));
        this.router.patch('/:eventId/confirm/censor', this.confirmReportByCensor.bind(this));
    }

    async createEvent(req: Request, res: Response) {
        const userId = req.tokenMeta.userId
        const eventInformation = _.pick(req.body, INFORMATION_FIELDS)

        try {
            await checkUserIsCreator(userId, this.userService)
            
            const eventId = await this.eventService.createEvent(eventInformation, userId)
            await this.userService.addCreatedEvent(userId, eventId)
            res.composer.success(eventId)
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async editEvent(req: Request, res: Response) {
        const userId = req.tokenMeta.userId

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId)
            const event = (await this.eventService.findById(eventId)) as Event;
            checkEventNotNull(event)
            checkUserCreatedEvent(userId, event)
            checkEventInPreparation(event)
            checkEventNotFinished(event)

            res.composer.success(await this.eventService.editEvent(eventId, req.body))
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async deleteEvent(req: Request, res: Response) {
        const userId = req.tokenMeta.userId

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId)
            const event = (await this.eventService.findById(eventId)) as Event;
            checkEventNotNull(event)
            checkUserCreatedEvent(userId, event)
            checkEventInPreparation(event)

            await this.eventService.deleteEvent(eventId)
            await this.userService.removeCreatedEvent(userId, eventId)
            
            // cancel any start event
            await this.taskSchedulingService.cancelEvent({
                "name" : JobType.START_EVENT,
                "data.eventId": eventId
            })

            res.composer.success(eventId);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }
    
    async addAttendancePeriod(req: Request, res: Response) {
        const { userId } = req.tokenMeta
        const startTime = req.body.checkStart
        const endTime = req.body.checkEnd
        const title = req.body.title

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId)
            const event = (await this.eventService.findEvents({_id: eventId},
                           false, false, false, false))[0] as Event

            checkEventNotNull(event)
            await checkUserIsCreator(userId, this.userService)
            checkUserCreatedEvent(userId, event)
            
            res.composer.success(await this.eventService.addAttendancePeriod(eventId, title, startTime, endTime))
        } catch(error) {
            res.composer.badRequest(error.message)
        }
    }
    
    async removeAttendancePeriod(req: Request, res: Response) {
        const {userId} = req.tokenMeta
        const index = req.body.index

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId)
            const event = (await this.eventService.findEvents({_id: eventId},
                           false, false, false, false))[0] as Event
            
            checkEventNotNull(event)
            await checkUserIsCreator(userId, this.userService)
            checkUserCreatedEvent(userId, event)
            
            res.composer.success(await this.eventService.removeAttendancePeriod(eventId, index))
        } catch(error) {
            res.composer.badRequest(error.message)
        }
    }
    
    async editAttendancePeriod(req: Request, res: Response) {
        const {userId} = req.tokenMeta
        const index = req.body.index
        const data = req.body.updatedPeriod
        
        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId)
            const event = (await this.eventService.findEvents({_id: eventId},
                           false, false, false, false))[0] as Event
            
            checkEventNotNull(event)
            await checkUserIsCreator(userId, this.userService)
            checkUserCreatedEvent(userId, event)
            
            res.composer.success(await this.eventService.editAttendancePeriod(eventId, index, data))
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error)
        }
    }

    async getOpenEvents(req: Request, res: Response) {
        const { userId } = req.tokenMeta;

        try {
            var query: any = await this.eventService.validateQuery(req.query);
            query['eventState'] = EventState.prepare;
            query['participant.userId'] = { $nin: [userId] };
            
            var events: Event[] = await this.eventService.findEvents(query);
            var result: OpenEventDto[] = await Promise.all(
                events.map(async (event: any) => {
                    return await this.mapperService.toOpenEventDto(event);
                }),
            );
            res.composer.success(result);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getOpenEventById(req: Request, res: Response) {
        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (await this.eventService.findEvents({ _id: eventId }))[0] as Event;
            checkEventNotNull(event)

            res.composer.success((await this.mapperService.toOpenEventByIdDto(event)) as OpenEventByIdDto)
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async getCreatedEvents(req: Request, res: Response) {
        const {userId} = req.tokenMeta
        try {
            await checkUserIsCreator(userId, this.userService)
            
            var query: any = await this.eventService.validateQuery(req.query);
            query['userCreated'] = userId;
            const events = (await this.eventService.findEvents(
                query,
                false,
                false,
                true,
            )) as Event[];

            let result = await Promise.all(events.map(async (event) => {
                let dto = await this.mapperService.toCreatedEventDto(event)
                
                let participants = await Promise.all(event.participant.map(async (user) => {
                    const fullUser = await this.userService.findOne({ _id: user.userId })
                    return {
                        _id: fullUser._id,
                        profilePicture: fullUser.profilePicture,
                        name: fullUser.name,
                        roleName: user.roleName
                    }
                }))
                dto.participant = participants
                return dto
            }))

            res.composer.success(result);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async getCreatedEventById(req: Request, res: Response) {
        const userId = req.tokenMeta.userId

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId)
            const event = (
                await this.eventService.findEvents(
                    { _id: eventId, userCreated: userId },
                    false,
                    false,
                    true,
                )
            )[0] as Event;

            await checkUserIsCreator(userId, this.userService)
            checkEventNotNull(event)

            let result = await this.mapperService.toCreatedEventById(event)

            let participants = await Promise.all(event.participant.map(async (user) => {
                const fullUser = await this.userService.findOne({ _id: user.userId })
                return {
                    _id: fullUser._id,
                    profilePicture: fullUser.profilePicture,
                    name: fullUser.name,
                    roleName: user.roleName
                }
            }))
            result.participant = participants

            res.composer.success(result);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async getWaitingEvents(req: Request, res: Response) {
        const { userId } = req.tokenMeta;

        try {
            await checkUserIsCensor(userId, this.userService)

            var query: any = await this.eventService.validateQuery(req.query);
            query['verifyStatus'] = VerifiedState.waiting;
            const events = await this.eventService.findEvents(query, false);
            const result: WaitingEventDto[] = await Promise.all(
                events.map(async (event: any) => {
                    return await this.mapperService.toWaitingEventDto(event);
                }),
            );
            res.composer.success(result);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getWaitingEventById(req: Request, res: Response) {
        const { userId } = req.tokenMeta;

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (
                await this.eventService.findEvents({
                        _id: eventId,
                        verifyStatus: VerifiedState.waiting,
                    }, false,
                )
            )[0] as Event;

            await checkUserIsCensor(userId, this.userService)
            checkEventNotNull(event)

            const result: WaitingEventByIdDto = await this.mapperService.toWaitingEventByIdDto(
                event,
            );
            res.composer.success(result);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async getParticipatedEvents(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;
            var query: any = await this.eventService.validateQuery(req.query);
            query['participant.userId'] = userId;
            const events = (await this.eventService.findEvents(query, false)) as Event[];
            let result = await Promise.all(events.map(async (event) => {
                let dto = await this.mapperService.toParticipatedEventDto(event, userId)
                const canViewParticipant = event.participantRole.some(role => {
                    return role.registerList.some(user => user.equals(userId)) &&
                           (role.eventPermission.includes(EventPermission.leader) || role.eventPermission.includes(EventPermission.scanner))
                })
                if (canViewParticipant) {
                    let participants = await Promise.all(event.participant.map(async (user) => {
                        const fullUser = await this.userService.findOne({ _id: user.userId })
                        return {
                            _id: fullUser._id,
                            profilePicture: fullUser.profilePicture,
                            name: fullUser.name,
                            roleName: user.roleName
                        }
                    }))
                    dto.participant = participants
                }
                return dto
            }))
            res.composer.success(result);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async getParticipatedEventById(req: Request, res: Response) {
        const { userId } = req.tokenMeta;

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (
                await this.eventService.findEvents(
                    { _id: eventId, 'participant.userId': userId },
                    false,
                )
            )[0] as Event;

            checkEventNotNull(event)

            let result = await this.mapperService.toParticipatedEventById(event, userId)
            const canViewParticipant = event.participantRole.some(role => {
                return role.registerList.some(user => user.equals(userId)) &&
                       (role.eventPermission.includes(EventPermission.leader) || role.eventPermission.includes(EventPermission.scanner))
            })
            if (canViewParticipant) {
                let participants = await Promise.all(event.participant.map(async (user) => {
                    const fullUser = await this.userService.findOne({ _id: user.userId })
                    return {
                        _id: fullUser._id,
                        profilePicture: fullUser.profilePicture,
                        name: fullUser.name,
                        roleName: user.roleName
                    }
                }))
                result.participant = participants
            }

            res.composer.success(result);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async getVerifiedEvents(req: Request, res: Response) {
        const { userId } = req.tokenMeta;

        try {
            await checkUserIsCensor(userId, this.userService)

            var query: any = await this.eventService.validateQuery(req.query);
            query['verifiedBy'] = userId;
            const events = (await this.eventService.findEvents(query, false)) as Event[];
            var result: VerifiedEventDto[] = await Promise.all(
                events.map(async (event: any) => {
                    return await this.mapperService.toVerifiedEventDto(event);
                }),
            );
            res.composer.success(result);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async getVerifiedEventById(req: Request, res: Response) {
        const { userId } = req.tokenMeta;

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (
                await this.eventService.findEvents({ _id: eventId, verifiedBy: userId }, false)
            )[0] as Event;

            await checkUserIsCensor(userId, this.userService)
            checkEventNotNull(event)

            const result: VerifiedEventByIdDto = await this.mapperService.toVerifiedEventById(
                event,
            );
            res.composer.success(result);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async getByKeyword(req: Request, res: Response) {
        const { keyword } = req.query

        try {
            const events = await this.eventService.findEvents({
                $text: { $search: keyword },
            });
            res.composer.success(events);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async addRole(req: Request, res: Response) {
        const { userId } = req.tokenMeta;

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (await this.eventService.findById(eventId)) as Event;
            checkEventNotNull(event)
            checkUserCreatedEvent(userId, event)
            checkEventInPreparation(event)
            checkEventNotFinished(event)
            
            res.composer.success(await this.eventService.addRole(eventId, req.body.participantRole))
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async editRole(req: Request, res: Response) {
        const userId = req.tokenMeta.userId
        const updatedRole = req.body.updatedRole

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId)
            const event = (await this.eventService.findById(eventId)) as Event;
            checkEventNotNull(event)
            checkUserCreatedEvent(userId, event)
            checkEventInPreparation(event)
            checkEventNotFinished(event)

            res.composer.success(await this.eventService.editRole(eventId, updatedRole))
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async deleteRole(req: Request, res: Response) {
        const roleId = req.body.roleId
        const {userId} = req.tokenMeta

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId)
            const event = (await this.eventService.findById(eventId)) as Event;
            checkEventNotNull(event)
            checkUserCreatedEvent(userId, event)
            checkEventInPreparation(event)
            checkEventNotFinished(event)
            
            res.composer.success(await this.eventService.deleteRole(eventId, roleId))
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async requestVerify(req: Request, res: Response) {
        const { userId } = req.tokenMeta;

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (await this.eventService.findById(eventId)) as Event;
            checkEventNotNull(event)
            checkUserCreatedEvent(userId, event)
            checkEventVerifyStateIs(event, [VerifiedState.preparing, VerifiedState.failed],
                                       `Cannot request verify, invalid verify state: ${event.verifyStatus}`)

            let affectedCount = await this.eventService.updateOne(eventId, {
                verifyStatus: VerifiedState.waiting,
                submitAt: Date.now(),
            });
            let censorList: any[] = await this.userService.find({ role: { $in: [Role.Censor] } });
            censorList = _.map(censorList, '_id');
            await this.notiService.sendNotifications(
                censorList,
                {
                    title: 'A new event needs to be verified',
                    message: `A new Event - ${event.information.title} - needs to be verified`,
                    refName: RefName.VERIFY_EVENT,
                    refId: eventId,
                },
                RefIdType.EVENT,
            );
            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async verifyEvent(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        const { verifyStatus, verifiedMessage } = req.body;

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (await this.eventService.findById(eventId)) as Event;
            await checkUserIsCensor(userId, this.userService)
            checkEventNotNull(event)
            checkEventVerifyStateIs(event, [VerifiedState.waiting], `Can only verify if event is pending`)

            if (verifyStatus != VerifiedState.successful && verifyStatus != VerifiedState.failed) {
                throw new Error('verifyStatus should be SUCCESSFUL or FAILED');
            }

            const affectedCount = await this.eventService.updateOne(eventId, {
                verifyStatus: verifyStatus,
                verifiedAt: Date.now(),
                verifiedBy: userId,
                verifiedMessage: verifiedMessage,
            });
            await this.notiService.sendNotifications([event.userCreated], {
                title: `Event is ${
                    verifyStatus == VerifiedState.successful ? 'Verified' : 'Rejected'
                }`,
                message: `Your Event - ${event.information.title} - is verified as ${verifyStatus}`,
                refId: eventId,
                refName:
                    verifyStatus == VerifiedState.successful
                        ? RefName.VERIFY_SUCCESS
                        : RefName.VERIFY_FAIL,
            });
            await this.userService.addVerifiedEvent(userId, eventId);
            
            // queue up event start
            await this.taskSchedulingService.addStartEvent(event.information.eventStart, {
                eventId: eventId
            })

            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }
    
    /**
     * Helper function that adds a user to an event
     * Assumes that all validity checks have been performed
     * Throws an error if the adding process goes wrong (it probably won't :P)
     * @param userId ID of user to be added
     * @param eventId ID of the event
     * @param roleId Role to assign to user
     * @returns A promise of the number of documents changed
     */
    async register_user_to_event(userId: ObjectID, eventId: ObjectID, roleId: number) {
        const event = (await this.eventService.findEvents({ _id: eventId }, false, false, false))[0] as Event;
        
        let idx = -1
        for (let [i, role] of event.participantRole.entries()) {
            if (role.roleId === roleId) {
                idx = i
            }
        }
        
        let roleInfo = event.participantRole[idx]
        await this.eventService.registerEvent(eventId, {
            userId: userId,
            roleId: roleId,
            roleName: roleInfo.roleName,
            registerAt: Date.now(),
            code: '',
            socialDay: 0, // Default is 0 when a new user registers
            note: '',
        })
        return await this.userService.registerEvent(userId, {
            eventId: eventId,
            eventPermission: roleInfo.eventPermission,
            socialDay: 0,
            roleId: roleId,
            roleName: roleInfo.roleName,
        })
    }
    
    /**
     * Helper function that removes a user from an event
     * Assumes that all validity checks have been made
     * @param userId ID of user to be removed
     * @param eventId ID of the event
     * @returns A promise of the number of documents changed
     */
    async unregister_user_from_event(userId: ObjectID, eventId: ObjectID) {
        const event = (await this.eventService.findById(eventId)) as Event
        
        const roleId = _.find(event.participant, (person: any) => person.userId.equals(userId)).roleId
        let idx = -1
        for (let [i, role] of event.participantRole.entries()) {
            if (role.roleId === roleId) {
                idx = i
            }
        }
        
        event.participantRole[idx].registerList = event.participantRole[idx].registerList.filter(person => !person.equals(userId))
        event.participant = event.participant.filter(person => !person.userId.equals(userId))

        await this.userService.unregisterEvent(userId, eventId)
        return await this.eventService.updateOne(eventId, {
            participant: event.participant,
            participantRole: event.participantRole
        })
    }

    async registerEvent(req: Request, res: Response) {
        let { userId } = req.tokenMeta;
        const { roleId } = req.body;

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (await this.eventService.findEvents({ _id: eventId }, false, false, false))[0] as Event;

            checkEventNotNull(event)
            checkEventInFormPeriod(event)
            checkEventStateIs(event, [EventState.prepare])
            checkEventVerifyStateIs(event, [VerifiedState.successful])
            checkUserDidNotCreateEvent(userId, event)
            checkUserDidNotRegisterEvent(userId, event)
            
            checkEventHasRole(event, roleId)
            checkEventRolePublic(event, roleId)
            checkRoleNotAtRegisterLimit(event, roleId)

            res.composer.success(await this.register_user_to_event(userId, eventId, roleId))
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async unregisterEvent(req: Request, res: Response) {
        const { userId } = req.tokenMeta;

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (await this.eventService.findById(eventId)) as Event;
            
            checkEventNotNull(event)
            checkEventInFormPeriod(event)
            checkEventStateIs(event, [EventState.prepare])
            checkUserRegisterEvent(userId, event)

            res.composer.success(await this.unregister_user_from_event(userId, eventId))
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async registerByCreator(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        const { roleId } = req.body;

        try {
            const userRegister = ObjectID.createFromHexString(req.body.userRegister);
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (await this.eventService.findById(eventId)) as Event;
            
            // first validate for creator
            checkEventNotNull(event)
            checkUserCreatedEvent(userId, event)
            checkEventVerifyStateIs(event, [VerifiedState.successful])
            checkEventNotFinished(event)
            
            // ...then a validate for the user
            if (userRegister.equals(userId)) {
                throw new ErrorUserInvalid(`Can't register to an event that you created`)
            }
            checkUserDidNotRegisterEvent(userRegister, event)
            checkEventHasRole(event, roleId)
            checkRoleNotAtRegisterLimit(event, roleId)

            res.composer.success(await this.register_user_to_event(userRegister, eventId, roleId))
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async unregisterByCreator(req: Request, res: Response) {
        const { userId } = req.tokenMeta;

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const userRegister = ObjectID.createFromHexString(req.body.userRegister);
            const event = (await this.eventService.findById(eventId)) as Event;
            
            // first validate for creator
            checkEventNotNull(event)
            checkUserCreatedEvent(userId, event)
            checkEventVerifyStateIs(event, [VerifiedState.successful])
            checkEventNotFinished(event)
            
            // ...then validate the user
            checkUserRegisterEvent(userRegister, event)
            
            res.composer.success(await this.unregister_user_from_event(userRegister, eventId))
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async nextStageEvent(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;
            const eventId = ObjectID.createFromHexString(req.params.eventId);

            const event = (
                await this.eventService.findEvents(
                    {
                        _id: eventId,
                        $or: [
                            {
                                participantRole: {
                                    $elemMatch: {
                                        eventPermission: { $in: [EventPermission.leader] },
                                        registerList: { $in: [userId] },
                                    },
                                },
                            },
                            { userCreated: userId },
                        ],
                    },
                    false,
                    false,
                    false,
                )
            )[0] as Event;
            checkEventNotNull(event)
            checkEventNotFinished(event)

            var affectedCount: number;
            switch (event.eventState) {
                // Start Event
                case EventState.prepare: {
                    affectedCount = await this.eventService.updateOne(eventId, {
                        eventStart: Date.now(),
                        eventState: EventState.start,
                    });
                    break;
                }
                // Start 1st Check
                case EventState.start: {
                    const iv = crypto.randomBytes(16);
                    await event.participant.forEach((Element: any) => {
                        const userId = Element.userId;
                        let qrCode = JSON.stringify({
                            eventId: eventId,
                            userId: userId,
                        });
                        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
                        const encrypted = Buffer.concat([
                            cipher.update(qrCode),
                            cipher.final(),
                        ]);
                        Element.code = encrypted.toString('hex');
                    });

                    affectedCount = await this.eventService.updateOne(eventId, {
                        firstCheck: Date.now(),
                        ivFirstCheck: iv.toString('hex'),
                        eventState: EventState.firstCheck,
                        participant: event.participant,
                    });
                    break;
                }
                // End 1st Check
                case EventState.firstCheck: {
                    await event.participant.forEach((Element: any) => {
                        Element.code = '';
                    });

                    affectedCount = await this.eventService.updateOne(eventId, {
                        endFirstCheck: Date.now(),
                        eventState: EventState.endFirstCheck,
                        participant: event.participant,
                    });
                    break;
                }
                // Start 2nd Check
                case EventState.endFirstCheck: {
                    const iv = crypto.randomBytes(16);
                    await event.participant.forEach((Element: any) => {
                        const userId = Element.userId;
                        let qrCode = JSON.stringify({
                            eventId: eventId,
                            userId: userId,
                        });
                        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
                        const encrypted = Buffer.concat([
                            cipher.update(qrCode),
                            cipher.final(),
                        ]);
                        Element.code = encrypted.toString('hex');
                    });

                    affectedCount = await this.eventService.updateOne(eventId, {
                        secondCheck: Date.now(),
                        ivSecondCheck: iv.toString('hex'),
                        eventState: EventState.secondCheck,
                        participant: event.participant,
                    });
                    break;
                }
                // End 2nd Check
                case EventState.secondCheck: {
                    await event.participant.forEach((Element: any) => {
                        Element.code = '';
                    });

                    affectedCount = await this.eventService.updateOne(eventId, {
                        endSecondCheck: Date.now(),
                        eventState: EventState.endSecondCheck,
                        participant: event.participant,
                    });
                    break;
                }
                // End Event and update social days for user that successfully check twice
                case EventState.endSecondCheck: {
                    await event.participant.forEach((Element: any) => {
                        if (
                            (Element.firstCheck > 0 && Element.secondCheck > 0) ||
                            event.participantRole[Element.roleId].eventPermission.includes(
                                EventPermission.leader,
                            ) ||
                            event.participantRole[Element.roleId].eventPermission.includes(
                                EventPermission.scanner,
                            )
                        ) {
                            Element.socialDay = event.participantRole[Element.roleId].socialDay;
                        }
                    });

                    affectedCount = await this.eventService.updateOne(eventId, {
                        eventEnd: Date.now(),
                        eventState: EventState.finish,
                        participant: event.participant,
                    });
                    break;
                }
            }
            res.composer.success(affectedCount);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async startEvent(req: Request, res: Response) {
        const { userId } = req.tokenMeta;

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (await this.eventService.findById(eventId)) as Event;
            checkEventNotNull(event)
            checkEventStateIs(event, [EventState.prepare])
            checkUserCanStartEvent(userId, event)

            const affectedCount = await this.eventService.updateOne(eventId, {
                eventStart: Date.now(),
                eventState: EventState.start,
            });
            const participantList = _.map(event.participant, 'userId');
            const dataNotification = {
                title: 'EVENT HAS STARTED',
                message: `The Event ${event.information.title} has just started`,
                refName: RefName.EVENT_START,
            };
            await this.notiService.sendNotifications(
                participantList,
                dataNotification,
                RefIdType.USER,
            );
            await this.notiService.sendNotifications([event.userCreated], {
                ...dataNotification,
                refId: eventId,
            });
            
            // Since we're starting manually, delete all starting events
            // Also queue first attedance period and end event
            await this.taskSchedulingService.cancelEvent({
                "name": JobType.START_EVENT,
                "data.eventId": eventId
            })
            await this.taskSchedulingService.addEndEvent(event.information.eventEnd, {
                eventId: eventId
            })
            if (event.attendancePeriods.length > 0) {
                await this.taskSchedulingService.addStartAttendance(event.attendancePeriods[0].checkStart, {
                    eventId: eventId,
                    index: 0
                })
            }

            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async endEvent(req: Request, res: Response) {
        const { userId } = req.tokenMeta;

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (await this.eventService.findById(eventId)) as Event;
            checkEventNotNull(event)
            checkEventStateIs(event, [EventState.endSecondCheck])
            checkUserCanStartEvent(userId, event)
            
            event.participant.forEach((Element: any) => {
                if (
                    (Element.firstCheck > 0 && Element.secondCheck > 0) ||
                    event.participantRole[Element.roleId].eventPermission.includes(
                        EventPermission.leader,
                    ) ||
                    event.participantRole[Element.roleId].eventPermission.includes(
                        EventPermission.scanner,
                    )
                ) {
                    Element.socialDay = event.participantRole[Element.roleId].socialDay;
                }
            });
                
            const affectedCount = await this.eventService.updateOne(eventId, {
                eventEnd: Date.now(),
                eventState: EventState.finish,
                participant: event.participant,
            });
            const participantList = _.map(event.participant, 'userId');
            const dataNotification = {
                title: 'EVENT HAS FINISHED',
                message: `The Event ${event.information.title} has just completed`,
                refName: RefName.EVENT_END,
            };
            await this.notiService.sendNotifications(
                participantList,
                dataNotification,
                RefIdType.USER,
            );
            await this.notiService.sendNotifications([event.userCreated], {
                ...dataNotification,
                refId: eventId,
            });
            
            // since we're ending manually, cancel all ending events
            await this.taskSchedulingService.cancelEvent({
                "name": JobType.END_EVENT,
                "data.eventId": eventId
            })

            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }
    
    async startAttendancePeriod(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        const { periodId } = req.body
        
        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (await this.eventService.findById(eventId)) as Event;
            checkEventNotNull(event)
            checkEventStateIs(event, [EventState.start])
            checkUserCanStartEvent(userId, event)
            checkEventHasAttendancePeriod(event, periodId)
            
            const affectedCount = await this.eventService.startAttendancePeriod(eventId, periodId)

            const participantList = _.map(event.participant, 'userId');
            const dataNotification = {
                title: 'FIRST CHECK ATTENDANCE HAS STARTED',
                message: `The Event ${event.information.title} has just started the first attendance checking`,
                refName: RefName.EVENT_START_FIRST_CHECK,
            };
            await this.notiService.sendNotifications(
                participantList,
                dataNotification,
                RefIdType.USER,
            );
            await this.notiService.sendNotifications([event.userCreated], {
                ...dataNotification,
                refId: eventId,
            });
            
            // since we're starting manually, cancel all starting events
            // also queue ending event
            await this.taskSchedulingService.cancelEvent({
                "name": JobType.START_ATTENDANCE,
                "data.eventId": eventId
            })
            await this.taskSchedulingService.addEndAttendance(event.attendancePeriods[periodId].checkEnd, {
                eventId: eventId,
                index: periodId
            })

            res.composer.success(affectedCount);
        } catch (error) {
            console.log(error)
            res.composer.badRequest(error)
        }
    }
    
    async endAttendancePeriod(req: Request, res: Response) {
        const { userId } = req.tokenMeta
        const { index } = req.body
        
        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (await this.eventService.findById(eventId)) as Event;
            checkEventNotNull(event)
            checkEventStateIs(event, [EventState.firstCheck])
            checkUserCanStartEvent(userId, event)
            checkEventHasAttendancePeriod(event, index)
            
            const affectedCount = await this.eventService.endAttendancePeriod(eventId, index)

            const participantList = _.map(event.participant, 'userId');
            const dataNotification = {
                title: 'FIRST CHECK ATTENDANCE HAS CLOSED',
                message: `The Event ${event.information.title} has just closed the first attendance checking`,
                refName: RefName.EVENT_END_FIRST_CHECK,
            };
            await this.notiService.sendNotifications(
                participantList,
                dataNotification,
                RefIdType.USER,
            );
            await this.notiService.sendNotifications([event.userCreated], {
                ...dataNotification,
                refId: eventId,
            });
            
            // since we're ending manually, cancel all closing events
            // also queue next starting event (if it exists)
            await this.taskSchedulingService.cancelEvent({
                "name": JobType.END_ATTENDANCE,
                "data.eventId": eventId
            })
            if (index < event.attendancePeriods.length - 1) {
                await this.taskSchedulingService.addStartAttendance(event.attendancePeriods[index + 1].checkStart, {
                    eventId: eventId,
                    index: index + 1
                })
            }

            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error)
        }
    }

    async getQRCode(req: Request, res: Response) {
        const { userId } = req.tokenMeta;

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (
                await this.eventService.findEvents({
                    _id: eventId,
                    'participant.userId': userId,
                }, false)
            )[0] as Event;

            checkEventNotNull(event)

            let result = ""
            for (let i = 0; i < event.participant.length; i++) {
                if (event.participant[i].userId.equals(userId)) result = event.participant[i].code;
            }
            res.composer.success(result);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async verifyQRCode(req: Request, res: Response) {
        const { userId } = req.tokenMeta;

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (
                await this.eventService.findEvents(
                    {
                        _id: eventId,
                        participantRole: {
                            $elemMatch: {
                                eventPermission: { $in: [EventPermission.scanner] },
                                registerList: { $in: [userId] },
                            },
                        },
                    },
                    false,
                    false,
                    true,
                )
            )[0] as Event;

            checkEventNotNull(event)
            checkEventInAttendancePeriod(event)

            var userInformation: any = await Promise.all(
                _.filter(event.participant, function (currentObject) {
                    return currentObject.code == req.body.code;
                }),
            );
            if (userInformation.length == 0) throw new Error('QR Code not found');
            if (
                (event.eventState == EventState.firstCheck && userInformation[0].firstCheck > 0) ||
                (event.eventState == EventState.secondCheck && userInformation[0].secondCheck > 0)
            )
                throw new Error('User has already checked');

            const result = {
                ..._.pick(userInformation[0].userInfo, ['_id', 'profilePicture', 'name']),
                roleName: userInformation[0].roleName,
            };
            res.composer.success(result);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async checkAttendanceByQRCode(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (
                await this.eventService.findEvents(
                    {
                        _id: eventId,
                        participantRole: {
                            $elemMatch: {
                                eventPermission: { $in: [EventPermission.scanner] },
                                registerList: { $in: [userId] },
                            },
                        },
                    },
                    false,
                    false,
                    false,
                )
            )[0] as Event;
            checkEventNotNull(event)
            checkEventInAttendancePeriod(event)

            const affectedCount = await this.eventService.checkAttendance(eventId, req.body.code);

            function indexToText(s: number): string {
                if (s === 0) return "1st"
                else if (s === 1) return "2nd"
                else if (s === 2) return "3rd"
                return `${s + 1}th`
            }
            await this.notiService.sendNotifications([affectedCount.userId], {
                title: 'SUCCESSFULLY CHECKED ATTENDANCE',
                message: `You have checked in for the ${indexToText(event.currentAttendancePeriod)} attendance period of the event`,
                refName: RefName.CHECK_SUCCESS,
                refId: eventId,
            });

            res.composer.success(affectedCount.nModified);
        } catch (error) {
            console.log(error.message)
            res.composer.badRequest(error.message);
        }
    }
    
    async getNthCheckAttendee(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta
            const index = parseInt(req.query.index as string)
            const eventId = ObjectID.createFromHexString(req.params.eventId)
            
            const event = await this.eventService.findById(eventId)
            // Can call this API if you created this event or participated in it as leader or scanner
            
            let canCallApi = event.userCreated.equals(userId)
            canCallApi = canCallApi || event.participantRole.some(role => {
                return (role.eventPermission.includes(EventPermission.leader) || role.eventPermission.includes(EventPermission.scanner)) &&
                       role.registerList.some(user => user.equals(userId))
            })
            
            if (!canCallApi) {
                throw new Error("You need to be the creator of this event or participate as a leader or scanner to perform this action")
            }
            
            if (index < 0 || index >= event.attendancePeriods.length) {
                throw new Error("Requested attendance period doesn't exist")
            }
            
            const a = _.filter(event.participant, (u) => {
                return event.attendancePeriods[index].checkedParticipants.some(ou => ou.equals(u.userId))
            })

            const result: CheckAttendanceAttendeeDto[] = await Promise.all(a.map(async (dto) => {
                const id = dto.userId
                const fullUser = await this.userService.findOne({ _id: id })
                return {
                    _id: id,
                    profilePicture: fullUser.profilePicture,
                    name: fullUser.name,
                    roleName: dto.roleName
                }
            }))
            
            res.composer.success(result)
        } catch(error) {
            console.log(error.message)
            res.composer.badRequest(error.message)
        }
    }

    async getEventReport(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = await this.eventService.getEventIfPermissionTrue(eventId, userId, [EventPermission.leader]);
            
            checkEventNotNull(event)
            checkEventStateIs(event, [EventState.finish])
            res.composer.success(event)
        } catch (error) {
            res.composer.badRequest(error)
        }
    }

    async submitEventReport(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const participantList: Event['participant'] = req.body.participant;
            const event = await this.eventService.getEventIfPermissionTrue(eventId, userId, [
                EventPermission.leader,
            ]);

            checkEventNotNull(event)
            checkEventStateIs(event, [EventState.finish])

            const reportLastSubmitAt = Date.now();
            let pList = event.participant.map((user) => {
                const p = participantList.find((participant, idx: Number) =>
                    user.userId.equals(participant.userId),
                );
                user.socialDay = p.socialDay;
                return user;
            });
            const nModified = await this.eventService.updateOne(eventId, {
                reportLastSubmitAt,
                reportSubmitBy: userId,
                participant: pList,
            });
            res.composer.success({nModified, reportLastSubmitAt});
        } catch (error) {
            res.composer.badRequest(error);
        }
    }

    async getEventInformationToConfirm(req: Request, res: Response) {
        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (
                await this.eventService.findEvents({ _id: eventId }, false, true, true)
            )[0] as Event;
            checkEventNotNull(event)

            res.composer.success(event);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async getEventReportInformation(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            var event = (await this.eventService.findById(eventId)) as Event;
            var populateLeaderConfirm: boolean = event.leaderConfirmAt == 0 ? false : true;
            event = (
                await this.eventService.findEvents(
                    {
                        _id: eventId,
                        $or: [
                            {
                                participantRole: {
                                    $elemMatch: {
                                        eventPermission: {
                                            $in: [EventPermission.leader],
                                        },
                                        registerList: { $in: [userId] },
                                    },
                                },
                            },
                            { userCreated: userId },
                            { verifiedBy: userId },
                        ],
                    },
                    false,
                    true,
                    false,
                    populateLeaderConfirm,
                    true,
                )
            )[0] as any;
            
            checkEventNotNull(event)

            const result: ConfirmInformationDto = await this.mapperService.toConfirmInformationDto(
                event,
            );
            res.composer.success(result);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async getListOfParticipants(req: Request, res: Response) {
        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (
                await this.eventService.findEvents({ _id: eventId }, false, false, true)
            )[0] as Event;
            
            checkEventNotNull(event)

            var result: ParticipantDto[] = await Promise.all(
                event.participant.map(async (participant: any) => {
                    var p: ParticipantDto = {
                        ..._.pick(participant.userInfo, ['_id', 'profilePicture', 'name']),
                        roleName: participant.roleName,
                    };
                    return p;
                }),
            );
            res.composer.success(result);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getListOfParticipantsToConfirm(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (
                await this.eventService.findEvents(
                    {
                        _id: eventId,
                        $or: [
                            {
                                participantRole: {
                                    $elemMatch: {
                                        eventPermission: {
                                            $in: [EventPermission.leader],
                                        },
                                        registerList: { $in: [userId] },
                                    },
                                },
                            },
                            { userCreated: userId },
                            { verifiedBy: userId },
                        ],
                    },
                    false,
                    false,
                    true,
                )
            )[0] as Event;
            
            checkEventNotNull(event)

            var participantList: ParticipantDto[] = await Promise.all(
                event.participant.map(async (participant: any) => {
                    var p: ParticipantDto = {
                        ..._.pick(participant.userInfo, ['_id', 'profilePicture', 'name']),
                        ..._.pick(participant, [
                            'roleName',
                            'socialDay',
                            'firstCheck',
                            'secondCheck',
                        ]),
                    };
                    return p;
                }),
            );
            var result: any = {
                ..._.pick(event, ['creatorConfirmAt', 'censorConfirmAt']),
                participant: participantList,
            };
            res.composer.success(result);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async confirmReport(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = await this.eventService.getEventIfCreator(eventId, userId);
            
            checkEventNotNull(event)
            checkEventStateIs(event, [EventState.finish])

            const eventState = EventState.closing;
            this.eventService.updateOne(eventId, {eventState});
            res.composer.success('Event closed');
        } catch (error) {
            res.composer.badRequest(error);
        }
    }

    async submitReportByLeader(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (
                await this.eventService.findEvents(
                    {
                        _id: eventId,
                        participantRole: {
                            $elemMatch: {
                                eventPermission: { $in: [EventPermission.leader] },
                                registerList: { $in: [userId] },
                            },
                        },
                    },
                    false,
                    false,
                    false,
                )
            )[0] as Event;
            
            checkEventNotNull(event)
            checkEventStateIs(event, [EventState.finish])
            checkLeaderHasNotConfirmed(event)

            const affectedCount = await this.eventService.updateOne(eventId, {
                leaderConfirm: userId,
                leaderConfirmAt: Date.now(),
                leaderNote: req.body.note != undefined ? req.body.note : '',
            });
            await this.notiService.sendNotifications([event.userCreated], {
                title: 'EVENT HAS BEEN SUBMITTED BY LEADER',
                message: `The Event ${event.information.title} is completed. You need to confirm again and submit to Censor`,
                refName: RefName.SUBMITTED_BY_LEADER,
                refId: eventId,
            });
            res.composer.success(affectedCount);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async updateSocialDayForParticipant(req: Request, res: Response) {
        const { userId } = req.tokenMeta;

        try {
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const participantId = ObjectID.createFromHexString(req.params.participantId);
            const event = (await this.eventService.findById(eventId)) as Event;
            
            if (event.verifiedBy.equals(userId)) {
                checkUserVerifiedEvent(userId, event)
                checkCensorHasNotConfirmed(event)
            } else {
                checkUserCreatedEvent(userId, event)
                checkCensorHasNotConfirmed(event)
            }
            
            const affectedCount = await this.eventService.updateSocialDay(
                eventId,
                participantId,
                req.body.socialDay,
            );
            res.composer.success(affectedCount);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async checkParticipantList(
        participantList: Event['participant'],
        eventId: ObjectID,
    ): Promise<string> {
        const userSer = this.userService;
        var error: string = '';
        for (let i = 0; i < participantList.length; ++i) {
            let Element: any = participantList[i];
            Element.userId = ObjectID.createFromHexString(Element.userId);
            const check = await userSer.checkEventOfUser(Element.userId, eventId);
            if (!check) {
                error = `User ${Element.userId} not exist`;
                return error;
            }
        }
        return error;
    }

    async updateSocialDayParticipantList(
        participantList: Event['participant'],
        eventId: ObjectID,
    ): Promise<string> {
        const userSer = this.userService;
        var error: string = '';
        for (let i = 0; i < participantList.length; ++i) {
            let Element: any = participantList[i];
            const check = await userSer.checkEventOfUser(Element.userId, eventId);
            if (!check) {
                error = `User ${Element.userId} does not have this event on his/her list of participated events`;
                return error;
            }
            await userSer.updateEventParticipated(Element.userId, eventId, Element);
        }
        return error;
    }

    async submitReportByCreator(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (await this.eventService.findById(eventId)) as Event;
                
            checkEventNotNull(event)
            checkUserCreatedEvent(userId, event)
            checkEventStateIs(event, [EventState.finish])
            checkLeaderHasConfirmed(event)
            checkCreatorHasNotConfirmed(event)

            const affectedCount = await this.eventService.updateOne(eventId, {
                creatorConfirmAt: Date.now(),
                creatorNote: req.body.note != undefined ? req.body.note : '',
            });
            await this.notiService.sendNotifications([event.verifiedBy], {
                title: 'EVENT HAS BEEN SUBMITTED BY CREATOR',
                message: `The Event ${event.information.title} is completed. You need to confirm again close the event`,
                refName: RefName.SUBMITTED_BY_CREATOR,
                refId: eventId,
            });
            res.composer.success(affectedCount);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }

    async confirmReportByCensor(req: Request, res: Response) {
        try {
            const { userId } = req.tokenMeta;
            const eventId = ObjectID.createFromHexString(req.params.eventId);
            const event = (await this.eventService.findById(eventId)) as Event;
            
            checkEventNotNull(event)
            checkUserVerifiedEvent(userId, event)
            checkEventStateIs(event, [EventState.finish])
            checkCreatorHasConfirmed(event)
            checkCensorHasNotConfirmed(event)

            const checkParticipantList: string = await this.updateSocialDayParticipantList(
                event.participant,
                eventId,
            );
            if (checkParticipantList != '') throw new Error(checkParticipantList);

            const affectedCount = await this.eventService.updateOne(eventId, {
                censorConfirmAt: Date.now(),
                eventState: EventState.closing,
            });
            const participantList = _.map(event.participant, 'userId');
            await this.notiService.sendNotifications(participantList, {
                title: 'SOCIAL DAYS ARE UPDATED',
                message: `Check your updated social day for he event: ${event.information.title}`,
                refName: RefName.UPDATE_SOCIAL,
                refId: eventId,
            });
            res.composer.success(affectedCount);
        } catch (err) {
            res.composer.badRequest(err.message);
        }
    }
}
