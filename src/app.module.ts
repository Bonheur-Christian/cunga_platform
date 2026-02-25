import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';
import { RequestsModule } from './requests/requests.module';
import { HealthModule } from './health/health.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProductsModule,
    InventoryModule,
    SalesModule,
    RequestsModule,
    HealthModule,
    MailModule,
  ],
})
export class AppModule {}
