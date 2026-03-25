import { IsNumber, IsPositive, Min, IsString, IsEnum, MaxLength, min } from 'class-validator';
import { BetType } from '../entities/bet.entity';

export class CreateBetDto {
  @IsNumber()
  @IsPositive({ message: 'O valor da aposta deve ser maior que zero' })
  @Min(0.01)
  value: number;

  @IsString()
  @MaxLength(4)
  chosenNumber: string;

  @IsEnum(BetType)
  type: BetType;
}
