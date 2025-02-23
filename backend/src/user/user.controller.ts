import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { create } from 'domain';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService : UserService,
  ) {}

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id : number) {
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post()
  createUser(@Body() createUserDto : CreateUserDto ) {
    return this.userService.createUser(createUserDto);
  }
}