import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { IsStrongPassword } from '../../../common/decorators/validation.decorators';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  @IsStrongPassword()
  password: string;

  @IsString()
  @MinLength(6, { message: 'Invite code must be 6 characters' })
  @MaxLength(6, { message: 'Invite code must be 6 characters' })
  inviteCode: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;
}