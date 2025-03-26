import { config } from "dotenv";

config();

export const constants = {
  apiBaseUrl: process.env.API_BASE_URL!,
  telegramToken: process.env.TELEGRAM_API_KEY!,
  mongoUri: process.env.MONGO_URI!,
  accessTokenLifeTime: "60m",
  refreshTokenLifeTime: 60 * 60 * 24 * 7,
};
