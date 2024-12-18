import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { MailService } from 'src/common/services/mail.service';
import { JwtCustomService } from 'src/common/services/jwt-custom-service';
import { AuthController } from './auth.controller';

import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService, JwtCustomService],
})
export class AuthModule {}
