import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Product, ProductDocument, ProductIM } from "@/core/schemas";
import { ServicesService } from "@/modules/services/services/services.service";
import { ProductsService } from "./products.service";
import { ServiceNotFoundException } from "@/core/exceptions/service-not-found.exception";
import { ProductNotFoundException } from "@/core/exceptions/product-not-found.exception";
import { CategoryNotFoundException } from "@/core/exceptions/category-not-found.exception";

@Injectable()
export class TestProductsService {
  @InjectModel(ProductIM.name)
  private readonly productModel: Model<ProductDocument>;

  @Inject(ServicesService)
  private readonly servicesService: ServicesService;

  @Inject(ProductsService)
  private readonly productsService: ProductsService;

  public async createProduct(phone: string, payload: Product) {
    const service = await this.servicesService.findServiceByPhone(phone);
    if (!service) throw new ServiceNotFoundException();
    return this.productModel.create({ ...payload, service: service._id });
  }

  public async assignCategory(phone: string, id: string, categoryId: string) {
    const service = await this.servicesService.findServiceByPhone(phone);
    if (!service) throw new ServiceNotFoundException();

    const product = await this.productsService.findProductById(id);
    if (!product) throw new ProductNotFoundException();

    const category = this.servicesService.findCategoryById(service, categoryId);
    if (!category) throw new CategoryNotFoundException();

    product.categories.push(category._id);
    await product.save();
  }
}
