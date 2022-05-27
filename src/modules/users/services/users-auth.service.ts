import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
  DeviceTokenDocument,
  DeviceTokenIM,
  DeviceTokenUserType,
  UserDocument,
  UserIM,
} from "@/core/schemas";
import { SmsService } from "@/modules/sms/services/sms.service";
import { IConfig, IConfigAuth } from "@/config";

import { RegisterUserDto } from "../entities/register-user.entity";
import { ConfirmCodeDto, ConfirmCodeEntity } from "../entities/confirm-code.entity";
import { UserNotFoundException } from "@/core/exceptions";
import { UsersService } from "./users.service";
import { signToken } from "@/core/utils/token";

@Injectable()
export class UsersAuthService {
  @InjectModel(UserIM.name)
  private readonly userModel: Model<UserDocument>;

  @InjectModel(DeviceTokenIM.name)
  private readonly deviceTokenModel: Model<DeviceTokenDocument>;

  @Inject(SmsService)
  private readonly smsService: SmsService;

  @Inject(UsersService)
  private readonly usersService: UsersService;

  @Inject(ConfigService)
  private readonly configService: ConfigService<IConfig>;

  public async register({ phone }: RegisterUserDto) {
    let user = await this.usersService.findUserByPhone(phone);

    if (user == null) {
      user = await this.userModel.create({ phone });
    }

    await this.smsService.sendCode(phone);

    return user._id;
  }

  public async confirmCode({
    code,
    phone,
    deviceToken,
  }: ConfirmCodeDto): Promise<ConfirmCodeEntity> {
    const error = new UserNotFoundException(
      "User doesn't exists or code is invalid (expired, don't exist)",
    );
    const authConfig = this.configService.get<IConfigAuth>("auth")!;

    const user = await this.usersService.findUserByPhone(phone);
    if (user == null) throw error;

    const result = await this.smsService.getCode(phone);

    if (result == null || result != code) throw error;

    const token = signToken(
      {
        _id: user._id,
        role: "user",
        phone: user.phone,
      },
      authConfig.tokenSecretKey,
    );

    await this.smsService.dropCode(phone);

    if (deviceToken) {
      await this.deviceTokenModel.updateOne(
        {
          targetId: user._id,
          targetType: DeviceTokenUserType.USER,
        },
        { token: deviceToken },
        { upsert: true },
      );
    }

    return {
      _id: user._id,
      token,
    };
  }
}
