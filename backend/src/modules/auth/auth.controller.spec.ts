import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserRole } from '../../entities/user.entity';
import { InviteCodeService } from '../invite-code/invite-code.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

describe('AuthController (Integration)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userRepository: Repository<User>;
  let inviteCodeService: InviteCodeService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    passwordHash: '',
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

  const mockInviteCodeService = {
    validateInviteCode: jest.fn(),
    markInviteCodeUsed: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        JWT_SECRET: 'test-secret',
        JWT_EXPIRES_IN: '24h',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '24h' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: InviteCodeService,
          useValue: mockInviteCodeService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    inviteCodeService = moduleFixture.get<InviteCodeService>(InviteCodeService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('POST /auth/register', () => {
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

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(registerDto.email);
      expect(response.body.user.name).toBe(registerDto.name);
      expect(response.body.user.role).toBe(UserRole.ARTIST);
      expect(response.body.user).not.toHaveProperty('passwordHash');
    });

    it('should return 409 if user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(409);

      expect(response.body.message).toBe('User with this email already exists');
    });

    it('should return 400 for invalid invite code', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockInviteCodeService.validateInviteCode.mockResolvedValue(false);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);

      expect(response.body.message).toBe('Invalid or expired invite code');
    });

    it('should return 400 for invalid email format', async () => {
      const invalidDto = { ...registerDto, email: 'invalid-email' };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 for short password', async () => {
      const invalidDto = { ...registerDto, password: '123' };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 for invalid invite code length', async () => {
      const invalidDto = { ...registerDto, inviteCode: '123' };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'testPassword123',
    };

    it('should login user successfully', async () => {
      const hashedPassword = await bcrypt.hash('testPassword123', 12);
      const userWithHashedPassword = { ...mockUser, passwordHash: hashedPassword };
      
      mockUserRepository.findOne.mockResolvedValue(userWithHashedPassword);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(loginDto.email);
      expect(response.body.user).not.toHaveProperty('passwordHash');
    });

    it('should return 401 for invalid credentials', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });

    it('should return 401 for wrong password', async () => {
      const hashedPassword = await bcrypt.hash('differentPassword', 12);
      const userWithHashedPassword = { ...mockUser, passwordHash: hashedPassword };
      
      mockUserRepository.findOne.mockResolvedValue(userWithHashedPassword);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });

    it('should return 401 for invalid email format', async () => {
      const invalidDto = { ...loginDto, email: 'invalid-email' };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidDto)
        .expect(401);
    });

    it('should return 401 for missing password', async () => {
      const invalidDto = { email: loginDto.email };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidDto)
        .expect(401);
    });
  });

  describe('GET /auth/profile', () => {
    it('should return user profile for authenticated user', async () => {
      const hashedPassword = await bcrypt.hash('testPassword123', 12);
      const userWithHashedPassword = { ...mockUser, passwordHash: hashedPassword };
      
      mockUserRepository.findOne.mockResolvedValue(userWithHashedPassword);

      // First login to get token
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testPassword123',
        });

      const token = loginResponse.body.token;

      // Then access profile with token
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.email).toBe(mockUser.email);
      expect(response.body.name).toBe(mockUser.name);
      expect(response.body.role).toBe(mockUser.role);
      expect(response.body).not.toHaveProperty('passwordHash');
    });

    it('should return 401 for unauthenticated request', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully for authenticated user', async () => {
      const hashedPassword = await bcrypt.hash('testPassword123', 12);
      const userWithHashedPassword = { ...mockUser, passwordHash: hashedPassword };
      
      mockUserRepository.findOne.mockResolvedValue(userWithHashedPassword);

      // First login to get token
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testPassword123',
        });

      const token = loginResponse.body.token;

      // Then logout with token
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe('Logged out successfully');
    });

    it('should return 401 for unauthenticated request', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(401);
    });
  });
});