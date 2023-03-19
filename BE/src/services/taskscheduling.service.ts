import Agenda, { Job } from "agenda";
import { inject, injectable } from "inversify";
import { EventService } from "./event.service";
import { DB_CONN_STRING } from "../config";
import { EndAttendanceData, EndEventData, StartAttendanceData, StartEventData, timestampToDate, UpdateSocialDayData } from "../models/taskscheduling.model";
import { NotificationService } from "./notification.service";
import { checkEventHasAttendancePeriod, checkEventNotNull, checkEventStateIs, checkUserCanStartEvent } from "../lib/request-validation";
import { Event, EventPermission, EventState } from "../models/event.model";
import { RefIdType, RefName } from "../models/notification.model";
import _ from "lodash";
import { ServiceType } from "../types";

export enum JobType {
    START_EVENT = "START_EVENT",
    END_EVENT = "END_EVENT",
    START_ATTENDANCE = "START_ATTENDANCE",
    END_ATTENDANCE = "END_ATTENDANCE",
    UPDATE_SOCIAL_DAY = "UPDATE_SOCIAL_DAY"
}

@injectable()
export class TaskSchedulingService {
    public scheduler: Agenda
    
    constructor(
        @inject(ServiceType.Event) private eventService: EventService,
        @inject(ServiceType.Notification) private notificationService: NotificationService
    ) {
        this.scheduler = new Agenda({
            db: {
                address: DB_CONN_STRING
            }
        });
        (async () => {
            await this.scheduler.start()
            
            // define job handling here
            this.scheduler.define(JobType.START_EVENT, this.handleStartEvent.bind(this))
            this.scheduler.define(JobType.END_EVENT, this.handleEndEvent.bind(this))
            this.scheduler.define(JobType.START_ATTENDANCE, this.handleStartAttendance.bind(this))
            this.scheduler.define(JobType.END_ATTENDANCE, this.handleEndAttendance.bind(this))
            this.scheduler.define(JobType.UPDATE_SOCIAL_DAY, this.handleUpdateSocialDay.bind(this))
        })()
    }
    
    // event handling
    
    async handleStartEvent(job: Job<StartEventData>) {
        try {
            const eventId = job.attrs.data.eventId
            console.log(`auto starting event ${eventId}`)
            const event = (await this.eventService.findById(eventId)) as Event

            checkEventNotNull(event)
            checkEventStateIs(event, [EventState.prepare])

            await this.eventService.updateOne(eventId, {
                eventStart: Date.now(),
                eventState: EventState.start,
            });
            const participantList = _.map(event.participant, 'userId');
            const dataNotification = {
                title: 'EVENT HAS STARTED',
                message: `The Event ${event.information.title} has just started`,
                refName: RefName.EVENT_START,
            };
            await this.notificationService.sendNotifications(
                participantList,
                dataNotification,
                RefIdType.USER,
            );
            await this.notificationService.sendNotifications([event.userCreated], {
                ...dataNotification,
                refId: eventId,
            })
            
            // add end event to scheduler
            this.addEndEvent(event.information.eventEnd, {
                eventId: eventId
            })
            if (event.attendancePeriods.length > 0) {
                this.addStartAttendance(event.attendancePeriods[0].checkStart, {
                    eventId: eventId,
                    index: 0
                })
            }
        } catch(error) {
            console.log(error)
        }
    }
    
    async handleEndEvent(job: Job<EndEventData>) {
        try {
            const eventId = job.attrs.data.eventId
            console.log(`auto ending event ${eventId}`)
            const event = (await this.eventService.findById(eventId)) as Event;

            checkEventNotNull(event)
            checkEventStateIs(event, [EventState.endSecondCheck])
            
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
                
            await this.eventService.updateOne(eventId, {
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
            await this.notificationService.sendNotifications(
                participantList,
                dataNotification,
                RefIdType.USER,
            );
            await this.notificationService.sendNotifications([event.userCreated], {
                ...dataNotification,
                refId: eventId,
            });
        } catch(error) {
            console.log(error)
        }
    }
    
    async handleStartAttendance(job: Job<StartAttendanceData>) {
        try {
            const eventId = job.attrs.data.eventId
            const index = job.attrs.data.index
            console.log(`auto starting attendance period ${index} of event ${eventId}`)
            
            const event = (await this.eventService.findById(eventId)) as Event;
            checkEventNotNull(event)
            checkEventStateIs(event, [EventState.start])
            checkEventHasAttendancePeriod(event, index)
            
            await this.eventService.startAttendancePeriod(eventId, index)

            const participantList = _.map(event.participant, 'userId');
            const dataNotification = {
                title: 'FIRST CHECK ATTENDANCE HAS STARTED',
                message: `The Event ${event.information.title} has just started the first attendance checking`,
                refName: RefName.EVENT_START_FIRST_CHECK,
            };
            await this.notificationService.sendNotifications(
                participantList,
                dataNotification,
                RefIdType.USER,
            );
            await this.notificationService.sendNotifications([event.userCreated], {
                ...dataNotification,
                refId: eventId,
            });
            
            // add end attendance to queue
            this.addEndAttendance(event.attendancePeriods[index].checkEnd, {
                eventId: eventId,
                index: index
            })
        } catch(error) {
            console.log(error)
        }
    }
    
    async handleEndAttendance(job: Job<EndAttendanceData>) {
        try {
            const eventId = job.attrs.data.eventId
            const index = job.attrs.data.index
            console.log(`auto ending attendance period ${index} of event ${eventId}`)

            const event = (await this.eventService.findById(eventId)) as Event;
            checkEventNotNull(event)
            // checkEventStateIs(event, [EventState.firstCheck])
            checkEventHasAttendancePeriod(event, index)
            
            await this.eventService.endAttendancePeriod(eventId, index)

            const participantList = _.map(event.participant, 'userId');
            const dataNotification = {
                title: 'FIRST CHECK ATTENDANCE HAS CLOSED',
                message: `The Event ${event.information.title} has just closed the first attendance checking`,
                refName: RefName.EVENT_END_FIRST_CHECK,
            };
            await this.notificationService.sendNotifications(
                participantList,
                dataNotification,
                RefIdType.USER,
            );
            await this.notificationService.sendNotifications([event.userCreated], {
                ...dataNotification,
                refId: eventId,
            });
            
            // add start attendance if there's still any
            if (index < event.attendancePeriods.length - 1) {
                this.addStartAttendance(event.attendancePeriods[index + 1].checkStart, {
                    eventId: event._id,
                    index: index + 1
                })
            }
        } catch(error) {
            console.log(error)
        }
    }
    
    async handleUpdateSocialDay(job: Job<UpdateSocialDayData>) {
        try {
        } catch(error) {
            console.log(error)
        }
    }
    
    // adding and removing events
    
    async addStartEvent(when: number, data: StartEventData) {
        try {
            await this.scheduler.schedule(timestampToDate(when), JobType.START_EVENT, data)
        } catch(error) {
            console.log(error)
        }
    }
    
    async addEndEvent(when: number, data: EndEventData) {
        try {
            await this.scheduler.schedule(timestampToDate(when), JobType.END_EVENT, data)
        } catch(error) {
            console.log(error)
        }
    }
    
    async addStartAttendance(when: number, data: StartAttendanceData) {
        try {
            await this.scheduler.schedule(timestampToDate(when), JobType.START_ATTENDANCE, data)
        } catch(error) {
            console.log(error)
        }
    }
    
    async addEndAttendance(when: number, data: EndAttendanceData) {
        try {
            await this.scheduler.schedule(timestampToDate(when), JobType.END_ATTENDANCE, data)
        } catch(error) {
            console.log(error)
        }
    }
    
    // updating social days is performed immediately
    async addUpdateSocialDay(data: UpdateSocialDayData) {
        try {
            await this.scheduler.now(JobType.UPDATE_SOCIAL_DAY, data)
        } catch(error) {
            console.log(error)
        }
    }
    
    // cancel all jobs matching the given query
    async cancelEvent(query: any) {
        try {
            return await this.scheduler.cancel(query)
        } catch(error) {
            console.log(error)
        }
    }
}