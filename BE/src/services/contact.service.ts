import { inject, injectable } from 'inversify';
import { Collection } from 'mongodb';

import { EMAIL_API_KEY, ROOT_DOMAIN } from '../config';
import { ServiceType } from '../types';
import { MailService } from './mail.service';
import { DatabaseService } from './database.service';

import { htmlEmail } from '../html-email';

@injectable()
export class ContactService {
    private contactCollection: Collection;

    constructor(
        @inject(ServiceType.Mail) private mailService: MailService,
        @inject(ServiceType.Database) private dbService: DatabaseService,
    ) {
        console.log('[Contact service] Construct');
        this.contactCollection = this.dbService.db.collection('contact');
    }

    public formatNumberToVND(number = 0) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '₫';
    }

    public async insert(data: any) {
        const { name, phone, email, address, note, cart = [] } = data;
        let { contactInfo, orders, orderSummary } = htmlEmail;

        let totalPrice = 0;
        let discountPrice = 0;
        let ordersString = ``;
        let orderSummaryString = '';
        let emailString = '';

        for (let index = 0; index < cart.length; index++) {
            let tempString = orders;
            ordersString += tempString
                .replace(`%productName%`, cart[index].name)
                .replace(`%productQuantity%`, cart[index].quantity)
                .replace(`%productPrice%`, cart[index].price)
                .replace(
                    `%productTotalPrice%`,
                    this.formatNumberToVND(
                        cart[index].quantity * cart[index].price,
                    ),
                );

            totalPrice += cart[index].quantity * cart[index].price;
        }

        orderSummaryString = orderSummary
            .replace(`%totalPrice%`, this.formatNumberToVND(totalPrice))
            .replace(`%discountPrice%`, this.formatNumberToVND(discountPrice))
            .replace(
                `%finalPrice%`,
                this.formatNumberToVND(totalPrice - discountPrice),
            );

        emailString += contactInfo + ordersString + orderSummaryString;

        const insertedContact = await this.contactCollection.insertOne(data);
        const sendResponse = await this.mailService.send(
            'Bugs Contact <contact@bugs.vn>',
            [
                'developer@stdio.vn',
                'phu.nguyenduc@stdio.vn',
                'hien.tranthithu@stdio.vn',
            ],
            '[BUGS] New contact',
            JSON.stringify(data),
        );
        const sendCustomer = await this.mailService.sendHTML(
            'Bugs Contact <contact@bugs.vn>',
            [
                'developer@stdio.vn',
                'phu.nguyenduc@stdio.vn',
                'hien.tranthithu@stdio.vn',
            ],
            '[BUGS] New order',
            emailString,
        );

        return 'OK';
    }
}
