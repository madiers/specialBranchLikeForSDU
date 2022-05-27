import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Types } from "mongoose";

import {
  ProductDocument,
  ProductIM,
  ProductStatus,
  ServiceDocument,
} from "@/core/schemas";
import { ServicesService } from "@/modules/services/services/services.service";
import { ServiceNotFoundException } from "@/core/exceptions/service-not-found.exception";
import { TokenPayload } from "@/@types";
import { CreateProductDto } from "../entities/create-product.entity";
import { ProductNotFoundException } from "@/core/exceptions/product-not-found.exception";

@Injectable()
export class ProductsService {
  @InjectModel(ProductIM.name)
  private readonly productModel: Model<ProductDocument>;

  @Inject(ServicesService)
  private readonly servicesService: ServicesService;

  public async findProductsByServicePhone(phone: string) {
    const service = await this.servicesService.findServiceByPhone(phone);
    if (!service) throw new ServiceNotFoundException();

    return this.productModel.find({ service });
  }

  public async findProductById(id: string) {
    return this.productModel.findById(id);
  }

  public async getProducts(
    token: TokenPayload,
    serviceId: string,
    categoryId: string,
    search: string,
    pageSize: number,
    page: number,
  ) {
    let service: ServiceDocument | null = null;
    if (token.role === "service") {
      service = await this.servicesService.findServiceByPhone(token.phone);
    } else if (serviceId) {
      service = await this.servicesService.findServiceById(serviceId);
    }

    const filter: FilterQuery<ProductDocument> = {};
    if (categoryId) {
      filter["categories"] = {
        $all: [categoryId],
      };
    }
    if (service) {
      filter["service"] = service._id;
    }
    if (search) {
      filter["name"] = {
        $regex: search,
        $options: "i",
      };
    }
    if (token.role === "user") {
      filter["status"] = ProductStatus.PUBLIC;
    }

    return this.productModel
      .find(filter)
      .skip(pageSize * page || 0)
      .limit(pageSize);
  }

  public async createProduct(payload: CreateProductDto, token: TokenPayload) {
    const service = await this.servicesService.findServiceByPhone(token.phone);
    if (!service) throw new ServiceNotFoundException();

    const product = await this.productModel.create({
      ...payload,
      service: service._id,
    });

    return {
      _id: product._id,
    };
  }

  public async updateProduct(
    id: Types.ObjectId,
    payload: CreateProductDto,
    token: TokenPayload,
  ) {
    const service = await this.servicesService.findServiceByPhone(token.phone);
    if (!service) throw new ServiceNotFoundException();

    const product = await this.productModel.findOne({
      _id: id,
      service: service._id,
    });
    if (!product) throw new ProductNotFoundException();

    await product.update(payload as any);

    return {
      result: true,
    };
  }

  public async deleteProduct(id: Types.ObjectId, token: TokenPayload) {
    const service = await this.servicesService.findServiceByPhone(token.phone);
    if (!service) throw new ServiceNotFoundException();

    const product = await this.productModel.findOne({
      _id: id,
      service: service._id,
    });
    if (!product) throw new ProductNotFoundException();

    await product.remove();

    return {
      result: true,
    };
  }
}
