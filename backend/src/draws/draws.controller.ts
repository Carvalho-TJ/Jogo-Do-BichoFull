import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DrawsService } from './draws.service';
import { BetsService } from '../bets/bets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DrawResponseDto } from './dto/draw-response.dto';

@ApiTags('Sorteios')
@ApiBearerAuth()
@Controller('draws')
export class DrawsController {
  constructor(
    private readonly drawsService: DrawsService,
    private readonly betsService: BetsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('trigger')
  @ApiOperation({ summary: 'Executa um novo sorteio e processa ganhadores' })
  @ApiResponse({
    status: 201,
    description: 'Sorteio realizado com sucesso.',
    type: DrawResponseDto,
  })
  async triggerDraw() {
    const result = await this.drawsService.runDraw();
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.drawsService.getHistory();
  }
}
