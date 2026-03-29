import {
  IsNumber,
  IsPositive,
  Min,
  IsString,
  IsEnum,
  MaxLength,
  min,
} from 'class-validator';
import { BetType } from '../entities/bet.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBetDto {
  @ApiProperty({ example: 10.5, description: 'Valor da aposta em Reais' })
  @IsNumber()
  @IsPositive({ message: 'O valor da aposta deve ser maior que zero' })
  @Min(0.01)
  value: number;

  @ApiProperty({
    example: '05',
    description: 'Número escolhido (ex: 05 para Grupo, 5217 para Milhar)',
  })
  @IsString()
  @MaxLength(4)
  chosenNumber: string;

  @ApiProperty({
    example: 'GRUPO',
    enum: ['MILHAR', 'DEZENA', 'GRUPO'],
    description: 'Tipo da modalidade de aposta',
  })
  @IsEnum(BetType)
  type: BetType;
}
