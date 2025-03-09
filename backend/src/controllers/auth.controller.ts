import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { LoginUserDto } from "src/Dto/User/login-user.dto";
import { RegisterUserDto } from "src/Dto/User/register-user.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { User } from "src/schemas/user.schema";
import { AuthService } from "src/services/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() registerUserDto: RegisterUserDto
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    return await this.authService.register(registerUserDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    return await this.authService.login(loginUserDto);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() refreshDto: { refreshToken: string }
  ): Promise<{ accessToken: string }> {
    return await this.authService.refreshToken(refreshDto.refreshToken);
  }
}
