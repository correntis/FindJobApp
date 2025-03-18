import { TelegrafModule } from "nestjs-telegraf";
import { forwardRef, Module } from "@nestjs/common";
import { TelegramService } from "src/services/telegram.service";
import { UsersModule } from "./users.module";
import { UsersRepository } from "src/repositories/users.repository";
import { Constants } from "src/config/constants";

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: Constants.telegramToken,
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
