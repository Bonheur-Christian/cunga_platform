import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateProductRequestDto } from './dto/create-request.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'generated/prisma/enums';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RequestStatus } from '@prisma/client';
import { UUID } from 'node:crypto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  //Create product request by shop keeper

  @ApiOperation({ summary: 'Create a product request only shop keeper' })
  @Roles(Role.SHOP_KEEPER)
  @Post('/create')
  async createProductRequest(
    @Body(ValidationPipe) createRequestDto: CreateProductRequestDto,
    @Req() req: any,
  ) {
    return this.requestsService.createProductRequest(
      createRequestDto,
      req.user,
    );
  }

  //Get Product Requests

  @ApiOperation({ summary: 'Get List of Product Requests' })
  @Get('/all')
  async getProductRequests(@Query('status') status?: RequestStatus) {
    return this.requestsService.getProductReques(status);
  }

  //Approve or Reject Product Request

  @ApiOperation({
    summary: 'Approve or Reject Product Request only for Stock Manager',
  })
  @Roles(Role.STOCK_MANAGER)
  @Patch('/update-status')
  async updateRequestStatus(
    @Query('id') id: any,
    @Query('status') status: RequestStatus,
  ) {
    return this.requestsService.approveRejectRequest(id, status);
  }


  @ApiOperation({
    summary: 'Fulfill a product request only for Stock Manager',
  })
  @Roles(Role.STOCK_MANAGER)
  @Patch('/fulfill')
  async fulfillRequest(@Query('id') id: any) {
    return this.requestsService.fullfillRequest(id);
  }



  //Delete Request

  @ApiOperation({ summary: 'Delete a product request only shop keeper' })
  @Roles(Role.SHOP_KEEPER)
  @Delete('/delete')
  async deleteProductRequest(@Query('id') id: any) {
    return this.requestsService.deleteProductRequest(id);
  }
}
