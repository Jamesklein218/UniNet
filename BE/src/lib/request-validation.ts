import { ObjectId, ObjectID } from "mongodb"
import { Event, EventPermission, EventState, VerifiedState } from "../models/event.model"
import { Role } from "../models/user.model"
import { UserService } from "../services"
import { ErrorInvalidData, ErrorNotFound, ErrorUnauthorized } from "./errors"

export function checkEventNotNull(
    event: Event,
    message: string = "Event not found"
) {
    if (!event) {
        throw new ErrorNotFound(message)
    }
}

export async function checkUserHasRole(
    userId: ObjectID,
    roles: Role[],
    userService: UserService,
    message: string = `Invalid permission. Permitted roles for this action: ${roles}`
) {
    for (const r of roles) {
        if (await userService.checkRole(userId, r)) {
            return
        }
    }
    throw new ErrorUnauthorized(message)
}

export async function checkUserIsCreator(
    userId: ObjectID,
    userService: UserService,
    message: string = "You must be a Creator in order to perform this action"
) {
    await checkUserHasRole(userId, [Role.Creator], userService, message)
}

export async function checkUserIsCensor(
    userId: ObjectID,
    userService: UserService,
    message: string = "You must be a Censor in order to perform this action"
) {
    await checkUserHasRole(userId, [Role.Censor], userService, message)
}

export function checkUserCreatedEvent(
    userId: ObjectID,
    event: Event,
    message: string = "You need to be the creator of this event to perform this action"
) {
    if (!event.userCreated.equals(userId)) {
        throw new ErrorUnauthorized(message)
    }
}

export function checkUserDidNotCreateEvent(
    userId: ObjectID,
    event: Event,
    message: string = "Cannot perform this action because you created this event"
) {
    if (event.userCreated.equals(userId)) {
        throw new ErrorUnauthorized(message)
    }
}

export function checkUserVerifiedEvent(
    userId: ObjectID,
    event: Event,
    message: string = "You need to be the verifier of this event to perform this action"
) {
    if (!event.verifiedBy.equals(userId)) {
        throw new ErrorUnauthorized(message)
    }
}

export function checkEventVerifyStateIs(
    event: Event,
    states: VerifiedState[],
    message: string = `Verify state is invalid. Allowed states are ${states}`
) {
    if (!states.includes(event.verifyStatus)) {
        throw new ErrorInvalidData(message)
    }
}

export function checkEventVerifyStateIsNot(
    event: Event,
    states: VerifiedState[],
    message: string = `Verify state is invalid. Forbidden states are ${states}`
) {
    if (states.includes(event.verifyStatus)) {
        throw new ErrorInvalidData(message)
    }
}

export function checkEventStateIs(
    event: Event,
    states: EventState[],
    message: string = `Event state is invalid. Allowed states are ${states}`
) {
    if (!states.includes(event.eventState)) {
        throw new ErrorInvalidData(message)
    }
}

export function checkEventStateIsNot(
    event: Event,
    states: EventState[],
    message: string = `Event state is invalid. Forbidden states are ${states}`
) {
    if (states.includes(event.eventState)) {
        throw new ErrorInvalidData(message)
    }
}

export function checkEventInPreparation(
    event: Event,
    message: string = `Can only perform this action during preparation stage`
) {
    checkEventVerifyStateIs(event, [VerifiedState.preparing], message)
}

export function checkEventNotFinished(
    event: Event,
    message: string = "Event has finished"
) {
    checkEventStateIsNot(event, [EventState.finish, EventState.closing], message)
}

export function checkTimeInRange(
    low: number,
    high: number,
    message: string = "The requested action cannot be performed at the current time"
) {
    const now = Date.now()
    if (now < low || now > high) {
        throw new ErrorInvalidData(message)
    }
}

export function checkEventInFormPeriod(
    event: Event,
    message: string = `Can only perform this action during form period`
) {
    checkTimeInRange(event.information.formStart, event.information.formEnd, message)
}

export function checkLeaderHasConfirmed(
    event: Event,
    message: string = "Cannot complete this action because no leader has confirmed this event"
) {
    if (event.leaderConfirmAt === 0) {
        throw new ErrorInvalidData(message)
    }
}

export function checkLeaderHasNotConfirmed(
    event: Event,
    message: string = "Cannot complete this action because a leader has confirmed this event"
) {
    if (event.leaderConfirmAt > 0) {
        throw new ErrorInvalidData(message)
    }
}

export function checkCensorHasConfirmed(
    event: Event,
    message: string = "Cannot complete this action because no censor has confirmed this event"
) {
    if (event.censorConfirmAt === 0) {
        throw new ErrorInvalidData(message)
    }
}

export function checkCensorHasNotConfirmed(
    event: Event,
    message: string = "Cannot complete this action because a censor has confirmed this event"
) {
    if (event.censorConfirmAt > 0) {
        throw new ErrorInvalidData(message)
    }
}

export function checkCreatorHasConfirmed(
    event: Event,
    message: string = "Cannot complete this action because you haven't confirmed this event"
) {
    if (event.creatorConfirmAt === 0) {
        throw new ErrorInvalidData(message)
    }
}

export function checkCreatorHasNotConfirmed(
    event: Event,
    message: string = "Cannot complete this action because you have confirmed this event"
) {
    if (event.creatorConfirmAt > 0) {
        throw new ErrorInvalidData(message)
    }
}

export function checkUserRegisterEvent(
    userId: ObjectID,
    event: Event,
    message: string = "User is not registered to the requested event"
) {
    if (!event.participant.some(p => p.userId.equals(userId))) {
        throw new ErrorInvalidData(message)
    }
}

export function checkUserDidNotRegisterEvent(
    userId: ObjectID,
    event: Event,
    message: string = "User is already registered to the requested event"
) {
    if (event.participant.some(p => p.userId.equals(userId))) {
        throw new ErrorInvalidData(message)
    }
}

export function checkEventHasRole(
    event: Event,
    roleId: number,
    message: string = "Requested role doesn't exist"
) {
    if (!event.participantRole.some(r => r.roleId === roleId)) {
        throw new ErrorInvalidData(message)
    }
}

export function checkEventRolePublic(
    event: Event,
    roleId: number,
    message: string = "Requested role is not public"
) {
    if (!event.participantRole.every(r => r.roleId != roleId || r.isPublic)) {
        throw new ErrorInvalidData(message)
    }
}

export function checkRoleNotAtRegisterLimit(
    event: Event,
    roleId: number,
    message: string = "The requested role has reached maximum registration limit"
) {
    if (!event.participantRole.every(r => r.roleId != roleId || r.registerList.length < r.maxRegister)) {
        throw new ErrorInvalidData(message)
    }
}

export function checkEventHasAttendancePeriod(
    event: Event,
    index: number,
    message: string = "The requested attendance period does not exist"
) {
    if (index < 0 || index >= event.attendancePeriods.length) {
        throw new ErrorInvalidData(message)
    }
}

export function checkEventInAttendancePeriod(
    event: Event,
    message: string = "This action can only be performed during an attendance period"
) {
    if (event.currentAttendancePeriod == -1) {
        throw new ErrorInvalidData(message)
    }
}

/**
 * Checks if a user can start an event or start an attendance period.
 * This is true iff the user registered with permission `leader`, or
 * the user created this event. Throws an error if this condition is false
 * @param event Event to be checked
 * @param userId ID of the caller
 * @param curState state to be checked
 */
export function checkUserCanStartEvent(
    userId: ObjectID,
    event: Event,
    message: string = "Invalid permission or invalid event state"
) {
    const leader = event.participantRole.some(r => r.eventPermission.includes(EventPermission.leader) && r.registerList.includes(userId))
    const created = event.userCreated.equals(userId)
    if (!(leader || created)) {
        throw new ErrorUnauthorized(message)
    }
}

