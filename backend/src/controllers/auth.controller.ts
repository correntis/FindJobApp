import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { LoginUserDto } from "src/dto/user/login-user.dto";
import { RegisterUserDto } from "src/dto/user/register-user.dto";
import { User } from "src/schemas/user.schema";
import { AuthService } from "src/services/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  @ApiOperation({ summary: "Registration" })
  @ApiBody({ type: RegisterUserDto })
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() registerUserDto: RegisterUserDto
  ): Promise<{ user: User; accessToken: string; refreshToken: string; telegramLink: string }> {
    return await this.authService.register(registerUserDto);
  }

  @Post("telegram/:userId/:message")
  @ApiOperation({ summary: "Connect telegram link" })
  @ApiParam({ name: "userId", example: "67cc65984fbf60c02a6c91cb", description: "User id" })
  @ApiParam({ name: "message", example: "67cc65984fbf60c02a6c91cb", description: "message" })
  @HttpCode(HttpStatus.OK)
  async connectTelegram(@Param('userId') userId: string, @Param('message') message: string) {
    return await this.authService.connectTelegram(userId, message);
  }

  @Post("login")
  @ApiOperation({ summary: "Login" })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "user with email not found",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "invalid password",
  })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    return await this.authService.login(loginUserDto);
  }

  @Get("refresh/:refreshToken")
  @ApiOperation({ summary: "Refresh access token" })
  @ApiParam({
    name: "refreshToken",
    example:
      "0d3baa939b78cc35469a4a91aca705f74d7bc3ae7a5afad63c0588d5bd6751f243754cd95ca334b3b83e03a1a783c0f3ddf9fe3d7ff08c6a74499b4db8cd52bd",
  })
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Param("refreshToken") refreshToken: string
  ): Promise<{ accessToken: string }> {
    return await this.authService.refreshToken(refreshToken);
  }
}
