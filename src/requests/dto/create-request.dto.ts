import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateProductRequestDto {
  @ApiProperty({ description: 'ID of the product being requested' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Quantity of the product being requested' })
  @IsInt()
  @Min(1)
  quantity: number;
}
