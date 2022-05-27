import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { AddressNotFoundException, UserNotFoundException } from "@/core/exceptions";
import { UsersService } from "@/modules/users/services/users.service";
import { AddressDocument, AddressIM } from "@/core/schemas";
import { TokenPayload } from "@/@types";

import { CreateAddressDto } from "../entities/create-address.entity";
import { UpdateAddressDto } from "../entities/update-address.entity";

@Injectable()
export class AddressesService {
  @InjectModel(AddressIM.name)
  private readonly addressModel: Model<AddressDocument>;

  @Inject(UsersService)
  private readonly usersService: UsersService;

  public async createAddress(
    { details, latitude, longitude, name, additionalInfo }: CreateAddressDto,
    token: TokenPayload
  ) {
    const user = await this.usersService.findUserByPhone(token.phone, true);

    if (!user) throw new UserNotFoundException();

    const address = await this.addressModel.create({
      name,
      details,
      additionalInfo,
      location: {
        latitude,
        longitude,
      },
    });

    user.addresses.push(address);
    await user.save();

    return address;
  }

  public async getAddresses({ phone }: TokenPayload) {
    const user = await this.usersService.findUserByPhone(phone, true);
    if (!user) throw new UserNotFoundException();

    return user.addresses;
  }

  public async updateAddress(
    id: string,
    { details, latitude, longitude, name, additionalInfo }: UpdateAddressDto,
    { phone }: TokenPayload
  ) {
    const user = await this.usersService.findUserByPhone(phone, true);
    if (!user) throw new UserNotFoundException();

    const address = user.addresses.find((a) => a._id == id);
    if (!address) throw new AddressNotFoundException();

    address.name = name ?? address.name;
    address.details = details ?? address.details;
    address.additionalInfo = additionalInfo ?? address.additionalInfo;
    address.location.latitude = latitude ?? address.location.latitude;
    address.location.longitude = longitude ?? address.location.longitude;

    return address.save();
  }

  public async deleteAddress(id: string, { phone }: TokenPayload) {
    const user = await this.usersService.findUserByPhone(phone, true);
    if (!user) throw new UserNotFoundException();

    const address = user.addresses.find((a) => a._id == id);
    if (!address) throw new AddressNotFoundException();

    user.addresses = user.addresses.filter((a) => a._id != address._id);
    await user.save();

    await address.remove();
  }
}
