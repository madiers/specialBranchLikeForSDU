import { ApiTest } from "@/core/decorators/api-test.decorator";
import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";

@ApiTest({ tags: ["health"] })
@Controller("test/health")
export class HealthTestController {
  @Get("/")
  @ApiOperation({
    description: "Возвращает стандартный ответ Test!",
  })
  @ApiOkResponse({ description: "Ok" })
  public test() {
    return "Test!";
  }
}
