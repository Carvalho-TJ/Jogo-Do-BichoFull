import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,
  ) {}

  async create(user: User, initialBalance: number): Promise<Wallet> {
    const wallet = this.walletsRepository.create({
      user,
      balance: initialBalance,
    });
    return await this.walletsRepository.save(wallet);
  }

  async findWalletByUser(userId: number): Promise<Wallet | null> {
    return this.walletsRepository.findOne({
      where: { user: { id: userId } },
    });
  }
}
