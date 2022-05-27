import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { RedisService } from "nestjs-redis";
import { FilterQuery, Model, Types } from "mongoose";

import {
  AddressDocument,
  AddressIM,
  ProductDocument,
  ProductIM,
  ProductStatus,
  ServiceCategoryDocument,
  ServiceDocument,
  ServiceIM,
  ServiceStatus,
} from "@/core/schemas";
import { withinRadius } from "@/modules/addresses/utils";

import { GetServicesDto } from "../entities/get-services.entity";
import { FinishRegistrationDto } from "../entities/finish-registration.entity";
import { ServiceNotFoundException } from "@/core/exceptions/service-not-found.exception";
import { GetDashboardEntity } from "../entities/get-dashboard.entity";
import { TokenPayload } from "@/@types";

@Injectable()
export class ServicesService {
  @InjectModel(ServiceIM.name)
  private readonly serviceModel: Model<ServiceDocument>;

  @InjectModel(AddressIM.name)
  private readonly addressModel: Model<AddressDocument>;

  @InjectModel(ProductIM.name)
  private readonly productModel: Model<ProductDocument>;

  @Inject(RedisService)
  private readonly redis: RedisService;

  public async findService(
    filters: FilterQuery<ServiceDocument>,
    populate = false,
  ): Promise<ServiceDocument | null> {
    const query = this.serviceModel.findOne({
      ...filters,
      status: ServiceStatus.ENABLED,
    });

    if (populate) return query.populate("address").exec();

    return query.exec();
  }

  public async findServiceByPhone(
    phone: string,
    populate = false,
  ): Promise<ServiceDocument | null> {
    return this.findService({ phone }, populate);
  }

  public async findServiceById(_id: string | Types.ObjectId, populate = false) {
    return this.findService({ _id }, populate);
  }

  public findCategoryById(
    service: ServiceDocument,
    id: string,
  ): ServiceCategoryDocument | undefined {
    return (service.categories as ServiceCategoryDocument[]).find(
      (c: ServiceCategoryDocument) => c._id == id,
    );
  }

  public async createService(payload: FinishRegistrationDto) {
    const client = this.redis.getClient();
    const address = await this.addressModel.create(payload.address);

    const token = await client.get(payload.registrationToken);

    if (!token || token !== payload.phone)
      throw new ForbiddenException("Invalid registration token");

    await client.del(payload.registrationToken);
    delete payload["deviceToken"];

    const service = await this.serviceModel.create({
      ...payload,
      address,
    });

    return service;
  }

  // TODO: refactor to db side
  public async getServices({
    latitude,
    longitude,
    type,
  }: GetServicesDto): Promise<(ServiceDocument | { distance: number | null })[]> {
    const services = await this.serviceModel
      .find({ status: ServiceStatus.ENABLED })
      .populate("address")
      .exec();

    return services
      .map((service) => {
        if (!latitude || !longitude)
          return { service, radiusResult: { result: true, distance: null } };
        const radius = service.delivery.radius || Number.MAX_SAFE_INTEGER;
        const { latitude: originLat, longitude: originLong } = service.address.location;

        const radiusResult = withinRadius(
          originLat,
          originLong,
          latitude,
          longitude,
          radius,
        );

        return { service, radiusResult };
      })
      .filter(({ service, radiusResult }) => {
        const typeCondition = !!type ? service.type === type : true;

        if (!latitude || !longitude) return typeCondition;
        if (!service.delivery.radius) return typeCondition;

        return radiusResult.result && typeCondition;
      })
      .map(({ service, radiusResult }) => ({
        ...service.toObject(),
        distance: radiusResult.distance,
      }));
  }

  public async getPageData(serviceId: string, n: number, { role }: TokenPayload) {
    const service = await this.findServiceById(serviceId);
    if (!service) throw new ServiceNotFoundException();

    const ids = service.categories.map(
      (c: ServiceCategoryDocument) => c._id,
    ) as Types.ObjectId[];

    const result = await Promise.all([
      ...ids.map((id) =>
        this.productModel
          .find({
            categories: id,
            service: service._id,
            status: role === "user" ? ProductStatus.PUBLIC : undefined,
          })
          .limit(n)
          .exec(),
      ),
      this.productModel
        .find({
          categories: {
            $not: {
              $all: ids,
            },
          },
          service: service._id,
          status: role === "user" ? ProductStatus.PUBLIC : undefined,
        })
        .limit(n)
        .exec(),
    ]);

    return [
      ...service.categories.map((c: ServiceCategoryDocument, i) => ({
        ...c.toObject(),
        products: result[i],
      })),
      {
        name: "rest",
        index: result.length - 1,
        products: result[result.length - 1],
      },
    ];
  }

  public async getDashboardData(phone: string): Promise<GetDashboardEntity> {
    const service = await this.findServiceByPhone(phone);

    if (!service) throw new ServiceNotFoundException();

    const result = await this.productModel.aggregate([
      { $match: { service: service._id } },
      { $count: "count" },
    ]);

    return {
      totalCategories: service.categories.length,
      totalProducts: result.length ? result[0].count : 0,
    };
  }
}
