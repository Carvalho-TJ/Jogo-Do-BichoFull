import { Test, TestingModule } from '@nestjs/testing';
import { BetsService } from './bets.service';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { BetStatus } from './entities/bet.entity';

describe('BetsService (Lógica de Saldo)', () => {
  let service: BetsService;

  // Simular a transação com dados mockados
  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BetsService,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<BetsService>(BetsService);
  });

  it('deve lançar erro se o saldo for insuficiente', async () => {
    // Simulando carteira com apenas R$ 10,00
    mockQueryRunner.manager.findOne.mockResolvedValue({ balance: 10.00 });

    const betDto = { value: 50.00, chosenNumber: 5, animalName: 'Cachorro' };

    await expect(service.create(1, betDto as any))
      .rejects.toThrow(BadRequestException);
    
    // Garante que o commit NÃO foi chamado e o rollback FOI chamado
    expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
  });

  it('deve subtrair o saldo corretamente em uma aposta válida', async () => {
    // Simulando carteira com R$ 1000,00
    const mockWallet = { balance: 1000.00 };
    mockQueryRunner.manager.findOne.mockResolvedValue(mockWallet);
    mockQueryRunner.manager.create.mockReturnValue({ id: 1, ...{ value: 100 } });
    mockQueryRunner.manager.save.mockResolvedValue({ id: 1 });

    await service.create(1, { value: 100, chosenNumber: 10, animalName: 'Gato' } as any);

    // Verifica se o saldo foi atualizado para 900
    expect(mockWallet.balance).toBe(900);
    expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
  });
});