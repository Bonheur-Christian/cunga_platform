import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty ({ example: 'john@example.com', description: 'Email of the user' })
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty ({ example: 'password123', description: 'Password of the user (min length 6)' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}   