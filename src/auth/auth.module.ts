import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt-strategy';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: 'jWtS3cr3tK3y',
      signOptions: { expiresIn: '3d' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
})

export class AuthModule {}
