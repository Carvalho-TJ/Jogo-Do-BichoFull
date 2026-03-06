import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('deve validar e retornar os dados do payload do token', () => {
    const payload = { sub: 1, email: 'tiago@email.com', name: 'Tiago' };
    const result = strategy.validate(payload);

    expect(result).toEqual({
      userId: 1,
      email: 'tiago@email.com',
      name: 'Tiago',
    });
  });
});
