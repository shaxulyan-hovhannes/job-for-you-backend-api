import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtCustomService } from 'src/common/services/jwt-custom-service';
import { CryptoJsService } from 'src/common/services/crypto-js-service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignupDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtCustomService: JwtCustomService,
    private readonly cryptojsService: CryptoJsService,
  ) {}

  @Post('/signup')
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const signupRes = await this.authService.signup(signupDto);

    response.cookie('refresh-token', signupRes.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      success:
        'Signup completed successfully. Welcome aboard! We are excited to have you with us.',
      // isAuthenticated: null,
      // _v: null,
      // id: signupRes.user.id,
      // is_verified: signupRes.user.is_verified,
      // role: signupRes.user.role,
    };
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const foundUser = await this.userService.findOne({
        email: loginDto.email,
      });

      if (!foundUser) {
        throw new ForbiddenException('User not found');
      }

      const isPasswordsMatch = await this.userService.verifyPassword(
        foundUser.password,
        loginDto.password,
      );

      if (!isPasswordsMatch) {
        throw new ForbiddenException('Password is incorrect');
      }

      const refresh_token = this.jwtCustomService.generateRefreshToken({
        userId: foundUser._id,
        email: foundUser.email,
      });

      const encryptedRefreshToken =
        this.cryptojsService.encryptRefreshToken(refresh_token);

      await this.userService.update(foundUser._id, {
        refresh_token: encryptedRefreshToken,
      });

      response.cookie('refresh-token', encryptedRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        success: 'Login successful. Welcome back!',
      };
    } catch (err) {
      throw err;
    }
  }

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
