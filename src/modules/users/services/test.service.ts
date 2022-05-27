import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { User, UserDocument, UserIM } from "@/core/schemas";

@Injectable()
export class UsersTestService {
  @InjectModel(UserIM.name)
  private readonly userModel: Model<UserDocument>;

  public async getAllUsers(): Promise<User[]> {
    return this.userModel.find().select({
      addresses: 0,
    });
  }
}
