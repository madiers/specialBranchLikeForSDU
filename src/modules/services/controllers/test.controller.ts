import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";

import { ApiBadValidationResponse } from "@/core/documentation/common";
import { ApiTest } from "@/core/decorators/api-test.decorator";
import { Service } from "@/core/schemas";

import { TestServicesService } from "../services/test.service";

@ApiTest({
  tags: ["services"],
})
@Controller("test/services")
export class TestServicesController {
  @Inject(TestServicesService)
  private readonly service: TestServicesService;

  @Post("/")
  @ApiOperation({
    description: "Создание сервиса",
  })
  @ApiCreatedResponse({
    description: "Сервис успешно создан, возвращает id сервиса",
  })
  @ApiBadValidationResponse()
  public createService(@Body() payload: Service) {
    return this.service.createService(payload);
  }
}
