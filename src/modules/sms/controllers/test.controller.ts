import { BadRequestException, Controller, Get, Inject, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";

import { ApiTest } from "@/core/decorators/api-test.decorator";
import { ApiBadValidationResponse } from "@/core/documentation/common";
import { SmsService } from "../services/sms.service";

@ApiTest({ tags: ["sms"] })
@Controller("test/sms")
export class SmsTestController {
  @Inject(SmsService)
  private readonly smsService: SmsService;

  @Get("/code")
  @ApiOperation({
    description: "Возвращает код по номеру телефона",
  })
  @ApiQuery({
    name: "phone",
    description: "Номер телефона без плюса (чтобы постоянно не кодировать)",
    example: "77086144672",
    type: String,
    required: true,
  })
  @ApiOkResponse({ description: "Ok" })
  @ApiBadValidationResponse()
  public async getCode(@Query("phone") phone?: string) {
    if (!phone) throw new BadRequestException("`phone` query parameter is required");

    return this.smsService.getCode(phone, true);
  }
}
