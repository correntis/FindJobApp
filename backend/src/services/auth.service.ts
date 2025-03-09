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
import { randomBytes } from "crypto";
import { JwtStrategy } from "src/jwt/jwt.strategy";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly usersRepository: UsersRepository
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<{
    user: UserDocument;
    accessToken: string;
    refreshToken: string;
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

    return { user: registeredUser, accessToken, refreshToken };
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

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken();

    await this.setCacheToken(refreshToken, {
      id: user.id.toString(),
      role: user.role,
    });

    return { user, accessToken, refreshToken };
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
      60 * 60 * 24 * 7
    );
  }

  generateAccessToken(userId: string, role: string): string {
    const payload = { userId, role };

    return this.jwtService.sign(payload, {
      expiresIn: "180m",
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
