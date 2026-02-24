import { PartialType } from '@nestjs/mapped-types';
import { CreateProductWithInventoryDto } from './create-product-with-inventory.dto';

export class UpdateProductDto extends PartialType(CreateProductWithInventoryDto) {}
