import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class CryptoJsService {

  private encrypt(data: string, secret: string): string {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      secret,
    ).toString();
  }

  private decrypt(encryptedData: string, secret: string): string {
    const bytes = CryptoJS.AES.decrypt(
      encryptedData,
      secret,
    );

    return bytes.toString(CryptoJS.enc.Utf8);
  }

  encryptAccessToken(data: string) {
    return this.encrypt(data, process.env.CRYPTO_JS_ACCESS_TOKEN_SECRET_KEY)
  }

  decryptAccessToken(data: string) {
    return this.decrypt(data, process.env.CRYPTO_JS_ACCESS_TOKEN_SECRET_KEY)
  }

  encryptRefreshToken(data: string) {
    return this.encrypt(data, process.env.CRYPTO_JS_REFRESH_TOKEN_SECRET_KEY)
  }

  decryptRefreshToken(data: string) {
    return this.decrypt(data, process.env.CRYPTO_JS_REFRESH_TOKEN_SECRET_KEY)
  }

  encryptPhone(data: string) {
    return this.encrypt(data, process.env.CRYPTO_JS_PHONE_SECRET_KEY)
  }

  decryptPhone(data: string) {
    return this.decrypt(data, process.env.CRYPTO_JS_PHONE_SECRET_KEY)
  }
}
