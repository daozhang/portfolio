import { IsString, IsNotEmpty, Length } from 'class-validator';

export class DeactivateInviteCodeDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}