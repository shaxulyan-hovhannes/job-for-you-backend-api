import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      // 'mongodb+srv://shaxulyan87:iC6qXi68NOJJ6MZh@jobforyou.tbdu9.mongodb.net/jobforyouDB?retryWrites=true&w=majority',
      'mongodb://127.0.0.1:27017/jobforyouLocalDB',
    ),
    ScheduleModule.forRoot(),
    HttpModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
