import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateProductWithInventoryDto {
  @ApiProperty({ example: 'Milk', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 2.99, description: 'Price of the product' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 100, description: 'Quantity of the product in stock' })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiProperty({ example: '2024-12-31', description: 'Expiry date of the product (optional)' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}
