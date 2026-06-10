import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException, 
  Logger
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(UserService.name);

async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10); //criptografando a senha

      const createdUser = await this.prisma.users.create({
        data: {
          username: createUserDto.username ?? '',
          name: createUserDto.name,
          email: createUserDto.email,
          password_hash: hashedPassword,
          profile_picture_url: createUserDto.profile_picture_url ?? '',
        },
      });

      // Remove o password_hash do retorno
      const { password_hash, ...userSemPassword } = createdUser;
      
      return userSemPassword;

    } catch (error: any) {
      // Grava o erro dos logs do servidor
      this.logger.error(`Falha ao criar usuário: ${error.message}`, error.stack);

      // Captura erros conhecidos do Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        
        // P2002:  E-mail ou Username já cadastrados
        if (error.code === 'P2002') {
          // Opcional: Descobrir qual campo falhou: email ou username
          const targets = (error.meta?.target as string[]) || [];
          const conflitedField = targets.includes('email') ? 'E-mail' : 'Username';
          
          throw new ConflictException(
            `Este ${conflitedField} já está sendo utilizado por outra conta.`
          );
        }
      }

      // Erro genérico de segurança
      throw new InternalServerErrorException(
        'Ocorreu um erro interno ao processar o seu cadastro. Tente novamente mais tarde.'
      );
    }
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
      dataToUpdate.password_hash = await bcrypt.hash(
        updateUserDto.password,
        10,
      );
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

  async recoverPassword(email: string, newPassword: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException("Usuário não existente.")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.users.update({
      where: { email },
      data : {
        password_hash: hashedPassword,
      },
    });

    return {
      message: "Senha atualizada com sucesso.",
    };
  }
}