import { Injectable, BadRequestException, UnauthorizedException, Unlock } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {} 

  async createUser(createUserDto: CreateUserDto) {
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
  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
        where: {email: loginUserDto.email},
    });
    if (!user) {
        throw new UnauthorizedException('User does not exist');
    }
    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password); 
    if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
    }
    const payload = {sub: user.id, email: user.email};
    return {
        access_token: await this.jwtService.signAsync(payload);
    }
  }
}