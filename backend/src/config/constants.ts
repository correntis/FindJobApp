import { config } from "dotenv";

config();

export const Constants = {
  apiBaseUrl: process.env.API_BASE_URL!,
  telegramToken: process.env.TELEGRAM_API_KEY!,
  mongoUri: process.env.MONGO_URI!,
};
