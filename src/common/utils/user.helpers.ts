export class UserHelpers {
  static generateVerifyCode(): number {
    return Math.round(Math.random() * 9999999999);
  }
}
