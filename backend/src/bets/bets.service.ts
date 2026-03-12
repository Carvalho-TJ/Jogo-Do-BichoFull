import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateBetDto } from './dto/create-bet.dto';
import { Bet, BetStatus } from './entities/bet.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import { UpdateBetDto } from './dto/update-bet.dto';

@Injectable()
export class BetsService {
  findAllByUser(userId: any) {
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  findOne(arg0: number) {
    throw new Error('Method not implemented.');
  }
  update(arg0: number, updateBetDto: UpdateBetDto) {
    throw new Error('Method not implemented.');
  }
  remove(arg0: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private dataSource: DataSource,
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
        throw new BadRequestException('Saldo insuficiente para realizar esta aposta.');
      }

      // Atualiza o saldo na base de dados
      wallet.balance = currentBalance - betValue;
      await queryRunner.manager.save(wallet);

      // Cria o registo da aposta
      const newBet = queryRunner.manager.create(Bet, {
        ...createBetDto,
        user: { id: userId },
        status: BetStatus.PENDING,
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
