import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../src/prisma/prisma.service';

// Minimal module for seeding
import { Module } from '@nestjs/common';
import { PrismaModule } from '../src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
})
class SeedModule {}

async function main() {
  const app = await NestFactory.create(SeedModule);
  const prisma = app.get(PrismaService);

  console.log('Database URL:', process.env.DATABASE_URL);
  const saltRounds = 10;

  try {
    const existingOwner = await prisma.user.findFirst({
      where: {
        role: Role.OWNER,
      },
    });

    if (existingOwner) {
      console.log('Owner already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash('owner@123', saltRounds);

    const owner = await prisma.user.create({
      data: {
        name: 'Business Owner',
        email: 'owner@gmail.com',
        password: hashedPassword,
        role: Role.OWNER,
      },
    });

    console.log('Owner created:', owner);
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await app.close();
  }
}

main();
