import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class InviteUserDTO {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'OWNER', enum: Role })
  @IsEnum(Role)
  role: Role;
}
