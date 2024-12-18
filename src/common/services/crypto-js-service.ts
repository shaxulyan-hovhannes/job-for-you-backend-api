import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class CryptoJsService {
  private readonly secretKey = 'my-secret-key';

  encrypt(data: string): string {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      process.env.CRYPTO_JS_SECRET_KEY,
    ).toString();
  }

  decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(
      encryptedData,
      process.env.CRYPTO_JS_SECRET_KEY,
    );

    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
