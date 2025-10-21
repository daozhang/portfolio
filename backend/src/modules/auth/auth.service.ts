import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../entities/user.entity';
import { InviteCodeService } from '../invite-code/invite-code.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private inviteCodeService: InviteCodeService,
  ) {}

  /**
   * Register a new user with invite code validation
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, inviteCode, name } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate invite code
    const isValidInviteCode = await this.inviteCodeService.validateInviteCode(inviteCode);
    if (!isValidInviteCode) {
      throw new BadRequestException('Invalid or expired invite code');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = this.userRepository.create({
      email,
      passwordHash,
      name,
      role: UserRole.ARTIST, // Default role
    });

    const savedUser = await this.userRepository.save(user);

    // Mark invite code as used
    await this.inviteCodeService.markInviteCodeUsed(inviteCode, savedUser.id);

    // Generate JWT token
    const token = this.generateToken(savedUser);

    return {
      user: this.excludePassword(savedUser),
      token,
    };
  }

  /**
   * Login user with email and password
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await this.validatePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      user: this.excludePassword(user),
      token,
    };
  }

  /**
   * Validate user by ID (for JWT strategy)
   */
  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  /**
   * Hash password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Validate password against hash
   */
  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Remove password from user object
   */
  private excludePassword(user: User): Omit<User, 'passwordHash'> {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}