import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
  };
}

@ApiTags('Apostas')
@ApiBearerAuth()
@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Realiza aposta' })
  create(@Req() req: RequestWithUser, @Body() createBetDto: CreateBetDto) {
    return this.betsService.create(req.user.userId, createBetDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-bets')
  @ApiOperation({ summary: 'Lista todas as apostas do usuário logado' })
  findAll(@Req() req: RequestWithUser) {
    return this.betsService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de uma aposta específica' })
  findOne(@Param('id') id: string) {
    return this.betsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBetDto: UpdateBetDto) {
    return this.betsService.update(+id, updateBetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.betsService.remove(+id);
  }
}
