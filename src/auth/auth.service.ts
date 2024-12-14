import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/common/services/mail.service';

import { SignupDto } from './dto/sign-up.dto';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ user: User }> {
    const { user, verify_code } = await this.userService.createUser(signupDto);

    // await this.mailService.sendEmail(
    //   signupDto.email,
    //   'JOB FOR YOU Web Service ic Namak',
    //   'JOB FOR YOU Web Servisi API-ic ekox namak mi sharq andzanc',
    // );

    // const token = this.generateToken(user.id);
    // return { user, token };

    return { user };
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
