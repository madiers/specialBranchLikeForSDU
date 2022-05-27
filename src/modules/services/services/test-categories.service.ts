import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { ServiceNotFoundException } from "@/core/exceptions/service-not-found.exception";
import { ProductDocument, ProductIM, ServiceCategoryDocument } from "@/core/schemas";

import { TestAddCategoryDto } from "../entities/add-category.test-entity";
import { ServicesService } from "./services.service";
import { CategoryNotFoundException } from "@/core/exceptions/category-not-found.exception";

@Injectable()
export class TestCategoriesService {
  @InjectModel(ProductIM.name)
  private readonly productModel: Model<ProductDocument>;

  @Inject(ServicesService)
  private readonly servicesService: ServicesService;

  public async addCategory(phone: string, payload: TestAddCategoryDto) {
    const service = await this.servicesService.findServiceByPhone(phone);
    if (!service) throw new ServiceNotFoundException();

    service.categories.push(payload);

    await service.save();
  }

  public async deleteCategory(phone: string, id: string) {
    const service = await this.servicesService.findServiceByPhone(phone);
    if (!service) throw new ServiceNotFoundException();

    const category = service.categories.find((c: ServiceCategoryDocument) => c._id == id);
    if (!category) throw new CategoryNotFoundException();

    await Promise.all([
      service.updateOne({
        $pullAll: {
          categories: [category],
        },
      }),
      this.productModel.updateMany(
        {
          categories: {
            $all: [id],
          },
          service: service._id,
        },
        {
          $pullAll: {
            categories: [id],
          },
        }
      ),
    ]);
  }
}
