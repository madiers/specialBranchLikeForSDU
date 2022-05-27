import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import { TokenPayload } from "@/@types";
import { Address } from "@/core/schemas";
import { GetToken } from "@/core/decorators/get-token.decorator";
import { Protected } from "@/core/decorators/protected.decorator";
import {
  ApiBadValidationResponse,
  TokenUserNotFoundResponse,
} from "@/core/documentation/common";

import { CreateAddressDto } from "../entities/create-address.entity";
import { AddressesService } from "../services/addresses.service";
import { UpdateAddressDto } from "../entities/update-address.entity";

@ApiTags("addresses")
@Controller("addresses")
export class AddressesController {
  @Inject(AddressesService)
  private readonly service: AddressesService;

  @Post("/")
  @Protected("user")
  @ApiOperation({
    description: "Добавить адрес доставки для пользователя из токена",
  })
  @ApiCreatedResponse({
    description: "Адрес добавлен, возвращает созданную модель",
    type: Address,
  })
  @TokenUserNotFoundResponse()
  @ApiBadValidationResponse()
  public async createAddress(
    @Body() payload: CreateAddressDto,
    @GetToken() token: TokenPayload
  ) {
    return this.service.createAddress(payload, token);
  }

  @Get("/")
  @Protected("user")
  @ApiOperation({
    description: "Возвращает адреса пользователя из токена",
  })
  @ApiOkResponse({
    description: "Ok",
    type: Address,
    isArray: true,
  })
  @TokenUserNotFoundResponse()
  public async getAddresses(@GetToken() token: TokenPayload) {
    return this.service.getAddresses(token);
  }

  @HttpCode(200)
  @Protected("user")
  @Put("/:id")
  @ApiOperation({
    description: "Обновляет указанный адрес для пользователя из токена",
  })
  @ApiParam({
    name: "id",
    description: "ObjectId адреса для изменения",
  })
  @ApiOkResponse({
    description: "Адрес обновлен, возвращает обновленную модель",
    type: Address,
  })
  @ApiNoContentResponse({
    description: "Пользователь из токена либо адрес этого пользователя не найдены",
  })
  @ApiBadValidationResponse()
  public async updateAddress(
    @Param("id") id: string,
    @Body() payload: UpdateAddressDto,
    @GetToken() token: TokenPayload
  ) {
    return this.service.updateAddress(id, payload, token);
  }

  @HttpCode(200)
  @Protected("user")
  @Delete("/:id")
  @ApiOperation({
    description: "Удаляет указанный адрес для пользователя из токена",
  })
  @ApiParam({
    name: "id",
    description: "ObjectId адреса для удаления",
  })
  @ApiOkResponse({
    description: "Адрес удален",
  })
  @ApiNoContentResponse({
    description: "Пользователь из токена либо адрес этого пользователя не найдены",
  })
  public async deleteAddress(@Param("id") id: string, @GetToken() token: TokenPayload) {
    await this.service.deleteAddress(id, token);

    return { result: true };
  }
}
