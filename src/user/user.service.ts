import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as argon2 from 'argon2';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { VerifyInfo } from './schemas/verify-info.schema';
import { UserHelpers } from 'src/common/utils/user.helpers';
import { SignupUserResponseType } from 'src/common/types-interfaces';
import { JwtCustomService } from 'src/common/services/jwt-custom-service';
import { CryptoJsService } from 'src/common/services/crypto-js-service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(VerifyInfo.name) private verifyInfoModel: Model<VerifyInfo>,
    private readonly jwtCustomService: JwtCustomService,
    private readonly cryptoJsService: CryptoJsService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }

  async createUser(createUserDto: CreateUserDto): Promise<{
    user: SignupUserResponseType;
    verify_code: number;
  }> {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const createdUser = new this.userModel({
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      phone: this.cryptoJsService.encryptPhone(createUserDto.phone),
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
    });

    const savedUSer = await createdUser.save();

    const generatedVerifyCode = UserHelpers.generateVerifyCode();

    const createdVerifyInfo = new this.verifyInfoModel({
      user_id: savedUSer._id,
      code: generatedVerifyCode,
      code_generated_date: new Date(),
    });

    await createdVerifyInfo.save();

    return {
      user: {
        id: savedUSer._id,
        firstname: savedUSer.firstname,
        lastname: savedUSer.lastname,
        phone: savedUSer.phone,
        email: savedUSer.email,
        role: savedUSer.role,
        is_verified: savedUSer.is_verified,
      },
      verify_code: generatedVerifyCode,
    };
  }

  // async getUserInfo(
  //   refreshToken: string,
  // ): Promise<Partial<User> & { id: Types.ObjectId; _v: string }> {
  //   const decryptedRefreshToken =
  //     this.cryptoJsService.decryptRefreshToken(refreshToken);

  //   const refreshTokenPayload = await this.jwtCustomService.verifyRefreshToken(
  //     decryptedRefreshToken.slice(1, decryptedRefreshToken.length - 1),
  //   );

  //   const userId = refreshTokenPayload.userId;

  //   const foundUser = await this.findOne({
  //     _id: new Types.ObjectId(userId),
  //     email: refreshTokenPayload.email,
  //     refresh_token: refreshToken,
  //   });

  //   if (!foundUser) {
  //     throw new ForbiddenException('Authorized user not found');
  //   }

  //   const newAccessToken = this.jwtCustomService.generateAccessToken({
  //     userId: foundUser._id,
  //     email: foundUser.email,
  //   });

  //   return {
  //     id: foundUser._id,
  //     is_verified: foundUser.is_verified,
  //     role: foundUser.role,
  //     _v: this.cryptoJsService.encryptAccessToken(newAccessToken),
  //   };
  // }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  findOne(params: string | Partial<User & { _id: Types.ObjectId }>) {
    return typeof params === 'string'
      ? this.userModel.findById(params).exec()
      : this.userModel.findOne(params).exec();
  }

  async update(id: Types.ObjectId, updateData: Partial<User>) {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true },
        )
        .exec();

      if (!updatedUser) {
        throw new Error(`User with ID ${id} not found.`);
      }

      return updatedUser;
    } catch (error) {
      throw new Error(`Database operation failed ${error.message}`);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
