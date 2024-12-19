import { Injectable } from '@nestjs/common';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/common/services/mail.service';

import { SignupDto } from './dto/sign-up.dto';
import { SignupUserResponseType } from 'src/common/types-interfaces';
import { JwtCustomService } from 'src/common/services/jwt-custom-service';
import { CryptoJsService } from 'src/common/services/crypto-js-service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtCustomService: JwtCustomService,
    private readonly cryptojsService: CryptoJsService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{
    user: SignupUserResponseType;
    refresh_token: string;
  }> {
    const { user, verify_code } = await this.userService.createUser(signupDto);

    // const access_token = this.generateAccessToken({
    //   userId: user.id,
    //   role: user.role,
    // });

    const refresh_token = this.jwtCustomService.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    const encryptedRefreshToken =
      this.cryptojsService.encryptRefreshToken(refresh_token);

    await this.userService.update(user.id, {
      refresh_token: encryptedRefreshToken,
    });

    //--------------------------------------------------------------------------------------------------

    // app.post('/auth/login', (req, res) => {
    //   const refreshToken = generateRefreshToken(userId);
    //   res.cookie('refreshToken', refreshToken, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: 'strict',
    //     maxAge: 7 * 24 * 60 * 60 * 1000,
    //   });
    //   res.json({ accessToken });
    // });

    // app.post('/auth/logout', (req, res) => {
    //   res.clearCookie('refreshToken', {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: 'strict',
    //   });
    //   res.status(200).json({ message: 'Logged out' });
    // });

    //--------------------------------------------------------------------------------------------------

    // await this.mailService.sendEmail(
    //   signupDto.email,
    //   'JOB FOR YOU Web Service ic Namak',
    //   'JOB FOR YOU Web Servisi API-ic ekox namak mi sharq andzanc',
    // );

    // const token = this.generateToken(user.id);
    // return { user, token };

    return { user, refresh_token: encryptedRefreshToken };
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
