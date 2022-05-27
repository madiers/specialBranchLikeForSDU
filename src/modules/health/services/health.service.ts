import { Inject, Injectable } from "@nestjs/common";
import { RedisService } from "nestjs-redis";
import { RedisHealth } from "../entities/redis-health.entity";

@Injectable()
export class HealthService {
  @Inject(RedisService)
  private readonly redis: RedisService;

  public getHelloWorld() {
    return "Hello World!";
  }

  public async getRedisHealth(): Promise<RedisHealth> {
    const client = this.redis.getClient();

    const key = Math.random() + "";
    const targetValue = Math.random() + "";

    const result = await client.set(key, targetValue);
    const value = await client.get(key);

    return {
      result,
      value,
      targetValue,
    };
  }
}
