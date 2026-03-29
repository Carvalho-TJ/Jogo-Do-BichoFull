import { Module } from '@nestjs/common';
import { DrawsService } from './draws.service';
import { DrawsController } from './draws.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Draw } from './entities/draw.entity';
import { BetsModule } from '../bets/bets.module';

@Module({
  imports: [TypeOrmModule.forFeature([Draw]), BetsModule],
  controllers: [DrawsController],
  providers: [DrawsService],
})
export class DrawsModule {}
