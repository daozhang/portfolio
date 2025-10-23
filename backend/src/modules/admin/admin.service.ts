import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { InviteCode } from '../../entities/invite-code.entity';
import { InviteCodeService } from '../invite-code/invite-code.service';

export interface UserStats {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  portfolioCount: number;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalArtists: number;
  totalAdmins: number;
  totalPortfolios: number;
  totalInviteCodes: number;
  usedInviteCodes: number;
  activeInviteCodes: number;
  recentUsers: UserStats[];
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(InviteCode)
    private inviteCodeRepository: Repository<InviteCode>,
    private inviteCodeService: InviteCodeService,
  ) {}

  /**
   * Generate a new invite code (admin only)
   */
  async generateInviteCode(adminUserId: string): Promise<string> {
    await this.validateAdminRole(adminUserId);
    return this.inviteCodeService.generateInviteCode(adminUserId);
  }

  /**
   * Get all invite codes with usage information
   */
  async getAllInviteCodes(adminUserId: string): Promise<InviteCode[]> {
    await this.validateAdminRole(adminUserId);
    return this.inviteCodeService.getAllInviteCodes();
  }

  /**
   * Deactivate an invite code
   */
  async deactivateInviteCode(code: string, adminUserId: string): Promise<void> {
    await this.validateAdminRole(adminUserId);
    await this.inviteCodeService.deactivateInviteCode(code);
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(adminUserId: string): Promise<AdminDashboardStats> {
    await this.validateAdminRole(adminUserId);

    const [
      totalUsers,
      totalArtists,
      totalAdmins,
      totalInviteCodes,
      usedInviteCodes,
      activeInviteCodes,
      recentUsers,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { role: UserRole.ARTIST } }),
      this.userRepository.count({ where: { role: UserRole.ADMIN } }),
      this.inviteCodeRepository.count(),
      this.inviteCodeRepository.count({ where: { isUsed: true } }),
      this.inviteCodeRepository.count({ where: { isActive: true, isUsed: false } }),
      this.getRecentUsers(),
    ]);

    // Get total portfolios count
    const totalPortfolios = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.portfolios', 'portfolio')
      .select('COUNT(portfolio.id)', 'count')
      .getRawOne()
      .then(result => parseInt(result.count) || 0);

    return {
      totalUsers,
      totalArtists,
      totalAdmins,
      totalPortfolios,
      totalInviteCodes,
      usedInviteCodes,
      activeInviteCodes,
      recentUsers,
    };
  }

  /**
   * Get all users with statistics
   */
  async getAllUsers(adminUserId: string): Promise<UserStats[]> {
    await this.validateAdminRole(adminUserId);

    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.portfolios', 'portfolio')
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.role',
        'user.createdAt',
        'COUNT(portfolio.id) as portfolioCount',
      ])
      .groupBy('user.id')
      .orderBy('user.createdAt', 'DESC')
      .getRawMany();

    return users.map(user => ({
      id: user.user_id,
      email: user.user_email,
      name: user.user_name,
      role: user.user_role,
      portfolioCount: parseInt(user.portfolioCount) || 0,
      createdAt: user.user_createdAt,
    }));
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(
    userId: string,
    newRole: UserRole,
    adminUserId: string,
  ): Promise<void> {
    await this.validateAdminRole(adminUserId);

    // Prevent admin from demoting themselves
    if (userId === adminUserId && newRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Cannot change your own admin role');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    user.role = newRole;
    await this.userRepository.save(user);
  }

  /**
   * Create a new admin user (admin only)
   */
  async createAdminUser(
    email: string,
    password: string,
    name: string,
    adminUserId: string,
  ): Promise<User> {
    await this.validateAdminRole(adminUserId);

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ForbiddenException('User with this email already exists');
    }

    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(password, 10);

    const adminUser = this.userRepository.create({
      email,
      passwordHash,
      name,
      role: UserRole.ADMIN,
    });

    return this.userRepository.save(adminUser);
  }

  /**
   * Get recent users for dashboard
   */
  private async getRecentUsers(): Promise<UserStats[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.portfolios', 'portfolio')
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.role',
        'user.createdAt',
        'COUNT(portfolio.id) as portfolioCount',
      ])
      .groupBy('user.id')
      .orderBy('user.createdAt', 'DESC')
      .limit(10)
      .getRawMany();

    return users.map(user => ({
      id: user.user_id,
      email: user.user_email,
      name: user.user_name,
      role: user.user_role,
      portfolioCount: parseInt(user.portfolioCount) || 0,
      createdAt: user.user_createdAt,
    }));
  }

  /**
   * Validate that the user has admin role
   */
  private async validateAdminRole(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }
  }
}