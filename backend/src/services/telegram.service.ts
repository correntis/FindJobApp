import { UserDocument } from "src/schemas/user.schema";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Ctx, InjectBot, On, Start, Update } from "nestjs-telegraf";
import { UsersRepository } from "src/repositories/users.repository";
import { Context, Markup, Telegraf } from "telegraf";
import { Console } from "console";
import { MessagesTemplates } from "src/telegram/message-templates";

@Update()
@Injectable()
export class TelegramService {
  profileMessage: string = "📝 My Profile";

  constructor(
    private readonly usersRepository: UsersRepository,
    @InjectBot() private readonly bot: Telegraf<Context>
  ) {}

  getTelegramLinkForUser(userId: string) {
    return `https://t.me/findjobapp_bot?start=registration_${userId}`;
  }

  async sendNotificationToUser(userId: string, message: string) {
    const user = await this.usersRepository.findById(userId);

    if (user?.telegram) {
      try {
        // Отправка уведомления пользователю по его Telegram ID
        await this.bot.telegram.sendMessage(user.telegram, message);
      } catch (error) {
        console.error("Ошибка при отправке уведомления:", error);
      }
    } else {
      console.log(
        `Пользователь с ID ${userId} не найден или не привязан к Telegram`
      );
    }
  }

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const chatId = ctx.message?.chat.id;
    const text = ctx.text;

    if (chatId && text?.startsWith("/start")) {
      const isChatExist = await this.usersRepository.getByChatId(
        chatId.toString()
      );

      if (isChatExist && isChatExist.length > 0) {
        await ctx.reply(
          "Этот чат уже используется для другого аккаунта в приложении. Вы можете продолжить работу со старым аккаунтом",
          Markup.keyboard([[this.profileMessage]]).resize()
        );

        return;
      }

      const parts = text.split(" ");
      if (parts.length === 2) {
        const registrationId = parts[1].split("_");
        if (registrationId.length === 2) {
          const userId = registrationId[1];
          await this.usersRepository.update(userId, {
            telegram: chatId.toString(),
          });

          await ctx.reply(
            "Привет! Добро пожаловать в наш сервис!\nЯ буду присылать тебе уведомления о новых событиях!😊",
            Markup.keyboard([[this.profileMessage]]).resize()
          );

          return;
        }
      }
    }

    await ctx.reply(
      "Команда /start работает только при переходе по вашей личной ссылке"
    );
  }

  @On("message")
  async onMessage(@Ctx() ctx: Context) {
    if (ctx.message && "sticker" in ctx.message) {
      const stickerId = ctx.message.sticker.file_id;
      await ctx.replyWithSticker(stickerId);
      return;
    }

    if (ctx.message && "text" in ctx.message) {
      const text = ctx.message.text;

      if (text === "📝 My Profile") {
        if (ctx.chat?.id) {
          var user = await this.getProfile(ctx.chat.id.toString());
          await ctx.reply(MessagesTemplates.profile(user), {
            parse_mode: "Markdown",
          });
        }
        return;
      }

      console.log(ctx.message.text);

      await ctx.reply(
        "Я создан лишь для отправки уведомлений!\nЯ не умею распозновать команды 😓"
      );
    }
  }

  private async getProfile(chatId: string) {
    return (await this.usersRepository.getByChatId(chatId))[0];
  }
}
