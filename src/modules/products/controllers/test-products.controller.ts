import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

import {
  ApiBadValidationResponse,
  ApiServiceNotFoundResponse,
} from "@/core/documentation/common";
import { Protected } from "@/core/decorators/protected.decorator";
import { GetToken } from "@/core/decorators/get-token.decorator";
import { ApiTest } from "@/core/decorators/api-test.decorator";
import { Product } from "@/core/schemas";
import { TokenPayload } from "@/@types";

import { TestProductsService } from "../services/test-products.service";
import { ProductsService } from "../services/products.service";

@ApiTest({
  tags: ["products"],
})
@Controller("test/products")
export class TestProductsController {
  @Inject(TestProductsService)
  private readonly service: TestProductsService;

  @Inject(ProductsService)
  private readonly productsService: ProductsService;

  @Protected("service")
  @Get("/")
  @ApiOperation({
    description: "Возвращает все товары сервиса",
  })
  @ApiOkResponse({
    description: "Ok",
    type: Product,
    isArray: true,
  })
  @ApiServiceNotFoundResponse()
  public async getProducts(@GetToken() payload: TokenPayload) {
    return this.productsService.findProductsByServicePhone(payload.phone);
  }

  @Protected("service")
  @Post("/")
  @ApiOperation({
    description: "Создает товар для сервиса. Возвращает созданную модель",
  })
  @ApiCreatedResponse({
    description: "Товар создан",
    type: Product,
  })
  @ApiServiceNotFoundResponse()
  public async createProduct(@GetToken() token: TokenPayload, @Body() payload: Product) {
    return this.service.createProduct(token.phone, payload);
  }

  @Protected("service")
  @Put("/:id/assign-category")
  @ApiOperation({
    description: "Записать продукт к категории",
  })
  @ApiParam({
    name: "id",
    description: "ObjectID продукта",
  })
  @ApiQuery({
    name: "category",
    description: "ObjectID категории",
  })
  @ApiNoContentResponse({
    description: "Сервис, продукт или категория не найдены",
  })
  @ApiOkResponse({
    description: "Ok",
  })
  @ApiBadValidationResponse()
  public async assignCategory(
    @Param("id") id: string,
    @Query("category") category: string,
    @GetToken() token: TokenPayload
  ) {
    if (!category) throw new BadRequestException("Category must be defined");
    await this.service.assignCategory(token.phone, id, category);
  }
}
