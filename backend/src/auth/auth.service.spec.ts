import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 1,
    email: 'tiago@email.com',
    password: 'hashed_password',
    name: 'Tiago',
  };

  const mockUsersService = {
    findByEmail: jest.fn().mockResolvedValue(mockUser),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('token_gerado_jwt'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('deve retornar um token de acesso ao logar com sucesso', async () => {
    // 2. Aqui usamos o mock do bcrypt diretamente
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.login('tiago@email.com', 'senha_correta');

    expect(result).toHaveProperty('access_token');
    expect(result.access_token).toBe('token_gerado_jwt');
    expect(bcrypt.compare).toHaveBeenCalled();
  });

  it('deve lançar UnauthorizedException se a senha estiver errada', async () => {
    // 3. Simulamos que a senha NÃO bate
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login('tiago@email.com', 'senha_errada'),
    ).rejects.toThrow(UnauthorizedException);
  });
});
