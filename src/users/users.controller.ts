import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
      return this.usersService.createUser(createUserDto);
    }
  
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
      return this.usersService.loginUser(loginUserDto);
    }
  }
