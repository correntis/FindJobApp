// users.module.ts
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt"; // добавляем JwtModule
import { UsersController } from "src/controllers/users.controller";
import { AuthController } from "src/controllers/auth.controller";
import { UsersService } from "src/services/users.service";
import { UsersRepository } from "src/repositories/users.repository";
import { AuthService } from "src/services/auth.service";
import { RedisService } from "src/services/redis.service";
import { User, UserSchema } from "src/schemas/user.schema";
import { JwtStrategy } from "src/jwt/jwt.strategy";
import { AuthModule } from "./auth.module";
import { TelegramService } from "src/services/telegram.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
