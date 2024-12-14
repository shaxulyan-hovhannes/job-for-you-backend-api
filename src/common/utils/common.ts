// import { User } from "src/user/schemas/user.schema";

// function validateCode(user: User, enteredCode: number): boolean {
//     const now = new Date();
//     if (
//         user.verify_status.code === enteredCode &&
//         user.verify_status.code_generated_date &&
//         now.getTime() - new Date(user.verify_status.code_generated_date).getTime() <= 10 * 60 * 1000
//     ) {
//         return true; // Код валиден
//     }
//     return false; // Код истек или неверен
// }

class CommonHelpers {
  static generateVerifyCode(): number {
    return Math.round(Math.random() * 9999999999);
  }
}
