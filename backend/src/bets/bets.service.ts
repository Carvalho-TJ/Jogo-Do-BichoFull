import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBetDto } from './dto/create-bet.dto';
import { Bet, BetStatus } from './entities/bet.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import { UpdateBetDto } from './dto/update-bet.dto';
import { Draw } from '../draws/entities/draw.entity';

@Injectable()
export class BetsService {
  async findWinnersByDraw(drawId: number, currentUserId: number) {
    const drawRepository = this.dataSource.getRepository(Draw);
    const draw = await this.dataSource
      .getRepository(Draw)
      .findOne({ where: { id: drawId } });

    if (!draw || (!draw.winningNumber && !draw.winningMilhar)) {
      console.error(
        'ERRO: Sorteio não encontrado ou número sorteado está nulo!',
      );
      return [];
    }

    const pendingBets = await this.dataSource.query(
      `SELECT * FROM bets ORDER BY id DESC LIMIT 1`,
    );

    if (pendingBets.length === 0) {
      const sample = await this.dataSource.query(
        'SELECT id, status FROM bets ORDER BY id DESC LIMIT 5',
      );
    }

    const winnersOfThisRun: Bet[] = [];
    const winningMilhar = String(
      draw.winningNumber || draw.winningMilhar,
    ).padStart(4, '0');

    for (const bet of pendingBets) {
      let isWinner = false;
      const chosen = String(bet.chosenNumber);

      const currentBetUserId = bet.userId || bet.user_id;

      if (bet.type === 'grupo') {
        const lastTwo = parseInt(winningMilhar.slice(-2));
        const checkDezena = lastTwo === 0 ? 100 : lastTwo;
        const winningGroup = Math.ceil(checkDezena / 4);
        if (parseInt(chosen) === winningGroup) isWinner = true;
      } else if (bet.type === 'dezena') {
        if (winningMilhar.endsWith(chosen.padStart(2, '0'))) isWinner = true;
      } else if (bet.type === 'milhar') {
        if (winningMilhar === chosen.padStart(4, '0')) isWinner = true;
      }

      if (isWinner) {
        await this.dataSource.query(
          `UPDATE bets SET status = 'WON' WHERE id = ${bet.id}`,
        );

        // Lógica de pagamento
        const multiplier =
          bet.type === 'milhar' ? 4000 : bet.type === 'dezena' ? 60 : 18;
        const prize = bet.value * multiplier;

        const uid = bet.userId || bet.user_id;

        // Atualizar saldo do usuário vencedor na carteira
        await this.dataSource.query(
          `UPDATE wallets SET balance = balance + ${prize} WHERE userId = ${uid}`,
        );

        winnersOfThisRun.push({
          ...bet,
          user: { id: uid },
        });
      } else {
        await this.dataSource.query(
          `UPDATE bets SET status = 'LOST' WHERE id = ${bet.id}`,
        );
      }
      // Salva o novo status da aposta
      await this.betRepository.save(bet);
    }
    console.log('Total de Ganhadores Identificados:', winnersOfThisRun.length);
    return winnersOfThisRun;
  }
  async findAllByUser(userId: any) {
    try {
      return await this.betRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      console.error('Erro ao buscar apostas:', error);
      throw new InternalServerErrorException(
        'Não foi possível carregar seu histórico.',
      );
    }
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  async findOne(id: number) {
    return await this.betRepository.findOne({ where: { id } });
  }
  update(arg0: number, updateBetDto: UpdateBetDto) {
    throw new Error('Method not implemented.');
  }
  remove(arg0: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Bet)
    private readonly betRepository: Repository<Bet>,
  ) {}

  async create(userId: number, createBetDto: CreateBetDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Busca a carteira dentro da transação
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { user: { id: userId } },
      });

      if (!wallet) {
        throw new BadRequestException('Carteira não encontrada.');
      }

      // Validação de Saldo
      const betValue = Number(createBetDto.value);
      const currentBalance = Number(wallet.balance);

      if (currentBalance < betValue) {
        throw new BadRequestException(
          'Saldo insuficiente para realizar esta aposta.',
        );
      }

      // Atualiza o saldo na base de dados
      wallet.balance = currentBalance - betValue;
      await queryRunner.manager.save(wallet);

      // Cria o registo da aposta
      const newBet = queryRunner.manager.create(Bet, {
        value: createBetDto.value,
        chosenNumber: String(createBetDto.chosenNumber),
        type: createBetDto.type,
        status: BetStatus.PENDING,
        user: { id: userId } as any,
      });

      const savedBet = await queryRunner.manager.save(newBet);

      // Se deu certo, confirma tudo no banco
      await queryRunner.commitTransaction();
      return savedBet;
    } catch (err) {
      // Se der qualquer erro, desfaz a retirada do dinheiro
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Finaliza a ligação com o banco
      await queryRunner.release();
    }
  }
}
