import { Controller, Get, Inject } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { ApiTest } from "@/core/decorators/api-test.decorator";
import { User } from "@/core/schemas/users.schema";
import { UsersTestService } from "../services/test.service";

@ApiTest({ tags: ["users"] })
@Controller("test/users")
export class UsersTestController {
  @Inject(UsersTestService)
  private readonly service: UsersTestService;

  @Get("/")
  @ApiOperation({
    description: "Возвращает всех пользователей",
  })
  @ApiOkResponse({
    description: "Ok",
    type: User,
    isArray: true,
  })
  public async getAllUsers() {
    return this.service.getAllUsers();
  }
}
