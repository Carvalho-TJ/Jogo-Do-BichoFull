import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUA_CHAVE_SECRETA_MUITO_FORTE',
    });
  }

  // O que retornar aqui será injetado no objeto 'req.user'
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, name: payload.name };
  }
}
