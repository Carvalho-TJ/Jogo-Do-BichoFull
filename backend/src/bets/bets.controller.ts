import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Request
 } from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createBetDto: CreateBetDto) {
    return this.betsService.create(req.user.userId, createBetDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-bets')
  findAll(@Request() req) {
    return this.betsService.findAllByUser(req.user.userId);
  }

  @Get(':id')
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
