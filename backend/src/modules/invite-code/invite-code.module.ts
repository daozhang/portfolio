import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteCode } from '../../entities/invite-code.entity';
import { InviteCodeService } from './invite-code.service';

@Module({
  imports: [TypeOrmModule.forFeature([InviteCode])],
  providers: [InviteCodeService],
  exports: [InviteCodeService],
})
export class InviteCodeModule {}