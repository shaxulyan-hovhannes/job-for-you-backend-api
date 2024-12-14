import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: '142.250.8.36', // SMTP сервер
      port: 587, // Порт SMTP
      secure: false, // Использовать TLS
      auth: {
        user: 'hovhannes.shakhulyan@gmail.com', // Ваш email
        pass: 'jbjz pvqr yxtq muee', // Пароль
      },
    });
  }

  //   {
  //     service: 'gmail',
  //     host: '142.250.8.36',  // IP-адрес smtp.gmail.com
  //     port: 587,
  //     secure: false,
  //     auth: {
  //       user: 'your-email@gmail.com',
  //       pass: 'your-password'
  //     }
  //   }

  async sendEmail(
    to: string | string[],
    subject: string,
    text: string,
  ): Promise<void> {
    console.log('SEND EMAIL', to);
    await this.transporter.sendMail({
      from: 'hovhannes.shakhulyan@gmail.com',
      to,
      subject,
      text,
    });
  }
}
