import { Body, Controller, Delete, Inject, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

import { Protected } from "@/core/decorators/protected.decorator";
import { ApiBadValidationResponse } from "@/core/documentation/common";
import { GetToken } from "@/core/decorators/get-token.decorator";
import { TokenPayload } from "@/@types";
import { UtilsService } from "../services/utils.service";
import { RegisterDeviceTokenDto } from "../entities/register-device-token.entity";

@ApiTags("utils")
@Controller("utils")
export class UtilsController {
  @Inject(UtilsService)
  private readonly service: UtilsService;

  @Protected("user", "service")
  @ApiOperation({
    description: "Добавить firebase registration token для пользователя",
  })
  @Post("/device-token")
  @ApiBody({ type: RegisterDeviceTokenDto })
  @ApiBadValidationResponse()
  public async registerDeviceToken(
    @GetToken() token: TokenPayload,
    @Body() payload: RegisterDeviceTokenDto,
  ) {
    await this.service.registerDeviceToken(token, payload);
  }

  @Protected("user", "service")
  @ApiOperation({
    description: "Удалить firebase registration token",
  })
  @Delete("/device-token/:target_id")
  @ApiParam({
    name: "target_id",
    description: "ObjectID сервиса/пользователя",
  })
  public async deleteDeviceToken(
    @GetToken() token: TokenPayload,
    @Param("target_id") targetId: string,
  ) {
    await this.service.deleteDeviceToken(token, targetId);
  }
}
