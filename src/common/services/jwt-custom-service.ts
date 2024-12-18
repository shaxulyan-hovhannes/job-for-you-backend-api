import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtCustomService extends JwtService {
  constructor() {
    super();
  }

  generateAccessToken(payload?: any): string {
    return this.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '10m',
    }); // Access token
  }

  generateRefreshToken(payload?: any): string {
    return this.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '7d',
    }); // Refresh token
  }

  verifyAccessToken(token: string) {
    if (!token || typeof token !== 'string' || !token.length)
      throw new Error('Token not defined');

    return this.verifyAsync(token, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  verifyRefreshToken(token: string) {
    if (!token || typeof token !== 'string' || !token.length)
      throw new Error('Token not defined');

    return this.verifyAsync(token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });
  }
}
