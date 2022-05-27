import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { TokenPayload } from "@/@types";
import { DeviceTokenDocument, DeviceTokenIM, DeviceTokenUserType } from "@/core/schemas";
import { UsersService } from "@/modules/users/services/users.service";
import { ServicesService } from "@/modules/services/services/services.service";

import { RegisterDeviceTokenDto } from "../entities/register-device-token.entity";

@Injectable()
export class UtilsService {
  @InjectModel(DeviceTokenIM.name)
  private readonly deviceTokenModel: Model<DeviceTokenDocument>;

  @Inject(UsersService)
  private readonly usersService: UsersService;

  @Inject(ServicesService)
  private readonly servicesService: ServicesService;

  public async registerDeviceToken(
    { role, phone }: TokenPayload,
    payload: RegisterDeviceTokenDto,
  ) {
    const document = await (role === "user"
      ? this.usersService.findUserByPhone(phone)
      : this.servicesService.findServiceByPhone(phone));
    if (!document)
      throw new NotFoundException(`User/Service by phone ${phone} is not found`);

    return this.deviceTokenModel.create({
      token: payload.token,
      targetId: document._id,
      targetType: role,
    });
  }

  public async deleteDeviceToken({ role, phone }: TokenPayload, targetId: string) {
    const document = await (role === "user"
      ? this.usersService.findUserByPhone(phone)
      : this.servicesService.findServiceByPhone(phone));
    if (!document)
      throw new NotFoundException(`User/Service by phone ${phone} is not found`);

    if (document._id !== targetId)
      throw new ForbiddenException(`Cannot access Device Token by id ${targetId}`);

    const deviceToken = await this.deviceTokenModel.findOne({
      targetId,
      targetType: role as DeviceTokenUserType,
    });
    if (!deviceToken)
      throw new NotFoundException(`Device Token by id ${targetId} is not found`);

    return deviceToken.remove();
  }
}
