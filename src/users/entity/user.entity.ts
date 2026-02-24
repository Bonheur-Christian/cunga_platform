import { Role } from '@prisma/client';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  // Remove password when serializing to JSON
  toJSON() {
    const { password, ...result } = this;
    return result;
  }
}
