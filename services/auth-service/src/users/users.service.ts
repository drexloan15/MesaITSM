import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateUserData {
  email: string;
  username: string;
  fullName: string;
  passwordHash: string;
  phone?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { userRoles: { include: { role: { include: { rolePermissions: { include: { permission: true } } } } } } },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { userRoles: { include: { role: true } } },
    });
  }

  create(data: CreateUserData) {
    return this.prisma.user.create({ data });
  }

  updateLastLogin(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }
}
