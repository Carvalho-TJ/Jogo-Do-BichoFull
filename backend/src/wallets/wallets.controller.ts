import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WalletsService } from './wallets.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserType } from '../common/interfaces/current-user.interface';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Carteira')
@ApiBearerAuth()
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-balance')
  @ApiOperation({ summary: 'Consulta o saldo total do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Saldo retornado.',
    schema: { example: { balance: 1000.0 } },
  })
  async getMyBalance(@CurrentUser() user: CurrentUserType) {
    return this.walletsService.findWalletByUser(user.userId);
  }
}
