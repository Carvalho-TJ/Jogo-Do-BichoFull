import { ApiProperty } from '@nestjs/swagger';

// Representa um ganhador individual dentro do sorteio
class WinnerDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'GRUPO' })
  type: string;

  @ApiProperty({ example: '05' })
  chosenNumber: string;

  @ApiProperty({ example: 10.0 })
  value: number;

  @ApiProperty({ example: 180.0 })
  prizeValue: number;

  @ApiProperty({ example: 18 })
  multiplier: number;
}

// O objeto principal que o runDraw retorna
export class DrawResponseDto {
  @ApiProperty()
  draw: {
    id: number;
    winningNumber: string;
    allNumbers: string;
    createdAt: string;
  };

  @ApiProperty({ type: [WinnerDto] })
  winners: WinnerDto[];
}
