import { forwardRef, Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "src/services/auth.service";
import { RedisService } from "src/services/redis.service";
import { AuthController } from "src/controllers/auth.controller";
import { JwtStrategy } from "src/jwt/jwt.strategy";
import { UsersModule } from "./users.module";
import { TelegramModule } from "./telegram.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: "test",
      signOptions: { expiresIn: "24h" },
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
    forwardRef(() => UsersModule),
    TelegramModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RedisService],
  exports: [RedisService],
})
export class AuthModule {}
