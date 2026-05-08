import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService){}

  async create(createUserDto: CreateUserDto) {
  const createdUser = await this.prisma.users.create({
    data: {
      username: createUserDto.username ?? '',
      name: createUserDto.name,
      email: createUserDto.email,
      password_hash: await bcrypt.hash(createUserDto.password, 10),
      profile_picture_url: createUserDto.profile_picture_url ?? '',
    },
  });

  return createdUser;
}

  findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: {email},
    });
  }


  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
