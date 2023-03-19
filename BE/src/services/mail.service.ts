import { inject, injectable } from 'inversify';
import mailgun from 'mailgun-js';
import { EMAIL_API_KEY, ROOT_DOMAIN } from '../config';

@injectable()
export class MailService {
    mg: mailgun.Mailgun = null;

    constructor() {
        console.log('[Database service] Construct');

        this.mg = mailgun({ apiKey: EMAIL_API_KEY, domain: ROOT_DOMAIN });
    }

    send(from: string, to: string | string[], subject: string, text: string) {
        return this.mg.messages().send({
            from,
            to,
            subject,
            text,
        });
    }

    sendHTML(
        from: string,
        to: string | string[],
        subject: string,
        html: string,
    ) {
        return this.mg.messages().send({
            from,
            to,
            subject,
            html,
        });
    }
}
