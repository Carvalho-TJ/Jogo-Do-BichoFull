import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private walletsService: WalletsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const { password, ...userData } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // Primeiro salva o usuario
    const savedUser = await this.usersRepository.save(newUser);

    // Depois Cria a carteira com R$ 1.000,00 para esse usuário
    await this.walletsService.create(savedUser, 1000.0);

    const { password: _, ...result } = savedUser;
    return result;
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.usersRepository.find();
    return users.map(({ password, ...user }) => user);
  }

  async findOne(id: number): Promise<Partial<User>> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`Usuário ${id} não encontrado`);

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updatedUser = Object.assign(user, updateUserDto);
    const saved = await this.usersRepository.save(updatedUser);

    const { password, ...result } = saved;
    return result;
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`Usuário ${id} não encontrado`);

    await this.usersRepository.remove(user);
  }
}
