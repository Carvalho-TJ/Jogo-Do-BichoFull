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
import { Draw } from '../draws/entities/draw.entity';
import { User } from '../users/entities/user.entity';
import { UpdateBetDto } from './dto/update-bet.dto';

@Injectable()
export class BetsService {
  async findWinnersByDraw(drawId: number) {
    const draw = await this.dataSource
      .getRepository(Draw)
      .findOne({ where: { id: drawId } });

    if (!draw || (!draw.winningNumber && !draw.winningMilhar)) {
      console.error(
        'ERRO: Sorteio não encontrado ou número sorteado está nulo!',
      );
      return [];
    }

    const pendingBets: Bet[] = await this.dataSource.query(
      `SELECT * FROM bets ORDER BY id DESC LIMIT 1`,
    );

    const winnersOfThisRun: Bet[] = [];
    const winningMilhar = String(
      draw.winningNumber || draw.winningMilhar,
    ).padStart(4, '0');

    type BetWithUserId = {
      userId?: number;
      user_id?: number;
    } & Record<string, any>;

    for (const bet of pendingBets as BetWithUserId[]) {
      let isWinner = false;
      const chosen = String(bet.chosenNumber);

      if (String(bet.type) === 'grupo') {
        const lastTwo = parseInt(winningMilhar.slice(-2));
        const checkDezena = lastTwo === 0 ? 100 : lastTwo;
        const winningGroup = Math.ceil(checkDezena / 4);
        if (parseInt(chosen) === winningGroup) isWinner = true;
      } else if (String(bet.type) === 'dezena') {
        if (winningMilhar.endsWith(chosen.padStart(2, '0'))) isWinner = true;
      } else if (String(bet.type) === 'milhar') {
        if (winningMilhar === chosen.padStart(4, '0')) isWinner = true;
      }

      if (isWinner) {
        await this.dataSource.query(
          `UPDATE bets SET status = 'WON' WHERE id = ${bet.id}`,
        );

        // Lógica de pagamento
        const multiplier =
          String(bet.type) === 'milhar'
            ? 4000
            : String(bet.type) === 'dezena'
              ? 60
              : 18;
        const prize = Number(bet.value) * multiplier;

        const uid = bet.userId ?? bet.user_id;

        if (!uid) {
          throw new Error('User ID não encontrado na aposta');
        }

        // Atualizar saldo do usuário vencedor na carteira
        await this.dataSource.query(
          `UPDATE wallets SET balance = balance + ${prize} WHERE userId = ${uid}`,
        );

        winnersOfThisRun.push({
          ...bet,
          user: { id: uid } as User,
        } as Bet);
      } else {
        await this.dataSource.query(
          `UPDATE bets SET status = 'LOST' WHERE id = ${bet.id}`,
        );
      }
    }
    console.log('Total de Ganhadores Identificados:', winnersOfThisRun.length);
    return winnersOfThisRun;
  }
  async findAllByUser(userId: number) {
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
  async update(id: number, updateBetDto: UpdateBetDto) {
    return await this.betRepository.update(id, updateBetDto);
  }

  async remove(id: number) {
    return await this.betRepository.delete(id);
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
      const wallet = (await queryRunner.manager.findOne(Wallet, {
        where: { user: { id: userId } },
      })) as Wallet;

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
      wallet.balance = Number(currentBalance) - Number(betValue);
      await queryRunner.manager.save(Wallet, wallet);

      // Cria o registo da aposta
      const newBet = queryRunner.manager.create(Bet, {
        value: createBetDto.value,
        chosenNumber: String(createBetDto.chosenNumber),
        type: createBetDto.type,
        status: BetStatus.PENDING,
        user: { id: userId } as unknown as Bet['user'],
      });

      await queryRunner.manager.save(Bet, newBet);

      // Se deu certo, confirma tudo no banco
      await queryRunner.commitTransaction();
      return newBet;
    } catch (err: unknown) {
      // Se der qualquer erro, desfaz a retirada do dinheiro
      await queryRunner.rollbackTransaction();
      throw err instanceof Error ? err : new Error('Erro desconhecido');
    } finally {
      // Finaliza a ligação com o banco
      await queryRunner.release();
    }
  }
}
