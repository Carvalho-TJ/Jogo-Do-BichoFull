/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { WalletsService } from '../wallets/wallets.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository: Partial<Record<keyof Repository<User>, jest.Mock>> =
    {
      create: jest.fn().mockImplementation(
        (dto: CreateUserDto): Partial<User> => ({
          name: dto.name,
          email: dto.email,
          password: dto.password,
        }),
      ),
      save: jest
        .fn()
        .mockImplementation(
          (user: Partial<User>): Promise<User> =>
            Promise.resolve({ ...user, id: 1 } as User),
        ),
    };

  const mockWalletsService = {
    create: jest.fn().mockResolvedValue({ id: 1, balance: 1000 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: WalletsService,
          useValue: mockWalletsService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('deve criptografar a senha ao criar um usuário', async () => {
    const password = 'senha_limpa_123';
    const userDto: CreateUserDto = {
      name: 'Tiago',
      email: 't@t.com',
      password,
    };

    await expect(service.create(userDto)).resolves.toBeDefined();

    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        password: expect.not.stringMatching(password),
      }),
    );
  });
});
