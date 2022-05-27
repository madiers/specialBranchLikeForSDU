import { ApiBadValidationResponse } from "@/core/documentation/common";
import { Body, Controller, HttpCode, Inject, Post } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ConfirmCodeDto, ConfirmCodeEntity } from "../entities/confirm-code.entity";

import { RegisterUserDto, RegisterUserEntity } from "../entities/register-user.entity";
import { UsersAuthService } from "../services/users-auth.service";

@ApiTags("users")
@Controller("users")
export class UsersAuthController {
  @Inject(UsersAuthService)
  private readonly service: UsersAuthService;

  @Post("/register")
  @ApiOperation({
    description:
      "Зарегистрировать пользователя по номеру телефона (если ранее номер не был зарегистрирован) и отправить 4х значный код по СМС.",
  })
  @ApiCreatedResponse({
    description: "Операция успешна. Возвращает ObjectId сущности",
    type: RegisterUserEntity,
  })
  @ApiBadValidationResponse()
  public async register(@Body() payload: RegisterUserDto) {
    const _id = await this.service.register(payload);
    return { _id };
  }

  @HttpCode(200)
  @Post("/confirm-code")
  @ApiOperation({
    description: "Подтвердить СМС",
  })
  @ApiOkResponse({
    description: "СМС код подтвержден. Возвращает ObjectId сущности и access token",
    type: ConfirmCodeEntity,
  })
  @ApiNoContentResponse({
    description:
      "Пользователь не найден или код не валиден (истек срок работы/не существует)",
  })
  @ApiBadValidationResponse()
  public async confirmCode(@Body() payload: ConfirmCodeDto) {
    return this.service.confirmCode(payload);
  }
}
