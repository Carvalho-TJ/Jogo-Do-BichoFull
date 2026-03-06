import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { WalletsService } from '../wallets/wallets.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(user => Promise.resolve({ id: 1, ...user })),
  };

  const mockWalletsService = {
    create: jest.fn().mockResolvedValue({ id: 1, balance: 1000 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: WalletsService, useValue: mockWalletsService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('deve criptografar a senha ao criar um usuário', async () => {
    const password = 'senha_limpa_123';
    const userDto = { name: 'Tiago', email: 't@t.com', password };

    const result = await service.create(userDto as any);

    expect(result).toBeDefined();
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        password: expect.not.stringMatching(password),
      }),
    );
  });
});
