import { Request as ERequest, Response as EResponse } from 'express';
import { HttpResponseComposer } from './lib/response-composer';
import { TokenMeta } from './models/token.model';

export interface Request extends ERequest {
    tokenMeta?: TokenMeta;
}

export interface Response extends EResponse {
    composer?: HttpResponseComposer;
}

export const ServiceType = {
    Auth: Symbol.for('AuthService'),
    Bundle: Symbol.for('BundleService'),
    Database: Symbol.for('DatabaseService'),
    User: Symbol.for('UserService'),
    Event: Symbol.for('EventService'),
    Upload: Symbol.for('Upload'),
    Mail: Symbol.for('Mail'),
    Contact: Symbol.for('Contact'),
    PracticeReport: Symbol.for('PracticeReport'),
    Mapper: Symbol.for('MapperService'),
    Notification: Symbol.for('NotificationService'),
    Firebase: Symbol.for('FirebaseService'),
    
    TaskSchedule: Symbol.for(`TaskSchedulingService`),
    Forum: Symbol.for('ForumService')
};

export enum PrivacyType {
    PUBLIC = 'public',
    PROTECTED = 'protected',
    PRIVATE = 'private',
}

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}
