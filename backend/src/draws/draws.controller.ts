import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { DrawsService } from './draws.service';
import { BetsService } from '../bets/bets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('draws')
export class DrawsController {
  constructor(
    private readonly drawsService: DrawsService,
    private readonly betsService: BetsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('trigger')
  async triggerDraw(@Request() req) {
    const result = await this.drawsService.runDraw();
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.drawsService.getHistory();
  }
}