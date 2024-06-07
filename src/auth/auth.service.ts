import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(createAuthDto.password, saltRounds);
    createAuthDto.password = hashedPassword;

    try {
      await this.prisma.user.create({
        data: {
          username: createAuthDto.username,
          password: createAuthDto.password,
          email: createAuthDto.email,
          nama: createAuthDto.nama,
          status: 0,
        },
      });

      return {
        status: HttpStatus.CREATED,
        message: 'User created',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'User creation failed, username already exists',
          error: error,
        };
      } else {
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'User creation failed',
          error: error.message,
        };
      }
    }
  }

  signIn(username: string, password: string) {
    return this.prisma.user
      .findUnique({
        where: {
          username: username,
        },
      })
      .then(async (user) => {
        if (!user) {
          return {
            status: HttpStatus.NOT_FOUND,
            message: 'User not found',
          };
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return {
            status: HttpStatus.UNAUTHORIZED,
            message: 'Invalid password',
          };
        } else {
          return {
            status: HttpStatus.OK,
            token: await this.jwtService.signAsync({
              user_id: user.user_id,
              username: user.username,
            }),
            data: {
              user_id: user.user_id,
              username: user.username,
              email: user.email,
              nama: user.nama,
            },
            message: 'Login successful',
          };
        }
      });
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: SignInDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
