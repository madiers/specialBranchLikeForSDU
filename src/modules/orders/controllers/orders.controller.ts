import { Body, Controller, Get, Inject, Param, Post, Put, Query } from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

import { Protected } from "@/core/decorators/protected.decorator";
import { ApiBadValidationResponse } from "@/core/documentation/common";

import { OrdersService } from "../services/orders.service";
import { CreateOrderDto } from "../entities/create-order.entity";
import { UpdateOrderStatusDto } from "../entities/update-order-status.entity";
import { GetToken } from "@/core/decorators/get-token.decorator";
import { TokenPayload } from "@/@types";
import { ParseIntOptionalPipe } from "@/core/pipes/parse-int-optional.pipe";

@ApiTags("orders")
@Controller("orders")
export class OrdersController {
  @Inject(OrdersService)
  private readonly service: OrdersService;

  @Protected("user")
  @ApiOperation({
    description: "Зарегистрировать заказ",
  })
  @Post("/")
  @ApiBody({
    type: CreateOrderDto,
  })
  @ApiBadValidationResponse()
  @ApiCreatedResponse({
    description: "Заказ создан",
  })
  public async createOrder(@Body() payload: CreateOrderDto) {
    await this.service.createOrder(payload);

    return {
      result: true,
    };
  }

  @Protected("user")
  @ApiOperation({
    description: "Получить текущие заказы пользователя",
  })
  @Get("/user/:user_id")
  @ApiParam({
    name: "user_id",
    description: "ObjectID пользователя",
  })
  public async getCurrentUserOrders(@Param("user_id") userId: string) {
    return this.service.getCurrentUserOrders(userId);
  }

  @Protected("service")
  @ApiOperation({
    description: "Получить текущие заказы сервиса",
  })
  @Get("/service/:service_id")
  @ApiParam({
    name: "service_id",
    description: "ObjectID сервиса",
  })
  public async getCurrentServiceOrders(@Param("service_id") serviceId: string) {
    return this.service.getCurrentServiceOrders(serviceId);
  }

  @Protected("user")
  @ApiOperation({
    description: "Получить историю заказов пользователя",
  })
  @Get("/user/:user_id/history")
  @ApiParam({
    name: "user_id",
    description: "ObjectID пользователя",
  })
  @ApiQuery({
    name: "page_size",
    description: "Кол-во выгружаемых заказов на страницу (Default 5)",
  })
  @ApiQuery({
    name: "page",
    description: "Номер страницы (Default 0)",
  })
  public async getUserHistory(
    @Param("user_id") userId: string,
    @Query("page_size", ParseIntOptionalPipe) pageSize = 10,
    @Query("page", ParseIntOptionalPipe) page = 0,
  ) {
    return this.service.getUserHistory(userId, pageSize, page);
  }

  @Protected("service")
  @ApiOperation({
    description: "Получить историю заказов сервиса",
  })
  @Get("/service/:service_id/history")
  @ApiParam({
    name: "service_id",
    description: "ObjectID сервиса",
  })
  @ApiQuery({
    name: "page_size",
    description: "Кол-во выгружаемых заказов на страницу (Default 5)",
  })
  @ApiQuery({
    name: "page",
    description: "Номер страницы (Default 0)",
  })
  public async getServiceHistory(
    @Param("service_id") serviceId: string,
    @Query("page_size", ParseIntOptionalPipe) pageSize = 10,
    @Query("page", ParseIntOptionalPipe) page = 0,
  ) {
    return this.service.getServiceHistory(serviceId, pageSize, page);
  }

  @Protected("user", "service")
  @ApiOperation({
    description: "Обновить статус заказа",
  })
  @Put("/:order_id")
  @ApiParam({
    name: "order_id",
    description: "ObjectID заказа",
  })
  @ApiBody({
    type: UpdateOrderStatusDto,
  })
  @ApiBadValidationResponse()
  public async updateOrderStatus(
    @Param("order_id") orderId: string,
    @Body() { status }: UpdateOrderStatusDto,
    @GetToken() { phone, role }: TokenPayload,
  ) {
    if (role === "user")
      return this.service.updateOrderStatusFromUser(phone, orderId, status);
    if (role === "service")
      return this.service.updateOrderStatusFromService(phone, orderId, status);
    return {
      result: false,
    };
  }
}
