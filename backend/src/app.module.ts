import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WalletsModule } from './wallets/wallets.module';
import { BetsModule } from './bets/bets.module';
import { DrawsModule } from './draws/draws.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'db',
      port: 3306,
      username: 'root',
      password: '4016',
      database: 'bichofull_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    WalletsModule,
    BetsModule,
    DrawsModule,
  ],
})
export class AppModule {}
