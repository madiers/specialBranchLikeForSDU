import { IConfig, IConfigSms } from "@/config";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "nestjs-redis";

@Injectable()
export class SmsService {
  @Inject(RedisService)
  private readonly redis: RedisService;

  @Inject(ConfigService)
  private readonly configService: ConfigService<IConfig>;

  public async sendCode(phone: string) {
    // TODO: send a real phone code
    const config = this.configService.get<IConfigSms>("sms")!;
    const client = this.redis.getClient();

    const code = (Math.random() * 8999 + 1000).toFixed(0);

    await client.set(phone, code, "EX", config.expireTime);
  }

  public async getCode(phone: string, plus = false) {
    const client = this.redis.getClient();

    return client.get(plus ? "+" + phone : phone);
  }

  public async dropCode(phone: string) {
    const client = this.redis.getClient();

    await client.del(phone);
  }
}
