import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { InviteCode } from '../../entities/invite-code.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { InviteCodeModule } from '../invite-code/invite-code.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, InviteCode]),
    InviteCodeModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}