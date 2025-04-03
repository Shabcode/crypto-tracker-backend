import { Injectable, BadRequestException, UnauthorizedException, Unlock } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {} 

  async CreateUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    try {
        const user = await this.prisma.user.create({
            data: {
                email: createUserDto.email,
                password: hashedPassword,
            },
        });
        return user;
    }   catch (error) {
        if (error.code === 'P2002') {
            throw new BadRequestException('Email already exists');
        }
        throw error;
    }
  }

}