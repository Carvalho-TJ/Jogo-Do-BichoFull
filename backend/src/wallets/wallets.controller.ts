import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-balance')
  async getMyBalance(@Request() req) {
    const userId = req.user.userId;
    return this.walletsService.findWalletByUser(userId);
  }
}
