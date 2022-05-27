import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

import {
  ApiBadValidationResponse,
  ApiServiceNotFoundResponse,
} from "@/core/documentation/common";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ParseIntOptionalPipe } from "@/core/pipes/parse-int-optional.pipe";
import { Protected } from "@/core/decorators/protected.decorator";
import { GetToken } from "@/core/decorators/get-token.decorator";
import { TokenPayload } from "@/@types";
import { Service } from "@/core/schemas";

import { ServicesService } from "../services/services.service";
import { GetServicesDto, GetServicesEntity } from "../entities/get-services.entity";
import { GetPageDataEntity } from "../entities/get-page-data.entity";
import { GetDashboardEntity } from "../entities/get-dashboard.entity";

@ApiTags("services")
@Controller("services")
export class ServicesController {
  @Inject(ServicesService)
  private readonly service: ServicesService;

  @Protected("user")
  @Get("/")
  @ApiOperation({
    description: "Возвращает список сервисов используя данные о геолокации пользователя",
  })
  @ApiOkResponse({
    description: "Ok",
    type: GetServicesEntity,
    isArray: true,
  })
  @ApiBadValidationResponse()
  public getServices(@Query() query: GetServicesDto) {
    return this.service.getServices(query);
  }

  @Protected("service")
  @Get("/data")
  @ApiOperation({
    description: "Возвращает модель сервиса используя токен",
  })
  @ApiOkResponse({
    description: "Ok",
    type: Service,
  })
  public async getData(@GetToken() token: TokenPayload) {
    return this.service.findServiceByPhone(token.phone);
  }

  @Protected("service")
  @Get("/dashboard")
  @ApiOperation({
    description: "Возвращает данные главного экрана сервиса",
  })
  @ApiOkResponse({
    description: "Ok",
    type: GetDashboardEntity,
  })
  public async getDashboardData(@GetToken() token: TokenPayload) {
    return this.service.getDashboardData(token.phone);
  }

  @Protected("user", "service")
  @Get("/:id/page-data")
  @ApiOperation({
    description: "Получить товары главной страницы предприятия",
  })
  @ApiParam({
    name: "id",
    description: "ObjectID предприятия",
  })
  @ApiOkResponse({
    description: "Ok",
    type: GetPageDataEntity,
    isArray: true,
  })
  @ApiQuery({
    name: "n_products",
    description: "Кол-во загружаемых продуктов на категорию (По умолчанию 3)",
  })
  @ApiServiceNotFoundResponse()
  public async getPageData(
    @Param("id") id: string,
    @Query("n_products", ParseIntOptionalPipe) n = 3,
    @GetToken() token: TokenPayload,
  ) {
    return this.service.getPageData(id, n, token);
  }
}
