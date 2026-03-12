import { Test, TestingModule } from '@nestjs/testing';
import { BetsController } from './bets.controller';
import { BetsService } from './bets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('BetsController', () => {
  let controller: BetsController;

  const mockBetsService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BetsController],
      providers: [
        {
          provide: BetsService,
          useValue: mockBetsService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<BetsController>(BetsController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });
});