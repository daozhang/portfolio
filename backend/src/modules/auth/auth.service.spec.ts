import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserRole } from '../../entities/user.entity';
import { InviteCodeService } from '../invite-code/invite-code.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let inviteCodeService: InviteCodeService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    passwordHash: 'hashedPassword',
    name: 'Test User',
    role: UserRole.ARTIST,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockInviteCodeService = {
    validateInviteCode: jest.fn(),
    markInviteCodeUsed: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: InviteCodeService,
          useValue: mockInviteCodeService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    inviteCodeService = module.get<InviteCodeService>(InviteCodeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash password with bcrypt', async () => {
      const password = 'testPassword123';
      const hashedPassword = await service.hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(await bcrypt.compare(password, hashedPassword)).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('should validate correct password', async () => {
      const password = 'testPassword123';
      const hash = await bcrypt.hash(password, 12);
      
      const result = await service.validatePassword(password, hash);
      expect(result).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hash = await bcrypt.hash(password, 12);
      
      const result = await service.validatePassword(wrongPassword, hash);
      expect(result).toBe(false);
    });
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'testPassword123',
      inviteCode: 'ABC123',
      name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockInviteCodeService.validateInviteCode.mockResolvedValue(true);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(registerDto);

      expect(result).toEqual({
        user: expect.objectContaining({
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: UserRole.ARTIST,
        }),
        token: 'jwt-token',
      });
      expect(mockInviteCodeService.markInviteCodeUsed).toHaveBeenCalledWith('ABC123', '1');
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException for invalid invite code', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockInviteCodeService.validateInviteCode.mockResolvedValue(false);

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'testPassword123',
    };

    it('should login user successfully', async () => {
      const hashedPassword = await bcrypt.hash('testPassword123', 12);
      const userWithHashedPassword = { ...mockUser, passwordHash: hashedPassword };
      
      mockUserRepository.findOne.mockResolvedValue(userWithHashedPassword);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        user: expect.objectContaining({
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: UserRole.ARTIST,
        }),
        token: 'jwt-token',
      });
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const hashedPassword = await bcrypt.hash('differentPassword', 12);
      const userWithHashedPassword = { ...mockUser, passwordHash: hashedPassword };
      
      mockUserRepository.findOne.mockResolvedValue(userWithHashedPassword);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user if found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('1');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser('1');
      expect(result).toBeNull();
    });
  });
});