import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RedisService } from "src/services/redis.service";
import { UsersRepository } from "src/repositories/users.repository";
import { User, UserDocument } from "src/schemas/user.schema";
import { NotFoundException } from "src/exceptions/not-found.exception";
import { InvalidPasswordException } from "src/exceptions/invalid-password.exception";
import * as bcrypt from "bcrypt";
import { LoginUserDto } from "src/dto/user/login-user.dto";
import { AlreadyExistException } from "src/exceptions/already-exist.exception";
import { RegisterUserDto } from "src/dto/user/register-user.dto";
import { randomBytes } from "crypto";
import { JwtStrategy } from "src/jwt/jwt.strategy";
import { TelegramService } from "./telegram.service";
import { constants } from "src/config/constants";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly usersRepository: UsersRepository,
    private readonly telegramService: TelegramService
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<{
    user: UserDocument;
    accessToken: string;
    refreshToken: string;
    telegramLink: string;
  }> {
    const user = await this.usersRepository.findByEmail(registerUserDto.email);

    if (user) {
      throw new AlreadyExistException(User);
    }

    const registeredUser = await this.usersRepository.create({
      ...registerUserDto,
      passwordHash: await this.hashPassword(registerUserDto.password),
    });

    const accessToken = this.generateAccessToken(
      registeredUser.id,
      registeredUser.role
    );
    const refreshToken = this.generateRefreshToken();

    await this.setCacheToken(refreshToken, {
      id: registeredUser.id.toString(),
      role: registeredUser.role,
    });

    const telegramLink = this.telegramService.getTelegramLinkForUser(registeredUser.id);

    const registeredUserWithLink = await this.usersRepository.update(registeredUser.id, {telegramLink});

    return { user: registeredUserWithLink || registeredUser, accessToken, refreshToken, telegramLink };
  }

  async login(loginUserDto: LoginUserDto): Promise<{
    user: UserDocument;
    accessToken: string;
    refreshToken: string;
    telegramLink: string;
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

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken();

    await this.setCacheToken(refreshToken, {
      id: user.id.toString(),
      role: user.role,
    });
    
    let telegramLink = user.telegramLink;
    
    // Если telegramLink отсутствует, создаем и сохраняем его
    if (!telegramLink) {
      telegramLink = this.telegramService.getTelegramLinkForUser(user.id);
      await this.usersRepository.update(user.id, { telegramLink });
    }

    return { user, accessToken, refreshToken, telegramLink };
  }

  async connectTelegram(userId: string, message: string){
    this.telegramService.sendNotificationToUser(userId, message);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const storedUser = await this.getCacheToken(refreshToken);

    if (!storedUser) {
      throw new NotFoundException(JwtStrategy);
    }

    const newAccessToken = this.generateAccessToken(
      storedUser.id,
      storedUser.role
    );

    return { accessToken: newAccessToken };
  }

  async getCacheToken(
    refreshToken: string
  ): Promise<{ id: string; role: string } | null> {
    var user = await this.redisService.get(refreshToken);
    if (!user) {
      return null;
    }
    return JSON.parse(user);
  }

  async setCacheToken(
    refreshToken: string,
    user: { id: string; role: string }
  ) {
    await this.redisService.set(
      refreshToken,
      JSON.stringify(user),
      constants.refreshTokenLifeTime,
    );
  }

  generateAccessToken(userId: string, role: string): string {
    const payload = { userId, role };

    return this.jwtService.sign(payload, {
      expiresIn: constants.accessTokenLifeTime,
    });
  }

  generateRefreshToken(): string {
    return randomBytes(64).toString("hex");
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
