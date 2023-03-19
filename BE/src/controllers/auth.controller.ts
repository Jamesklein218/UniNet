import { Router } from 'express';
import { inject, injectable } from 'inversify';
import _ from 'lodash';

import { Request, Response, ServiceType } from '../types';
import { Controller } from './controller';
import { AuthService } from '../services';

@injectable()
export class AuthController extends Controller {
    public readonly router = Router();
    public readonly path = '/auth';

    constructor(@inject(ServiceType.Auth) private authService: AuthService) {
        super();

        // Confing child routes
        this.router.post('/login', this.login.bind(this));
        // this.router.post('/logout', AuthService.authenticate, this.logout);
        this.router.post(
            '/recover-password-request',
            this.recoverPasswordRequest.bind(this),
        );
        this.router.post('/recover-password', this.recoverPassword.bind(this));
    }

    async login(req: Request, res: Response) {
        const { username, password, accessToken } = req.body;
        let token = '';

        try {
            token = await this.authService.generateTokenUsingUsername(
                username,
                password,
                req.useragent.source,
            );

            res.composer.success({ token });
        } catch (error) {
            console.log(error);
            res.composer.badRequest(error.message);
        }
    }

    async recoverPasswordRequest(req: Request, res: Response) {
        const { email: rawEmail } = req.body;
        const email = _.trim(rawEmail).toLowerCase().toString();

        try {
            await this.authService.recoverPasswordRequest(email);
            res.composer.success('Email sent');
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async recoverPassword(req: Request, res: Response) {
        const { password, recoverPasswordCode } = req.body;

        try {
            await this.authService.recoverPassword(
                recoverPasswordCode,
                password,
            );
            res.composer.success('Password recovered');
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }
}
