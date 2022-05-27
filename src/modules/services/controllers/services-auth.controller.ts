import { Controller, Inject, HttpCode, Post, Body } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import {
  ConfirmCodeDto,
  ConfirmCodeTokenEntity,
} from "@/modules/users/entities/confirm-code.entity";
import { Protected } from "@/core/decorators/protected.decorator";
import { ApiBadValidationResponse } from "@/core/documentation/common";

import { RegisterServiceDto } from "../entities/register-service.entity";
import { ServicesAuthService } from "../services/services-auth.service";
import { ServicesService } from "../services/services.service";
import { FinishRegistrationDto } from "../entities/finish-registration.entity";

@ApiTags("services")
@Controller("services")
export class ServicesAuthController {
  @Inject(ServicesAuthService)
  private readonly service: ServicesAuthService;

  @Inject(ServicesService)
  private readonly servicesService: ServicesService;

  @HttpCode(200)
  @Post("/register")
  @ApiOperation({
    description: "Попытка регистрации предприятия в системе",
  })
  @ApiOkResponse({
    description: "Данный номер уже существует в системе, код был сгенерирован",
  })
  @ApiNoContentResponse({
    description:
      "Данного номера не было зарегистрировано, сервис был временно создан и код сгенерирован",
  })
  @ApiBadValidationResponse()
  public async register(@Body() payload: RegisterServiceDto) {
    await this.service.register(payload);

    return { result: true, exists: true };
  }

  @Protected("service")
  @Post("/finish-registration")
  @ApiOperation({
    description: "Завершение регистрации предприятия",
  })
  @ApiCreatedResponse({
    description: "Сервис создан",
  })
  @ApiBadValidationResponse()
  @ApiForbiddenResponse({
    description: "Токен регистрации не прошел валидации",
  })
  public async finishRegistration(@Body() payload: FinishRegistrationDto) {
    const service = await this.servicesService.createService(payload);

    if (payload.deviceToken) {
      await this.service.setServiceDeviceToken(service._id, payload.deviceToken);
    }

    return { result: true, _id: service._id };
  }

  @HttpCode(200)
  @Post("/confirm-code")
  @ApiOperation({
    description: "Подтверждение СМС кода",
  })
  @ApiOkResponse({
    description: "СМС код подтвержден. Возвращает access token",
    type: ConfirmCodeTokenEntity,
  })
  @ApiNoContentResponse({
    description: "Сервис не найден или код не валиден (истек срок работы/не существует)",
  })
  @ApiBadValidationResponse()
  public async confirmCode(@Body() payload: ConfirmCodeDto) {
    return this.service.confirmCode(payload);
  }
}
