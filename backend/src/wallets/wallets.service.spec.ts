import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from './wallets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';

describe('WalletsService', () => {
  let service: WalletsService;

  const mockWalletRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(wallet => Promise.resolve({ id: 1, ...wallet })),
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
    const user = { id: 1 } as any;
    const balance = 1000;
    const result = await service.create(user, balance);

    expect(result.balance).toBe(1000);
    expect(mockWalletRepository.save).toHaveBeenCalled();
  });
});
