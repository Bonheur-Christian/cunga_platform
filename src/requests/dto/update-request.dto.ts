import { PartialType } from '@nestjs/mapped-types';
import { CreateProductRequestDto } from './create-request.dto';

export class UpdateProductrequestDto extends PartialType(
  CreateProductRequestDto,
) {}
