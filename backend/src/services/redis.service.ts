import { Injectable } from "@nestjs/common";
import * as RedisModule from "ioredis";

@Injectable()
export class RedisService {
  private redisClient: RedisModule.Redis;

  constructor() {
    this.redisClient = new RedisModule.Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.redisClient.setex(key, ttl, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
