import { injectable, inject } from 'inversify';
import { Collection, ObjectID, ObjectId } from 'mongodb';
import _, { update } from 'lodash';

import { DatabaseService } from './database.service';
import {
    Event,
    fillDefaultEventValue,
    VerifiedState,
    EventState,
    EventPermission,
    INFORMATION_FIELDS,
    fillDefaultParticipantRole,
} from '../models/event.model';
import { ServiceType } from '../types';
import { ErrorInvalidData, ErrorNotFound, ErrorUnauthorized } from '../lib/errors';
import crypto from 'crypto';
import { checkEventInAttendancePeriod, checkEventNotNull, checkTimeInRange } from '../lib/request-validation';

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

@injectable()
export class EventService {
    private eventCollection: Collection;

    constructor(@inject(ServiceType.Database) private dbService: DatabaseService) {
        this.eventCollection = this.dbService.db.collection('events');
        this.setupIndexes();
    }
    
    async updateOne(eventId: ObjectID, data: any) {
        const opUpdateResult = await this.eventCollection.updateOne(
            { _id: eventId },
            { $set: data },
        );
        return opUpdateResult.result.nModified;
    }

    private async setupIndexes() {
        this.eventCollection.createIndex({
            'information.title': 'text',
            'information.description': 'text',
        });
    }

    async count(query: any = {}): Promise<number> {
        return (await this.eventCollection.countDocuments(query)) as any as number;
    }
    
    /**
     * Start an attendance period, and add a QR code into its participants
     * Throws an error if the event is not found,
     * another attendance period is in progress,
     * curent time is not in attendance period,
     * or the requested period is not found
     * @param eventId 
     * @param index 
     * @returns A promise of the number of changed documents
     */
    async startAttendancePeriod(eventId: ObjectID, index: number) {
        const event = (await this.findById(eventId)) as Event
        if (!event) throw new ErrorNotFound("Event not found")
        if (index < 0 || index >= event.attendancePeriods.length) {
            throw new ErrorInvalidData("Requested attendance period doesn't exist")
        }
        if (event.currentAttendancePeriod != -1) {
            throw new ErrorInvalidData("Another attendance period is in progress")
        }
        checkTimeInRange(event.attendancePeriods[index].checkStart, event.attendancePeriods[index].checkEnd)
        
        const iv = crypto.randomBytes(16)
        event.participant.forEach(user => {
            const userId = user.userId
            const qrCode = JSON.stringify({
                eventId: eventId,
                userId: userId
            })
            
            const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
            const encrypted = Buffer.concat([cipher.update(qrCode), cipher.final()])
            user.code = encrypted.toString('hex')
        })
        event.attendancePeriods[index].ivCheck = iv.toString('hex')
        
        return await this.updateOne(eventId, {
            currentAttendancePeriod: index,
            participant: event.participant,
            attendancePeriods: event.attendancePeriods
        })
    }
    
    async endAttendancePeriod(eventId: ObjectID, index: number) {
        const event = (await this.findById(eventId)) as Event
        if (!event) throw new ErrorNotFound("Event not found")
        if (event.currentAttendancePeriod != index) {
            throw new ErrorInvalidData("The requested attendance period has not been started")
        }

        event.participant.forEach((user: any) => {
            user.code = '';
        })
        
        return await this.updateOne(eventId, {
            currentAttendancePeriod: -1,
            participant: event.participant
        })
    }

    /**
     * Checks and returns true if the information fields of an event are valid, and false otherwise 
     * @param event the event to be checked
     * @returns A boolean indicating whether the event is valid or not
     */
    validateEventInformation(event: Event) {
        const good_timestamps = () => {
            return event.information.formStart < event.information.formEnd &&
                   event.information.formEnd < event.information.eventStart &&
                   event.information.eventStart < event.information.eventEnd
        }

        const good_attendance = () => {
            return event.attendancePeriods.every(period => {
                return event.information.eventStart < period.checkStart &&
                       period.checkStart < period.checkEnd &&
                       period.checkEnd < event.information.eventEnd
            })
        }
        
        return good_timestamps() &&
               good_attendance()
    }

    /**
     * Create a new event with the specified information
     * If some fields don't exist, default values will be used
     * Throws an exception if the given information is bad
     * @param eventInformation Information about the event
     * @param userId ID of the the user who created this event
     * @returns ID of the created event
     */
    async createEvent(eventInformation: any, userId: ObjectID) {
        let event: Event = {
            information: _.pick(eventInformation, INFORMATION_FIELDS),
            userCreated: userId,
            participantRole: fillDefaultParticipantRole(),
            verifyStatus: VerifiedState.preparing
        } as Event
        
        event = fillDefaultEventValue(event as Event)
        
        if (!this.validateEventInformation(event)) {
            throw new ErrorInvalidData("Event information is invalid")
        }

        const createdEvent = await this.eventCollection.insertOne(event)
        return createdEvent.ops[0]._id
    }
    
    /**
     * Edit information of an event
     * Throws an exception if the event is not found, updated information fields are empty or invalid
     * @param eventId ID of the event to be edited
     * @param eventInformation updated information about the event
     * @returns A promise that resolves with the number of documents changed
     */
    async editEvent(eventId: ObjectID, eventInformation: any) {
        let event = (await this.findById(eventId)) as Event
        if (!event) {
            throw new ErrorNotFound("Event not found")
        }

        eventInformation = _.pick(eventInformation, INFORMATION_FIELDS)
        if (_.isEmpty(eventInformation)) {
            throw new ErrorInvalidData(`Update fields are empty. Possible fields are ${INFORMATION_FIELDS}`)
        }
        event.information = _.merge(event.information, eventInformation)
        
        if (!this.validateEventInformation(event)) {
            throw new ErrorInvalidData("Updated event information is invalid")
        }
        return await this.updateOne(eventId, {
            information: event.information
        })
    }
    
    /**
     * Delete an event
     * Throws an error if the event is not found
     * @param eventId ID of the event to be deleted
     */
    async deleteEvent(eventId: ObjectID) {
        const event = (await this.findById(eventId)) as Event
        if (!event) {
            throw new ErrorNotFound("Event not found")
        }
        await this.eventCollection.deleteOne({_id: eventId})
    }

    async find(query: any = {}) {
        const events = await this.eventCollection.find(query).toArray();
        return events;
    }

    async validateQuery(data: any): Promise<any> {
        var defaultQuery: any = {};
        var query: any = {};
        if (data.urgent != undefined) {
            if (data.urgent == 1) query['information.isUrgent'] = true;
            if (data.urgent == 0) query['information.isUrgent'] = false;
        }
        return _.defaults(query, defaultQuery);
    }

    async findEvents(
        query: any = {},
        openEvent = true,
        populateCreator = true,
        populatePaticipant = true,
        populateLeaderConfirm = false,
        populateCensor = false,
    ): Promise<Event[]> {
        let aggreateCommand: any[] = [{ $match: query }];
        if (openEvent) aggreateCommand = this.openEventAggregate(aggreateCommand);
        if (populateCreator) aggreateCommand = this.populateCreator(aggreateCommand);
        if (populatePaticipant) aggreateCommand = this.populateParticipant(aggreateCommand);
        if (populateLeaderConfirm) aggreateCommand = this.populateLeaderConfirm(aggreateCommand);
        if (populateCensor) aggreateCommand = this.populateCensor(aggreateCommand);
        aggreateCommand = _.concat(aggreateCommand, [{ $sort: { createdAt: 1 } }]);

        const events = await this.eventCollection.aggregate(aggreateCommand).toArray();
        return events as Event[];
    }

    /**
     * Finds an event by ID
     * @param eventId ID of the requested event
     * @returns A promise of the requested event
     */
    async findById(eventId: ObjectID) {
        const event = (await this.eventCollection.findOne({
            _id: eventId,
        })) as Event;
        return event;
    }

    private populateCreator(aggreateCommand: any) {
        return _.concat(aggreateCommand, [
            {
                $lookup: {
                    from: 'users',
                    localField: 'userCreated',
                    foreignField: '_id',
                    as: 'userCreated',
                },
            },
            { $unwind: '$userCreated' },
            { $unset: ['userCreated.password'] },
        ]);
    }

    private populateCensor(aggreateCommand: any) {
        return _.concat(aggreateCommand, [
            {
                $lookup: {
                    from: 'users',
                    localField: 'verifiedBy',
                    foreignField: '_id',
                    as: 'verifiedBy',
                },
            },
            { $unwind: '$verifiedBy' },
            { $unset: ['verifiedBy.password'] },
        ]);
    }

    private populateLeaderConfirm(aggreateCommand: any) {
        return _.concat(aggreateCommand, [
            {
                $lookup: {
                    from: 'users',
                    localField: 'leaderConfirm',
                    foreignField: '_id',
                    as: 'leaderConfirm',
                },
            },
            { $unwind: '$leaderConfirm' },
            { $unset: ['leaderConfirm.password'] },
        ]);
    }

    private confirmInformation(aggreateCommand: any) {
        return _.concat(aggreateCommand, [{}]);
    }

    private openEventAggregate(aggreateCommand: any) {
        const now = Date.now();
        return _.concat(aggreateCommand, [
            {
                $match: {
                    'information.formStart': { $lt: now },
                    'information.formEnd': { $gt: now },
                    verifyStatus: VerifiedState.successful,
                },
            },
        ]);
    }

    private populateParticipant(aggreateCommand: any) {
        return _.concat(aggreateCommand, [
            {
                $unwind: {
                    path: '$participant',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'participant.userId',
                    foreignField: '_id',
                    as: 'participant.userInfo',
                },
            },
            {
                $unwind: {
                    path: '$participant.userInfo',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    root: { $mergeObjects: '$$ROOT' },
                    participant: { $push: '$participant' },
                },
            },
            { $replaceRoot: { newRoot: { $mergeObjects: ['$root', '$$ROOT'] } } },
            { $project: { root: 0 } },
            { $unset: ['participant.userInfo.password'] },
            {
                $set: {
                    participant: {
                        $cond: [
                            { $eq: [{ $anyElementTrue: ['$participant.userId'] }, true] },
                            '$participant',
                            [],
                        ],
                    },
                },
            },
        ]);
    }

    /**
     * Checks if user does participate in this event as a particular role
     * Throws an error if the event is not found
     * @param userId ID of the user to be checked
     * @param eventId ID of the event to be checked
     * @param permission Permission that we want to for userID
     * @returns A promise of a boolean for the test condition
     */
    async userParticipatesAs(userId: ObjectID, eventId: ObjectID, permission: EventPermission) {
        const event = (await this.findById(eventId)) as Event
        if (!event) {
            throw new ErrorNotFound("Event not found")
        }
        
        return event.participantRole.some(role => {
            return role.eventPermission.includes(permission) && role.registerList.some(user => user.equals(userId))
        })
    }

    /**
     * Adds a participant role to an event
     * Throws an exception if the event is not found, or if any permission of this role doesn't exist
     * If insufficient role info is sent, default information will be filled
     * @param eventId ID of the event
     * @param newRole Data to be filled for the new role 
     * @returns A promise that resolves with the number of changed documents
     */
    async addRole(eventId: ObjectID, newRole: any) {
        const event = (await this.findById(eventId)) as Event
        if (!event) {
            throw new ErrorNotFound("Event not found")
        }
        if (newRole.eventPermission.some((permission: any) => !Object.values(EventPermission).includes(permission))) {
            throw new ErrorInvalidData("Invalid permissions for role")
        }

        const roles = event.participantRole
        let new_role_id = 0
        if (roles.length > 0) {
            new_role_id = roles[roles.length - 1].roleId + 1
        }
        
        roles.push(_.merge({ // default values for a role
            roleId: new_role_id,
            eventPermission: [EventPermission.register],
            roleName: '',
            description: '',
            maxRegister: 1,
            socialDay: 0,
            isPublic: false,
            registerList: [],
        }, newRole))

        return await this.updateOne(eventId, {
            participantRole: roles
        })
    }

    /**
     * Edit a participant role of an event
     * Throws an exception if the event is not found,
     * the requested role can't be found, or role permission doesn't exist
     * @param eventId ID of the event
     * @param updatedRole Updated role data (must contain ID of role to be changed)
     * @returns A promise that resolves with the number of documents changed
     */
    async editRole(eventId: ObjectID, updatedRole: any) {
        const event = (await this.findById(eventId)) as Event
        if (!event) {
            throw new ErrorNotFound("Event not found")
        }
        if (updatedRole.eventPermission.some((permission: any) => !Object.values(EventPermission).includes(permission))) {
            throw new ErrorInvalidData("Invalid permissions for role")
        }
        
        const roleId = updatedRole.roleId
        let roles = event.participantRole
        if (!event.participantRole.some(role => role.roleId === roleId)) {
            throw new ErrorInvalidData("Can't find the requested role to change")
        }
        
        updatedRole = _.pick(updatedRole, [
            'roleId',
            'eventPermission',
            'roleName',
            'description',
            'maxRegister',
            'socialDay',
            'isPublic',
        ])
        
        // merge new data to one of the existing roles
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].roleId === roleId) {
                roles[i] = _.merge(roles[i], updatedRole)
            }
        }
        
        return await this.updateOne(eventId, {
            participantRole: roles
        })
    }

    /**
     * Deletes a participant role from an event
     * Throws an exception if the event is not found, or the requested role can't be found
     * @param eventId ID of the event
     * @param roleId ID of the role to be deleted
     * @returns A promise that resolves with the number of documents changed
     */
    async deleteRole(eventId: ObjectID, roleId: number) {
        const event = (await this.findById(eventId)) as Event
        if (!event) {
            throw new ErrorNotFound("Event not found")
        }
        let roles = event.participantRole
        if (!roles.some(role => role.roleId === roleId)) {
            throw new ErrorNotFound("The requested role does not exist")
        }
        
        roles = roles.filter(role => role.roleId != roleId)
        return await this.updateOne(eventId, {
            participantRole: roles
        })
    }
    
    /**
     * Adds a new attendance period to an event.
     * Throws an exception if event doesn't exist, is not in preparation stage or startTime or endTime is bad
     * @param eventId ID of the event
     * @param startTime Start time of the attendance period
     * @param endTime Ending time of the attendance period
     * @returns A promise that resolves with the number of documents changed
     */
    async addAttendancePeriod(eventId: ObjectID, title: string, startTime: number, endTime: number) {
        const event = (await this.findEvents({
            _id: eventId
        }, false, false, false, false))[0] as Event
        
        if (!event) {
            throw new ErrorNotFound("Event not found")
        }
        if (event.verifyStatus != VerifiedState.preparing) {
            throw new ErrorInvalidData("Can only add attendance period to an event in preparation stage")
        }
        
        let good_data = startTime <= endTime && startTime >= event.information.eventStart && endTime <= event.information.eventEnd
        
        let periods = event.attendancePeriods
        periods.forEach(period => {
            let overlap = Math.max(startTime, period.checkStart) <= Math.min(endTime, period.checkEnd)
            good_data = good_data && !overlap
        })
        
        if (!good_data) {
            throw new ErrorInvalidData("Bad input data")
        }
        
        periods.push({
            title: title,
            checkStart: startTime,
            checkEnd: endTime,
            ivCheck: crypto.randomBytes(16).toString("hex"),
            checkedParticipants: []
        })
        // sort the periods according to increasing check start time
        periods.sort((x, y) => x.checkStart - y.checkStart)
        
        return await this.updateOne(eventId, {
            attendancePeriods: periods
        })
    }
    
    /**
     * Delete an attendance period to an event
     * Throws an exception if event doesn't exist, is not in preparation or index is out of bounds
     * @param eventId ID of the event
     * @param index index of the attendance period to be deleted
     * @returns A promise that resolves with the number of documents changed
     */
    async removeAttendancePeriod(eventId: ObjectID, index: number) {
        const event = (await this.findEvents({
            _id: eventId
        }, false, false, false, false))[0] as Event
        
        if (!event) {
            throw new ErrorNotFound("Event not found")
        }
        if (event.verifyStatus != VerifiedState.preparing) {
            throw new ErrorInvalidData("Can only add attendance period to an event in preparation stage")
        }
        
        let periods = event.attendancePeriods
        if (index < 0 || index >= periods.length) {
            throw new ErrorInvalidData("Index out of bounds")
        }
        
        periods.splice(index, 1)
        return await this.updateOne(eventId, {
            attendancePeriods: periods
        })
    }
    
    /**
     * Edit info about a specific attendance period.
     * Only checks the fields `title`, `checkStart` and `checkEnd`
     * @param eventId ID of the event to be changed
     * @param index index of the attendance period to be changeed
     * @param data new data for the attendance period
     * @returns A promise of the number of documents changed
     */
    async editAttendancePeriod(eventId: ObjectID, index: number, data: any) {
        const event = (await this.findById(eventId)) as Event
        if (!event) {
            throw new ErrorNotFound("Event not found")
        }
        let periods = event.attendancePeriods
        if (index < 0 || index >= periods.length) {
            throw new ErrorInvalidData("Requested attendance period doesn't exist")
        }

        if (data.title) periods[index].title = data.title
        if (data.checkStart) periods[index].checkStart = data.checkStart
        if (data.checkEnd) periods[index].checkEnd = data.checkEnd
        
        // check if the new period overlaps with any existing period
        for (let i = 0; i < periods.length; i++) {
            if (i == index) continue
            let l = Math.max(periods[index].checkStart, periods[i].checkStart)
            let r = Math.min(periods[index].checkEnd, periods[i].checkEnd)
            if (l <= r) {
                throw new ErrorInvalidData(`Updated check time overlaps existing attendance periods`)
            }
        }
        periods.sort((x, y) => x.checkStart - y.checkStart)

        return await this.updateOne(eventId, {
            attendancePeriods: periods
        })
    }

    async getRoleInfo(event: Event, role: string): Promise<any> {
        let roleInfo: any;
        for (let i = 0; i < event.participantRole.length; i++) {
            if (event.participantRole[i].roleName === role) {
                roleInfo = event.participantRole[i];
            }
        }
        return roleInfo as any;
    }

    async registerEvent(eventId: ObjectID, data: any): Promise<number> {
        const opUpdateResult = await this.eventCollection.updateOne(
            {
                _id: eventId,
                'participant.userId': { $nin: [data.userId] },
                'participantRole.roleId': data.roleId,
            },
            {
                $push: {
                    participant: data,
                    'participantRole.$.registerList': data.userId,
                },
            },
        );
        return opUpdateResult.result.nModified;
    }

    async getQRCode(eventId: ObjectID, userId: ObjectID) {
        const event = await this.eventCollection.findOne({
            _id: eventId,
            'participant.userId': { $in: [userId] },
        });
        for (let i = 0; i < event.participant.length; i++) {
            if (event.participant[i].userId.equals(userId)) return event.participant[i].code;
        }
        return '';
    }

    async checkAttendance(eventId: ObjectID, code: string) {
        let event = await this.findById(eventId)
        checkEventNotNull(event)
        checkEventInAttendancePeriod(event)
        
        const iv = event.attendancePeriods[event.currentAttendancePeriod].ivCheck
        const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'))
        
        const decrpyted = Buffer.concat([
            decipher.update(Buffer.from(code, 'hex')),
            decipher.final()
        ])
        
        let data = JSON.parse(decrpyted.toString())
        
        let ap = event.attendancePeriods
        ap[event.currentAttendancePeriod].checkedParticipants.push(ObjectID.createFromHexString(data.userId))
        let n_modified = await this.updateOne(eventId, {
            attendancePeriods: ap
        })
        
        return {
            nModified: n_modified,
            userId: ObjectID.createFromHexString(data.userId),
            eventState: event.eventState
        }
    }

    async updateSocialDay(eventId: ObjectID, userId: ObjectID, day: number) {
        const onUpdateResult = await this.eventCollection.updateOne(
            {
                _id: eventId,
                'participant.userId': userId,
            },
            {
                $set: { 'participant.$.socialDay': day },
            },
        );
        return onUpdateResult.result.nModified;
    }

    async getEventIfPermissionTrue(
        eventId: ObjectID,
        user: ObjectID,
        permission: Array<EventPermission>,
    ): Promise<Event> {
        const event = await this.eventCollection.findOne({
            _id: eventId,
            participantRole: {
                $elemMatch: {
                    eventPermission: { $in: permission },
                    registerList: { $in: [user] },
                },
            },
        });
        return event;
    }

    async getEventIfCreator(eventId: ObjectID, userId: ObjectID) {
        const event = (await this.eventCollection.findOne({
            _id: eventId,
        })) as Event;
        return event.userCreated.equals(userId) ? event : null;
    }

    async getEventIfPermissionTrueOrIfCreator(
        eventId: ObjectID,
        user: ObjectID,
        permission: Array<EventPermission>,
        isCreator: boolean = false,
    ): Promise<Event> {
        if (isCreator) {
            const event = await this.eventCollection.findOne({
                _id: eventId,
                $or: [
                    {
                        participantRole: {
                            $elemMatch: {
                                eventPermission: { $in: permission },
                                registerList: { $in: [user] },
                            },
                        },
                    },
                    {
                        userCreated: user,
                    },
                ],
            });
            return event;
        } else {
            const event = await this.eventCollection.findOne({
                _id: eventId,
                participantRole: {
                    $elemMatch: {
                        eventPermission: { $in: permission },
                        registerList: { $in: [user] },
                    },
                },
            });
            return event;
        }
    }
}
