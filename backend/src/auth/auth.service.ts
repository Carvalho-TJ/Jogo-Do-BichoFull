import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    // 1. Busca o usuário pelo email
    const user = await this.usersService.findByEmail(email);

    // 2. Se o usuário existe, compara as senhas
    if (user && (await bcrypt.compare(pass, user.password))) {
      // 3. Se estiver OK, gera o payload do token (o que vai dentro do JWT)
      const payload = { sub: user.id, email: user.email, name: user.name };

      return {
        access_token: this.jwtService.sign(payload),
        user: { id: user.id, name: user.name, email: user.email },
      };
    }

    // 4. Se der erro, lança uma exceção de não autorizado
    throw new UnauthorizedException('E-mail ou senha inválidos');
  }
}
