import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { DeactivateInviteCodeDto } from './dto/deactivate-invite-code.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Get admin dashboard statistics
   */
  @Get('dashboard')
  async getDashboardStats(@CurrentUser() user: any) {
    return this.adminService.getDashboardStats(user.id);
  }

  /**
   * Generate a new invite code
   */
  @Post('invite-codes')
  @HttpCode(HttpStatus.CREATED)
  async generateInviteCode(@CurrentUser() user: any) {
    const code = await this.adminService.generateInviteCode(user.id);
    return { code };
  }

  /**
   * Get all invite codes
   */
  @Get('invite-codes')
  async getAllInviteCodes(@CurrentUser() user: any) {
    return this.adminService.getAllInviteCodes(user.id);
  }

  /**
   * Deactivate an invite code
   */
  @Put('invite-codes/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateInviteCode(
    @Body() deactivateDto: DeactivateInviteCodeDto,
    @CurrentUser() user: any,
  ) {
    await this.adminService.deactivateInviteCode(deactivateDto.code, user.id);
    return { message: 'Invite code deactivated successfully' };
  }

  /**
   * Get all users with statistics
   */
  @Get('users')
  async getAllUsers(@CurrentUser() user: any) {
    return this.adminService.getAllUsers(user.id);
  }

  /**
   * Update user role
   */
  @Put('users/:userId/role')
  @HttpCode(HttpStatus.OK)
  async updateUserRole(
    @Param('userId') userId: string,
    @Body() updateRoleDto: UpdateUserRoleDto,
    @CurrentUser() user: any,
  ) {
    await this.adminService.updateUserRole(userId, updateRoleDto.role, user.id);
    return { message: 'User role updated successfully' };
  }

  /**
   * Create a new admin user
   */
  @Post('users/admin')
  @HttpCode(HttpStatus.CREATED)
  async createAdminUser(
    @Body() createAdminDto: CreateAdminDto,
    @CurrentUser() user: any,
  ) {
    const newAdmin = await this.adminService.createAdminUser(
      createAdminDto.email,
      createAdminDto.password,
      createAdminDto.name,
      user.id,
    );

    // Return user without password hash
    const { passwordHash, ...adminUser } = newAdmin;
    return adminUser;
  }
}