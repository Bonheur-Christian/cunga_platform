import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // Configure global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert types automatically
      },
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Cunga API')
    .setDescription('The Cunga API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  document.tags = [
    { name: 'Health', description: 'Server health check' },
    { name: 'Authentication', description: 'Authentication endpoints' },
    { name: 'Users', description: 'User management' },
    { name: 'Products', description: 'Product management' },
    { name: 'Inventory', description: 'Stock management' },
    { name: 'Sales', description: 'Sales operations' },
  ];

  await app.listen(process.env.PORT ?? 3030);

  console.log('Cunga API is running...');
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3030}`,
  );
  console.log(
    `Swagger docs available at: http://localhost:${process.env.PORT ?? 3030}/api-docs`,
  );
}

bootstrap();
