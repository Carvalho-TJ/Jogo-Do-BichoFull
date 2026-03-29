import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Tiago Carvalho' })
  name: string;

  @ApiProperty({ example: 'tiago@email.com' })
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Mínimo 6 caracteres' })
  password: string;
}
