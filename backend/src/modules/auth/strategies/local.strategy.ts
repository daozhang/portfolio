import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '../../../entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Use email instead of username
    });
  }

  async validate(email: string, password: string): Promise<Omit<User, 'passwordHash'>> {
    try {
      const authResponse = await this.authService.login({ email, password });
      return authResponse.user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}