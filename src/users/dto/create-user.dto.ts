import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty ({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({example:"john.doe@example.com"})
  @IsEmail()
  email: string;


  @ApiProperty({example:"password123"})
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({example:"OWNER", enum: Role})
  @IsEnum(Role)
  role: Role;
}
