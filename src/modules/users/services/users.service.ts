import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Types } from "mongoose";

import { UserDocument, UserIM, UserStatus } from "@/core/schemas";

@Injectable()
export class UsersService {
  @InjectModel(UserIM.name)
  private readonly userModel: Model<UserDocument>;

  public async findUserByPhone(
    phone: string,
    populate = false
  ): Promise<UserDocument | null> {
    return this.findUser({ phone }, populate);
  }

  public async findUserById(
    _id: string | Types.ObjectId,
    populate = false
  ): Promise<UserDocument | null> {
    return this.findUser({ _id }, populate);
  }

  public async findUser(filters: FilterQuery<UserDocument>, populate = false) {
    const query = this.userModel.findOne({
      ...filters,
      status: UserStatus.ENABLED,
    });

    if (populate) return query.populate("addresses").exec();

    return query.exec();
  }
}
