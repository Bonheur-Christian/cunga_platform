import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductWithInventoryDto } from './dto/create-product-with-inventory.dto';
import { Inventory, InventoryLocation } from '@prisma/client';
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  //creaet a product

  async createProductWithInventory(dto: CreateProductWithInventoryDto) {
    const { name, price, quantity, expiryDate } = dto;

    return this.prisma.$transaction(async (tx) => {
      // 1. Create product
      const product = await tx.product.create({
        data: {
          name,
          price,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
        },
      });

      // 2. Create inventory
      const inventory = await tx.inventory.create({
        data: {
          productId: product.id,
          quantity,
          inStock: quantity > 0,
          location: InventoryLocation.STOCK,
        },
      });

      return {
        product,
        inventory,
      };
    });
  }

  //get all products
  async getAllProducts() {
    const Products = await this.prisma.product.findMany({
      include: { inventories: true },
    });

    if (!Products || Products.length === 0) {
      throw new NotFoundException('No products found');
    }
    return { message: 'Products fetched successfully', products: Products };
  }

  //get product by id
  async getProductById(id: string) {
    const Product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!Product) {
      throw new NotFoundException('Product not found');
    }
  }

  //get expired products
  async getExpiredProducts() {
    const now = new Date();
    const expiredProducts = await this.prisma.product.findMany({
      where: {
        expiryDate: {
          lt: now,
        },
      },
    });

    if (!expiredProducts || expiredProducts.length === 0) {
      throw new NotFoundException('No expired products found');
    }
    return {
      message: 'Expired products fetched successfully',
      products: expiredProducts,
    };
  }

  //update product by id
  async updateProductById(id: string, dto: UpdateProductDto) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id },
        include: { inventories: true },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // 🔹 Update Product fields
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          name: dto.name,
          price: dto.price,
          expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
        },
      });

      // 🔹 Update Inventory fields
      let updatedInventory: Inventory | null = null;

      if (dto.quantity !== undefined) {
        updatedInventory = await tx.inventory.update({
          where: { id: product.inventories[0].id },
          data: {
            quantity: dto.quantity,
            inStock: dto.quantity > 0,
          },
        });
      }

      return {
        message: 'Product updated successfully',
        product: updatedProduct,
        inventory: updatedInventory,
      };
    });
  }

  //Get Products in Shop
  async getProductsInShop() {
    const productsInShop = await this.prisma.product.findMany({
      where: {
        inventories: {
          some: {
            location: InventoryLocation.SHOP,
            inStock: true,
          },
        },
      },
      include: { inventories: true },
    });

    if (!productsInShop || productsInShop.length === 0) {
      throw new NotFoundException('No products in shop found');
    }
    return {
      message: 'Products in shop fetched successfully',
      products: productsInShop,
    };
  }

  ///Get Products in Stock

  async getProductsInStock() {
    const productsInStock = await this.prisma.product.findMany({
      where: {
        inventories: {
          some: {
            location: InventoryLocation.STOCK,
            inStock: true,
          },
        },
      },
      include: { inventories: true },
    });

    if (!productsInStock || productsInStock.length === 0) {
      throw new NotFoundException('No products in stock found');
    }
    
    return {
      message: 'Products in stock fetched successfully',
      products: productsInStock,
    };
  }

  //delete product by id
  async deleteProductById(id: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Delete inventory

      await tx.inventory.deleteMany({
        where: { productId: id },
      });

      // 2. Delete product
      const Product = await tx.product.delete({
        where: { id },
      });

      if (!Product) {
        throw new NotFoundException('Product not found');
      }

      return { message: 'Product deleted successfully', product: Product };
    });
  }
}
