import { NextFunction } from 'express';
import { Response, Request } from '../types';

export enum HttpResponseStatusCode {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_ALLOWED = 403,
    NOT_FOUND = 404,
    LOCKED = 423,
}

export class HttpResponseComposer {
    private res: Response;

    constructor(res: Response) {
        this.res = res;
    }

    private json(
        success: boolean,
        code: number,
        message: string,
        payload: any,
    ) {
        this.res.status(code).send({
            success,
            code,
            message,
            payload,
        });
    }

    success(payload: any, message: string = '') {
        this.json(true, HttpResponseStatusCode.SUCCESS, message, payload);
    }

    badRequest(message: string = 'Parameter not correctly') {
        this.json(false, HttpResponseStatusCode.BAD_REQUEST, message, {});
    }

    unauthorized(message: string = 'Authorization failed') {
        this.json(false, HttpResponseStatusCode.UNAUTHORIZED, message, {});
    }

    notAllowed(message: string = 'Forbidden') {
        this.json(false, HttpResponseStatusCode.NOT_ALLOWED, message, {});
    }

    notFound(message: string = 'Resource not found') {
        this.json(false, HttpResponseStatusCode.NOT_FOUND, message, {});
    }

    locked(message: string = 'Unlock code required') {
        this.json(false, HttpResponseStatusCode.LOCKED, message, {});
    }
}

export function applyHttpResponseComposer(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    res.composer = new HttpResponseComposer(res);
    next();
}
