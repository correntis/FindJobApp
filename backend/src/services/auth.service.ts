import { TsIgnoreOptions } from "./../../node_modules/@redis/time-series/dist/commands/ADD.d";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RedisService } from "src/services/redis.service";
import { UsersRepository } from "src/repositories/users.repository";
import { User, UserDocument } from "src/schemas/user.schema";
import { NotFoundException } from "src/exceptions/not-found.exception";
import { InvalidPasswordException } from "src/exceptions/invalid-password.exception";
import * as bcrypt from "bcrypt";
import { LoginUserDto } from "src/Dto/User/login-user.dto";
import { AlreadyExistException } from "src/exceptions/already-exist.exception";
import { RegisterUserDto } from "src/Dto/User/register-user.dto";
import { randomBytes } from 'crypto';
import { JwtStrategy } from "src/jwt/jwt.strategy";


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly usersRepository: UsersRepository
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserDocument> {
    const user = await this.usersRepository.findByEmail(registerUserDto.email);

    if (user) {
      throw new AlreadyExistException(User);
    }

    return this.usersRepository.create({
      ...registerUserDto,
      passwordHash: await this.hashPassword(registerUserDto.password),
    });
  }

  async login(loginUserDto: LoginUserDto): Promise<{
    user: UserDocument;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.usersRepository.findByEmail(loginUserDto.email);
    if (!user) {
      throw new NotFoundException(User);
    }

    const isValidPassword = await this.validatePassword(
      loginUserDto.password,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new InvalidPasswordException();
    }

    const accessToken = this.jwtService.sign({ userId: user.id.toString() });
    const refreshToken = this.generateRefreshToken();

    await this.redisService.set(
      refreshToken,
      user.id.toString(),
      60 * 60 * 24 * 7
    );

    return { user, accessToken, refreshToken };
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; }> {
    const storedId = await this.redisService.get(refreshToken);

    if (!storedId) {
      throw new NotFoundException(JwtStrategy);
    }

    const newAccessToken = this.jwtService.sign({ userId: storedId });

    return { accessToken: newAccessToken };
  }

  generateRefreshToken(): string{
    return randomBytes(64).toString('hex');
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
