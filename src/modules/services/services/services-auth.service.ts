import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { RedisService } from "nestjs-redis";
import { Model } from "mongoose";

import { DeviceTokenDocument, DeviceTokenIM, DeviceTokenUserType } from "@/core/schemas";
import { ServiceNotFoundException } from "@/core/exceptions/service-not-found.exception";
import { signToken } from "@/core/utils/token";
import { IConfig, IConfigAuth } from "@/config";

import {
  ConfirmCodeDto,
  ConfirmCodeTokenEntity,
} from "@/modules/users/entities/confirm-code.entity";
import { SmsService } from "@/modules/sms/services/sms.service";

import { RegisterServiceDto } from "../entities/register-service.entity";
import { ServicesService } from "./services.service";

@Injectable()
export class ServicesAuthService {
  @InjectModel(DeviceTokenIM.name)
  private readonly deviceTokenModel: Model<DeviceTokenDocument>;

  @Inject(ConfigService)
  private readonly configService: ConfigService<IConfig>;

  @Inject(SmsService)
  private readonly smsService: SmsService;

  @Inject(ServicesService)
  private readonly servicesService: ServicesService;

  @Inject(RedisService)
  private readonly redis: RedisService;

  public async generateRegistrationToken(phone: string) {
    const authConfig = this.configService.get<IConfigAuth>("auth")!;
    const client = this.redis.getClient();

    const token = signToken({ role: "unknown", phone }, authConfig.registrationTokenKey);

    await client.set(token, phone);

    return token;
  }

  public async register({ phone }: RegisterServiceDto) {
    const service = await this.servicesService.findServiceByPhone(phone);

    await this.smsService.sendCode(phone);

    if (!service) throw new ServiceNotFoundException({ result: true, exists: false });
  }

  public async setServiceDeviceToken(serviceId: string, deviceToken: string) {
    return this.deviceTokenModel.updateOne(
      {
        targetId: serviceId,
        targetType: DeviceTokenUserType.USER,
      },
      { token: deviceToken },
      { upsert: true },
    );
  }

  public async confirmCode({
    code,
    phone,
    deviceToken,
  }: ConfirmCodeDto): Promise<ConfirmCodeTokenEntity> {
    const authConfig = this.configService.get<IConfigAuth>("auth")!;

    const result = await this.smsService.getCode(phone);
    const service = await this.servicesService.findServiceByPhone(phone);

    if (result == null || result != code)
      throw new ServiceNotFoundException(
        "Service doesn't exists or code is invalid (expired, don't exist)",
      );

    const token = signToken(
      {
        _id: service?._id,
        role: "service",
        phone,
      },
      authConfig.tokenSecretKey,
    );

    await this.smsService.dropCode(phone);

    if (!service) {
      return {
        token,
        registrationToken: await this.generateRegistrationToken(phone),
      };
    }

    if (deviceToken) {
      await this.setServiceDeviceToken(service._id, deviceToken);
    }

    return {
      token,
    };
  }
}
