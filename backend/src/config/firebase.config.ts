import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseConfig {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const serviceAccount = {
      type: 'service_account',
      project_id: this.configService.get('FIREBASE_PROJECT_ID'),
      private_key_id: this.configService.get('FIREBASE_PRIVATE_KEY_ID'),
      private_key: this.configService.get('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
      client_email: this.configService.get('FIREBASE_CLIENT_EMAIL'),
      client_id: this.configService.get('FIREBASE_CLIENT_ID'),
      auth_uri: this.configService.get('FIREBASE_AUTH_URI'),
      token_uri: this.configService.get('FIREBASE_TOKEN_URI'),
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${this.configService.get('FIREBASE_CLIENT_EMAIL')}`,
    };

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: this.configService.get('FIREBASE_STORAGE_BUCKET'),
    });
  }

  getFirebaseApp(): admin.app.App {
    return this.firebaseApp;
  }

  getStorage(): admin.storage.Storage {
    return this.firebaseApp.storage();
  }
}