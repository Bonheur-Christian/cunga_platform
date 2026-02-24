import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from './dto/update-user.dto';
import { InviteUserDTO } from './dto/invite-user.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  //create user function
  // async createUser(createUserDto: CreateUserDto) {
  //     const existingUser = await this.prisma.user.findUnique({
  //         where: {
  //             email: createUserDto.email
  //         }
  //     })
  //     if (existingUser) {
  //         throw new BadRequestException('User with this email already exists')
  //     }
  //     //hash password
  //     const hashedPassword = await bcrypt.hash(createUserDto.password, 15)
  //     //create user
  //     const userData = await this.prisma.user.create({
  //         data: {
  //             ...createUserDto,
  //             password: hashedPassword,
  //             role: createUserDto.role,
  //             name: createUserDto.name,
  //             email: createUserDto.email
  //         }
  //     })
  //     return new User(userData)
  // }

  //invite user

  async inviteUser(inviteUserDto: InviteUserDTO) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: inviteUserDto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 15);

    const invitedUser = await this.prisma.user.create({
      data: {
        name: inviteUserDto.name,
        email: inviteUserDto.email,
        password: hashedPassword,
        role: inviteUserDto.role,
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true if using 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // allows self-signed certificates, sometimes necessary
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: invitedUser.email,
      subject: 'Welcome to Cunga!',
      html: `
        <h2>Welcome to Cunga!</h2>
        <p>Your account has been created successfully.</p>
        <p><strong>Default Password:</strong> ${generatedPassword}</p>
        <p>Please login and change your password.</p>
      `,
    });
  }

  //get user by id
  async getUserById(id: string) {
    const userData = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    if (!userData) {
      throw new NotFoundException('User not found');
    }

    return new User(userData);
  }

  //get user by email
  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  //get all users
  async getAllUsers() {
    const usersData = await this.prisma.user.findMany();

    if (!usersData || usersData.length === 0) {
      throw new NotFoundException('No users found');
    }
    //convert to User entities (which automatically excludes password when serialized)
    return usersData.map((user) => new User(user));
  }

  //update user by id
  async updateUserById(id: string, updateUserDto: UpdateUserDTO) {
    const userData = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!userData) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being updated and if it conflicts with another user
    if (updateUserDto.email && updateUserDto.email !== userData.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: updateUserDto.email,
        },
      });
      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }
    }

    // Hash password if it's being updated
    const updateData = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 15);
    }

    // Update user
    const updatedUserData = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return {
      message: 'User updated successfully',
      user: new User(updatedUserData),
    };
  }

  //delete user

  async deleteUserById(id: string) {
    const userToDelete = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!userToDelete) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    return {
      message: 'User deleted successfully',
    };
  }
}
