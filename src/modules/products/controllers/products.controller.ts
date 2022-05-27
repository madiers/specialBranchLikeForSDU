import { TokenPayload } from "@/@types";
import { GetToken } from "@/core/decorators/get-token.decorator";
import { Protected } from "@/core/decorators/protected.decorator";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ParseIntOptionalPipe } from "@/core/pipes/parse-int-optional.pipe";
import { Product } from "@/core/schemas";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { Types } from "mongoose";
import { CreateProductDto, CreateProductEntity } from "../entities/create-product.entity";

import { ProductsService } from "../services/products.service";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  @Inject(ProductsService)
  private readonly service: ProductsService;

  @Protected("user", "service")
  @Get("/")
  @ApiOperation({
    description: "Получить список продуктов с пагинацией",
  })
  @ApiQuery({
    name: "service_id",
    description: "ObjectID сервиса",
  })
  @ApiQuery({
    name: "category_id",
    description: "ObjectID категории",
  })
  @ApiQuery({
    name: "search",
    description: "Текст для поиска",
  })
  @ApiQuery({
    name: "page_size",
    description: "Кол-во выгружаемых продуктов на страницу (Default 10)",
  })
  @ApiQuery({
    name: "page",
    description: "Номер страницы (Default 0)",
  })
  @ApiOkResponse({
    description: "Ok",
    type: Product,
    isArray: true,
  })
  public async getProducts(
    @GetToken() token: TokenPayload,
    @Query("service_id") serviceId: string,
    @Query("category_id") categoryId: string,
    @Query("search") search: string,
    @Query("page_size", ParseIntOptionalPipe) pageSize = 10,
    @Query("page", ParseIntOptionalPipe) page = 0,
  ) {
    return this.service.getProducts(token, serviceId, categoryId, search, pageSize, page);
  }

  @Protected("service")
  @Post("/")
  @ApiOperation({
    description: "Регистрация продукта в сервисе",
  })
  @ApiBody({
    type: CreateProductDto,
  })
  @ApiCreatedResponse({
    description: "Продукт успешно создан",
    type: CreateProductEntity,
  })
  public async createProduct(
    @Body() payload: CreateProductDto,
    @GetToken() token: TokenPayload,
  ) {
    return this.service.createProduct(payload, token);
  }

  @Protected("service")
  @HttpCode(HttpStatus.OK)
  @Put("/:id")
  @ApiOperation({
    description: "Обновление продукта",
  })
  @ApiBody({
    type: CreateProductDto,
  })
  @ApiOkResponse({
    description: "Продукт успешно обновлен",
  })
  public async updateProduct(
    @Param("id") id: Types.ObjectId,
    @Body() payload: CreateProductDto,
    @GetToken() token: TokenPayload,
  ) {
    return this.service.updateProduct(id, payload, token);
  }

  @Protected("service")
  @HttpCode(HttpStatus.OK)
  @Delete("/:id")
  @ApiOperation({
    description: "Удаление продукта",
  })
  @ApiOkResponse({
    description: "Продукт успешно удален",
  })
  public async deleteProduct(
    @Param("id") id: Types.ObjectId,
    @GetToken() token: TokenPayload,
  ) {
    return this.service.deleteProduct(id, token);
  }
}
