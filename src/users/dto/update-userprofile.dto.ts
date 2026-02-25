import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserProfileDTO {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the user',
  })
  @IsString()
  email?: string;

  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  @IsString()
  password?: string;
}
