import { inject, injectable } from 'inversify';
import { MongoClient, Db } from 'mongodb';
import { DB_CONN_STRING, DB_NAME } from '../config';

@injectable()
export class DatabaseService {
    private client: MongoClient;
    private _db: Db;

    constructor() {
        console.log('[Database service] Construct');
    }

    async initialize() {
        console.log('[DB] Prepare to connect db with connection string:', DB_CONN_STRING);

        this.client = new MongoClient(DB_CONN_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        try {
            await this.client.connect();
            console.log('[DB] Database connected !');
            this._db = this.client.db(DB_NAME);
        } catch (error) {
            console.log(error);
        }
    }

    get db(): Db {
        return this._db;
    }
}
