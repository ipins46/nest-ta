import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { UserCreatorDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDto } from './models/user-update.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

  constructor(private useService: UserService) {

  }

  @Get()
  async all(): Promise<User[]> {
    return this.useService.all();
  }

  @Post()
  async create(@Body() body: UserCreatorDto): Promise<User> {
    const password = await bcrypt.hash('1234', 12);
    console.log('create user', body);
    return this.useService.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password
    });
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.useService.findOne({id});
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UserUpdateDto
  ) {
    await this.useService.update(id, body);

    return this.useService.findOne({id});
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.useService.delete(id);
  }
}
