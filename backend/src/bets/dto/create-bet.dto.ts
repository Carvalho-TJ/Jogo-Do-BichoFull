import { IsNumber, IsPositive, Max, Min, IsString } from 'class-validator';

export class CreateBetDto {
  @IsNumber()
  @IsPositive({ message: 'O valor da aposta deve ser maior que zero' })
  value: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  chosenNumber: number;

  @IsString()
  animalName: string;
}
