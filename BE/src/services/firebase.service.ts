import { injectable } from 'inversify';
import { firebaseConfig } from '../config';
import * as admin from 'firebase-admin';

@injectable()
export class FirebaseService {
    async initialize() {
        console.log('[Firebase] Prepare to connect to Firebase server');

        try {
            admin.initializeApp({ credential: admin.credential.cert(firebaseConfig) });
            console.log('[Firebase] Firebase connected');
        } catch (err) {
            console.log(err);
        }
    }
}
