import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/services/auth-guard';
import { JwtCustomService } from 'src/common/services/jwt-custom-service';
import { CryptoJsService } from 'src/common/services/crypto-js-service';
import { User } from './schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtCustomService: JwtCustomService,
    private readonly cryptoJsService: CryptoJsService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // @UseGuards(AuthGuard)
  @Get('info')
  async getUserInfo(@Req() req) {
    try {
      const refreshToken = req.cookies['refresh-token'];

      if (!refreshToken) {
        return {
          isAuthenticated: false,
        };
      }

      const decryptedRefreshToken =
        this.cryptoJsService.decryptRefreshToken(refreshToken);

      const refreshTokenPayload =
        await this.jwtCustomService.verifyRefreshToken(
          decryptedRefreshToken.slice(1, decryptedRefreshToken.length - 1),
        );

      const userId = refreshTokenPayload.userId;

      const foundUser = await this.userService.findOne({
        _id: new Types.ObjectId(userId),
        email: refreshTokenPayload.email,
        refresh_token: refreshToken,
      });

      if (!foundUser) {
        return {
          isAuthenticated: false,
        };
      }

      const newAccessToken = this.jwtCustomService.generateAccessToken({
        userId: foundUser._id,
        email: foundUser.email,
      });

      return {
        isAuthenticated: true,
        _v: this.cryptoJsService.encryptAccessToken(newAccessToken),
        id: foundUser._id,
        is_verified: foundUser.is_verified,
        role: foundUser.role,
        firstname: foundUser.firstname,
        lastname: foundUser.lastname,
      };
    } catch (err) {
      throw err;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
