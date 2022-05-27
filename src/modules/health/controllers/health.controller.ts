import { Controller, Get, Inject } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RedisHealth } from "../entities/redis-health.entity";
import { HealthService } from "../services/health.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
  @Inject(HealthService)
  private readonly service: HealthService;

  @Get("/")
  @ApiOperation({
    description: "Возвращает стандартный ответ Hello World!",
  })
  @ApiOkResponse({ description: "Ok" })
  public index() {
    return this.service.getHelloWorld();
  }

  @Get("/redis")
  @ApiOperation({
    description:
      "Возвращает статус Redis сервера и немного данных для проверки работоспособности",
  })
  @ApiOkResponse({
    description: "Ok",
    type: RedisHealth,
  })
  public redis() {
    return this.service.getRedisHealth();
  }
}
