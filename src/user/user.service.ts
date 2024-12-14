import { Model } from 'mongoose';
import * as argon2 from 'argon2';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { VerifyInfo } from './schemas/verify-info.schema';
import { UserHelpers } from 'src/common/utils/user.helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(VerifyInfo.name) private verifyInfoModel: Model<VerifyInfo>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<{ user: User; verify_code: number }> {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const createdUser = new this.userModel({
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      phone: createUserDto.phone,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
    });
    const savedUSer = await createdUser.save();

    console.log('SAVED USER', savedUSer);

    const generatedVerifyCode = UserHelpers.generateVerifyCode();

    const createdVerifyInfo = new this.verifyInfoModel({
      user_id: savedUSer._id,
      code: generatedVerifyCode,
      code_generated_date: new Date(),
    });

    console.log('CREATE VERIFY INFO', createdVerifyInfo);

    await createdVerifyInfo.save();

    return { user: savedUSer, verify_code: generatedVerifyCode };
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
