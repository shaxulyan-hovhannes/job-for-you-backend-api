import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { VerifyInfo, VerifyInfoSchema } from './schemas/verify-info.schema';
import { JwtCustomService } from 'src/common/services/jwt-custom-service';
import { CryptoJsService } from 'src/common/services/crypto-js-service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: VerifyInfo.name, schema: VerifyInfoSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtCustomService, CryptoJsService],
  exports: [UserService],
})
export class UserModule {}
