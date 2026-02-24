import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'generated/prisma/enums';
import { CreateProductWithInventoryDto } from './dto/create-product-with-inventory.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //create a product

  @ApiOperation({ summary: 'Create a new product with inventory only Stock Manager' })
  @Roles(Role.STOCK_MANAGER)
  @Post('/create')
  async createProduct(@Body() createProductDto: CreateProductWithInventoryDto) {
    return this.productsService.createProductWithInventory(createProductDto);
  }

  //get all products
  @ApiOperation({summary:'Get all products with their inventory details'})
  @Get('/all')
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  //get product by id
  @ApiOperation({summary:'Get a product by its ID'})
  @Get('/:id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  //get  expired products
  @ApiOperation({summary:'Get all expired products'})
  @Get('/expired')
  async getExpiredProducts() {
    return this.productsService.getExpiredProducts();
  }

  ///Get Products in shop 
  @ApiOperation({summary:'Get all products available in the shop'})
  @Get('/in-shop')
  async getAvailableProducts() {
    return this.productsService.getProductsInShop();
  }

  
  //update product by id
  @ApiOperation({ summary: 'Update a product by its ID only Stock Manager' })
  @Roles(Role.STOCK_MANAGER)
  @Patch('/update/:id')
  async updateProductById(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProductById(id, updateProductDto);
  }

  //delete product by id
  @ApiOperation({ summary: 'Delete a product by its ID only Stock Manager' })
  @Roles(Role.STOCK_MANAGER)
  @Delete('/delete/:id')
  async deleteProductById(@Param('id') id: string) {
    return this.productsService.deleteProductById(id);
  }
}
