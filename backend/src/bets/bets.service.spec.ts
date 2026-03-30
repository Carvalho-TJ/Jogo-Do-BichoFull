import { Test, TestingModule } from '@nestjs/testing';
import { BetsService } from './bets.service';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { CreateBetDto } from './dto/create-bet.dto';
import { BetType } from './entities/bet.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bet } from './entities/bet.entity';

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

  const mockBetRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BetsService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: getRepositoryToken(Bet),
          useValue: mockBetRepository,
        },
      ],
    }).compile();

    service = module.get<BetsService>(BetsService);
  });

  it('deve lançar erro se o saldo for insuficiente', async () => {
    // Simulando carteira com apenas R$ 10,00
    mockQueryRunner.manager.findOne.mockResolvedValue({ balance: 10.0 });

    const betDto: CreateBetDto = {
      value: 50.0,
      chosenNumber: '5',
      animalName: 'Cachorro',
      type: BetType.MILHAR,
    } as CreateBetDto;

    await expect(service.create(1, betDto)).rejects.toThrow(
      BadRequestException,
    );

    // Garante que o commit NÃO foi chamado e o rollback FOI chamado
    expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
  });

  it('deve subtrair o saldo corretamente em uma aposta válida', async () => {
    // Simulando carteira com R$ 1000,00
    const mockWallet = { balance: 1000.0 };
    mockQueryRunner.manager.findOne.mockResolvedValue(mockWallet);
    mockQueryRunner.manager.create.mockReturnValue({
      id: 1,
      ...{ value: 100 },
    });
    mockQueryRunner.manager.save.mockResolvedValue({ id: 1 });

    const betDto: CreateBetDto = {
      value: 100,
      chosenNumber: '10',
      animalName: 'Gato',
      type: BetType.MILHAR,
    } as CreateBetDto;

    await service.create(1, betDto);

    // Verifica se o saldo foi atualizado para 900
    expect(mockWallet.balance).toBe(900);
    expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
  });
});
