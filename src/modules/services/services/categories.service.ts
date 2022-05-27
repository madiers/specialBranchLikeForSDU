import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { ServiceNotFoundException } from "@/core/exceptions/service-not-found.exception";
import {
  ProductDocument,
  ProductIM,
  ProductStatus,
  ServiceCategoryDocument,
  ServiceCategoryStatus,
  ServiceDocument,
  ServiceIM,
} from "@/core/schemas";

import { ServicesService } from "./services.service";
import { CategoryNotFoundException } from "@/core/exceptions/category-not-found.exception";
import { GetCategoriesEntity } from "../entities/get-categories.entity";
import { AddCategoryDto } from "../entities/add-category.entity";
import { EditCategoryDto } from "../entities/edit-category.entity";

@Injectable()
export class CategoriesService {
  @InjectModel(ServiceIM.name)
  private readonly serviceModel: Model<ServiceDocument>;

  @InjectModel(ProductIM.name)
  private readonly productModel: Model<ProductDocument>;

  @Inject(ServicesService)
  private readonly servicesService: ServicesService;

  public async getCategories(phone: string): Promise<GetCategoriesEntity[]> {
    const service = await this.servicesService.findServiceByPhone(phone);
    if (!service) throw new ServiceNotFoundException();

    // TODO: Refactor
    return Promise.all(
      service.categories.map(async (category: ServiceCategoryDocument) => {
        const products = await this.productModel.find(
          {
            categories: {
              $in: [category._id],
            },
            service: service._id,
          },
          {
            status: 1,
          }
        );

        let result: any = products[0]?.status || ProductStatus.PUBLIC;
        for (const { status } of products) {
          if (status !== result) {
            result = ServiceCategoryStatus.PARTIAL;
            break;
          }
        }

        return {
          _id: category._id,
          name: category.name,
          index: category.index,
          amount: products.length,
          status: result as ServiceCategoryStatus,
        } as GetCategoriesEntity;
      })
    );
  }

  public async addCategory(phone: string, { index, name, products }: AddCategoryDto) {
    const service = await this.servicesService.findServiceByPhone(phone);
    if (!service) throw new ServiceNotFoundException();

    service.categories.push({
      index,
      name,
    });

    await service.save();

    const category = service.categories.find(
      (f) => f.name === name && f.index === index
    ) as ServiceCategoryDocument;

    await this.productModel.updateMany(
      {
        service: service._id,
        _id: { $in: products },
      },
      {
        $push: {
          categories: category._id,
        },
      }
    );
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

  public async updateCategory(
    phone: string,
    id: string,
    { index, name, status, products }: EditCategoryDto
  ) {
    const service = await this.servicesService.findServiceByPhone(phone);
    if (!service) throw new ServiceNotFoundException();

    const category = service.categories.find(
      (c: ServiceCategoryDocument) => c._id == id
    ) as ServiceCategoryDocument;
    if (!category) throw new CategoryNotFoundException();

    category.index = index;
    category.name = name;

    const session = await this.productModel.startSession();

    await service.save();

    // TODO: refactor
    session.withTransaction(async () => {
      // Firstly, removing category from all the products it's assigned with
      await this.productModel.updateMany(
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
      );

      // Secondly, adding category to the new product list
      const targetStatus =
        status !== ServiceCategoryStatus.PARTIAL
          ? ((status as unknown) as ProductStatus)
          : undefined;
      await this.productModel.updateMany(
        {
          service: service._id,
          _id: { $in: products },
        },
        {
          $push: {
            categories: category._id,
          },
          status: targetStatus,
        }
      );
    });

    await session.commitTransaction();
    session.endSession();
  }
}
