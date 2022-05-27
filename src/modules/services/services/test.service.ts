import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
  AddressDocument,
  AddressIM,
  Service,
  ServiceDocument,
  ServiceIM,
} from "@/core/schemas";

@Injectable()
export class TestServicesService {
  @InjectModel(AddressIM.name)
  private readonly addressModel: Model<AddressDocument>;

  @InjectModel(ServiceIM.name)
  private readonly serviceModel: Model<ServiceDocument>;

  public async createService(payload: Service) {
    const address = await this.addressModel.create(payload.address);

    const service = await this.serviceModel.create({
      ...payload,
      address,
    });

    return {
      _id: service._id,
    };
  }
}
