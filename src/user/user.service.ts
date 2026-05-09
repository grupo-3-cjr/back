import { 
  Injectable, 
  ConflictException, 
  NotFoundException, 
  InternalServerErrorException 
} from '@nestjs/common';
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

async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

async findAll() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        profile_picture_url: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        profile_picture_url: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID #${id} não encontrado.`);
    }
    return user;
  }

async update(id: number, updateUserDto: UpdateUserDto) {
  
    const dataToUpdate: any = { ...updateUserDto };

 
    if (updateUserDto.password) {
      dataToUpdate.password_hash = await bcrypt.hash(updateUserDto.password, 10);
      delete dataToUpdate.password; 
    }

    try {
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: dataToUpdate,
      });

      const { password_hash, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;

    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuário com ID #${id} não encontrado.`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Username ou Email já estão em uso.');
      }
      throw error;
    }
  }

async remove(id: number) {
    try {
      const deletedUser = await this.prisma.users.delete({
        where: { id },
      });
      

      const { password_hash, ...userWithoutPassword } = deletedUser;
      return userWithoutPassword;

    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuário com ID #${id} não encontrado.`);
      }
      throw error;
    }
  }
} 