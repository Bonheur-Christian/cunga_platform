import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InventoryService {
    constructor (private readonly prisma:PrismaService){}


    //detele inventory
    
}
