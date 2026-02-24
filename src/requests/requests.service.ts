import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductRequestDto } from './dto/create-request.dto';
import { truncate } from 'node:fs';
import { RequestStatus } from '@prisma/client';
import { UUID } from 'node:crypto';

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProductRequest(dto: CreateProductRequestDto, user: any) {
    const inventory = await this.prisma.inventory.findFirst({
      where: {
        productId: dto.productId,
      },
    });

    if (!inventory) {
      throw new NotFoundException('Product not found in inventory');
    }

    if (dto.quantity > inventory.quantity) {
      throw new BadRequestException(
        `Requested quantity (${dto.quantity}) exceeds available stock (${inventory.quantity})`,
      );
    }

    const productRequest = await this.prisma.productRequest.create({
      data: {
        productId: dto.productId,
        quantity: dto.quantity,
        requestedBy: user.userId,
      },
    });

    return {
      message: 'Product request created successfully',
      request: productRequest,
    };
  }

  //Get Product Requests

  async getProductReques(status?: RequestStatus) {
    const requests = await this.prisma.productRequest.findMany({
      where: status ? { status } : undefined,
      include: {
        product: {
          include: {
            inventories: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return requests;
  }

  //Update Product Request Status (Approve or Reject)

  async approveRejectRequest(id: UUID, newStatus: RequestStatus) {
    const request = await this.prisma.productRequest.findUnique({
      where: { id: id },
    });

    if (!request) {
      throw new NotFoundException('Product request not found');
    }

    if (request.status === newStatus) {
      {
        throw new BadRequestException(`Request is already ${newStatus}`);
      }
    }

    const allowedTransitions: Record<RequestStatus, RequestStatus[]> = {
      [RequestStatus.PENDING]: [RequestStatus.APPROVED, RequestStatus.REJECTED],
      [RequestStatus.APPROVED]: [RequestStatus.FULFILLED],
      [RequestStatus.REJECTED]: [],
      [RequestStatus.FULFILLED]: [],
    };

    const isAllowed = allowedTransitions[request.status].includes(newStatus);

    if (!isAllowed) {
      throw new BadRequestException(
        `Cannot change status from ${request.status} to ${newStatus}`,
      );
    }

    return this.prisma.productRequest.update({
      where: { id: id },
      data: { status: newStatus },
    });
  }

  //Full fill the approved request and update inventory

  async fullfillRequest(id: UUID) {
    const request = await this.prisma.productRequest.findUnique({
      where: { id: id },
    });

    if (!request) {
      throw new NotFoundException('Product request not found');
    }

    if (request.status !== RequestStatus.APPROVED) {
      throw new BadRequestException(
        'Only approved requests can be full filled',
      );
    }

    const inventory = await this.prisma.inventory.findFirst({
      where: {
        productId: request.productId,
      },
    });

    if (!inventory) {
      throw new NotFoundException('Product not found in inventory');
    }

    const updatedRequest = await this.prisma.productRequest.update({
      where: { id: id },
      data: { status: RequestStatus.FULFILLED },
    });

    await this.prisma.inventory.update({
      where: { id: inventory.id },
      data: {
        quantity: inventory.quantity - request.quantity,
      },
    });

    return {
      message: 'Product request full filled',
      request: updatedRequest,
    };
  }

  //Delete Product Request

  async deleteProductRequest(id: UUID) {
    const request = await this.prisma.productRequest.findUnique({
      where: { id: id },
    });

    if (!request) {
      throw new NotFoundException('Product request not found');
    }

    await this.prisma.productRequest.delete({
      where: { id: id },
    });

    return {
      message: 'Product request deleted successfully',
      request: request,
    };
  }
}
