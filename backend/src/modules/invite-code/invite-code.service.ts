import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InviteCode } from '../../entities/invite-code.entity';

@Injectable()
export class InviteCodeService {
  constructor(
    @InjectRepository(InviteCode)
    private inviteCodeRepository: Repository<InviteCode>,
  ) {}

  /**
   * Generate a unique 6-digit invite code
   */
  async generateInviteCode(createdBy: string): Promise<string> {
    let code: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      code = this.generateSixDigitCode();
      attempts++;
      
      if (attempts > maxAttempts) {
        throw new BadRequestException('Unable to generate unique invite code');
      }
    } while (await this.codeExists(code));

    const inviteCode = this.inviteCodeRepository.create({
      code,
      createdBy,
      isActive: true,
      isUsed: false,
    });

    await this.inviteCodeRepository.save(inviteCode);
    return code;
  }

  /**
   * Validate if an invite code is valid and unused
   */
  async validateInviteCode(code: string): Promise<boolean> {
    const inviteCode = await this.inviteCodeRepository.findOne({
      where: { code },
    });

    return inviteCode && inviteCode.isActive && !inviteCode.isUsed;
  }

  /**
   * Mark an invite code as used
   */
  async markInviteCodeUsed(code: string, usedBy: string): Promise<void> {
    const inviteCode = await this.inviteCodeRepository.findOne({
      where: { code },
    });

    if (!inviteCode) {
      throw new BadRequestException('Invalid invite code');
    }

    if (inviteCode.isUsed) {
      throw new BadRequestException('Invite code already used');
    }

    if (!inviteCode.isActive) {
      throw new BadRequestException('Invite code is inactive');
    }

    inviteCode.isUsed = true;
    inviteCode.usedBy = usedBy;
    inviteCode.usedAt = new Date();

    await this.inviteCodeRepository.save(inviteCode);
  }

  /**
   * Get all invite codes (admin only)
   */
  async getAllInviteCodes(): Promise<InviteCode[]> {
    return this.inviteCodeRepository.find({
      relations: ['creator', 'usedByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Deactivate an invite code
   */
  async deactivateInviteCode(code: string): Promise<void> {
    const inviteCode = await this.inviteCodeRepository.findOne({
      where: { code },
    });

    if (!inviteCode) {
      throw new BadRequestException('Invite code not found');
    }

    inviteCode.isActive = false;
    await this.inviteCodeRepository.save(inviteCode);
  }

  /**
   * Generate a random 6-digit code
   */
  private generateSixDigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Check if a code already exists
   */
  private async codeExists(code: string): Promise<boolean> {
    const existingCode = await this.inviteCodeRepository.findOne({
      where: { code },
    });
    return !!existingCode;
  }
}