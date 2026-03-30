import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Bet, BetStatus, BetType } from '../bets/entities/bet.entity';
import { Draw } from './entities/draw.entity';

@Injectable()
export class DrawsService {
  constructor(private dataSource: DataSource) {}

  async getHistory() {
    return this.dataSource.getRepository(Draw).find({
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async runDraw() {
    const numbersDrawn = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0'),
    );

    const winningMilhar = numbersDrawn[0];
    const winningDezena = winningMilhar.slice(-2);

    const dezenaInt = parseInt(winningDezena);
    const winningGroupNumeric = dezenaInt === 0 ? 25 : Math.ceil(dezenaInt / 4);
    const winningGroup = String(winningGroupNumeric);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    type Winner = {
      userId: number;
      type: BetType;
      chosenNumber: string;
      value: number;
      prizeValue: number;
      multiplier: number;
    };

    const winnersOfThisRun: Winner[] = [];

    try {
      const drawRecord = queryRunner.manager.create(Draw, {
        winningNumber: winningMilhar,
        allNumbers: numbersDrawn.join(','),
      });
      const savedDraw = await queryRunner.manager.save(drawRecord);

      const pendingBets = await queryRunner.manager.find(Bet, {
        where: { status: BetStatus.PENDING },
        relations: ['user', 'user.wallet'],
      });

      for (const bet of pendingBets) {
        let isWinner = false;
        let multiplier = 0;
        const chosen = String(bet.chosenNumber);

        if (bet.type === BetType.MILHAR && chosen === winningMilhar) {
          isWinner = true;
          multiplier = 4000;
        } else if (bet.type === BetType.DEZENA && chosen === winningDezena) {
          isWinner = true;
          multiplier = 60;
        } else if (
          bet.type === BetType.GRUPO &&
          parseInt(chosen) === parseInt(winningGroup)
        ) {
          isWinner = true;
          multiplier = 18;
        }

        if (isWinner) {
          bet.status = BetStatus.WON;
          const prize = Number(bet.value) * multiplier;

          winnersOfThisRun.push({
            userId: bet.user.id,
            type: bet.type,
            chosenNumber: bet.chosenNumber,
            value: Number(bet.value),
            prizeValue: prize,
            multiplier: multiplier,
          });

          if (bet.user?.wallet) {
            bet.user.wallet.balance = Number(bet.user.wallet.balance) + prize;
            await queryRunner.manager.save(bet.user.wallet);
          }
        } else {
          bet.status = BetStatus.LOST;
        }
        await queryRunner.manager.save(bet);
      }

      await queryRunner.commitTransaction();

      return {
        draw: savedDraw,
        winners: winnersOfThisRun,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
