import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from './wallets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { User } from '../users/entities/user.entity';

describe('WalletsService', () => {
  let service: WalletsService;

  const mockWalletRepository = {
    create: jest
      .fn()
      .mockImplementation(
        (dto: Partial<Wallet>): Partial<Wallet> => ({ ...dto }),
      ),
    save: jest
      .fn()
      .mockImplementation(
        (wallet: Partial<Wallet>): Promise<Wallet> =>
          Promise.resolve({ ...wallet, id: 1 } as Wallet),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletsService,
        { provide: getRepositoryToken(Wallet), useValue: mockWalletRepository },
      ],
    }).compile();

    service = module.get<WalletsService>(WalletsService);
  });

  it('deve criar uma carteira com o saldo inicial de 1000', async () => {
    const user: User = {
      id: 1,
      name: 'Tiago',
      email: 't@t.com',
      password: '123',
    };

    const balance = 1000;
    const result = await service.create(user, balance);

    expect(result.balance).toBe(1000);
    expect(mockWalletRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        user,
        balance,
      }),
    );
  });
});
