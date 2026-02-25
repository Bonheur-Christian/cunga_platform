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

  //invite user only owner can invite user

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
        name: inviteUserDto.role,
        email: inviteUserDto.email,
        password: hashedPassword,
        role: inviteUserDto.role,
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // false if using 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // tls: {
      //   rejectUnauthorized: false, // allows self-signed certificates, sometimes necessary
      // },
    });

    // await transporter.sendMail({
    //   from: process.env.SMTP_USER,
    //   to: invitedUser.email,
    //   subject: 'Welcome to Cunga!',
    //   html: `
    //     <h2>Welcome to Cunga!</h2>
    //     <p>Your account has been created successfully.</p>
    //     <p><strong>Default Password:</strong> ${generatedPassword}</p>
    //     <p>Please login and change your password.</p>
    //   `,
    // });

    const loginUrl = 'https://your-cunga-app-url.com/login'; // Add your actual login URL here

    await transporter.sendMail({
      from: `"Cunga Team" <${process.env.SMTP_USER}>`,
      to: invitedUser.email,
      subject: 'You have been invited to join Cunga!',
      text: `Welcome to Cunga! Your account has been created. Your default password is: ${generatedPassword}. Please login at ${loginUrl} and change your password immediately.`, // Good practice to include a plain-text fallback
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 20px; color: #333333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        
        <div style="background-color: #0056b3; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">Cunga</h1>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="margin-top: 0; font-size: 22px; color: #1a1a1a;">Welcome aboard!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #555555;">
            Owner has Invited you to joing the platform as ${invitedUser.role}.
          </p>
          
          <div style="background-color: #f8f9fa; border-left: 4px solid #0056b3; padding: 15px 20px; margin: 25px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 16px;">
              <strong>Default Password:</strong> 
              <span style="font-family: monospace; background: #e9ecef; padding: 4px 8px; border-radius: 4px; letter-spacing: 1px;">${generatedPassword}</span>
            </p>
             <p style="margin: 0; font-size: 16px;">
              <strong>Email:</strong> 
              <span style="font-family: monospace; background: #e9ecef; padding: 4px 8px; border-radius: 4px; letter-spacing: 1px;">${invitedUser.email}</span>
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555555; font-weight: bold;">
            Please log in now using the temporary password and change your credentials right after your first login to keep your account secure.
          </p>
          
          <div style="text-align: center; margin: 35px 0 20px;">
            <a href="${loginUrl}" style="background-color: #0056b3; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">Log In to Cunga</a>
          </div>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
          <p style="margin: 0; font-size: 12px; color: #999999;">
            If you did not expect this email, please ignore it or contact our support team.
          </p>
          <p style="margin: 10px 0 0; font-size: 12px; color: #999999;">
            &copy; ${new Date().getFullYear()} Cunga. All rights reserved.
          </p>
        </div>
        
      </div>
    </div>
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
