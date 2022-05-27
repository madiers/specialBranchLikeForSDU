import { ApiProperty } from "@nestjs/swagger";
import { IsJWT, IsString } from "class-validator";

import { Service } from "@/core/schemas";

export class FinishRegistrationDto extends Service {
  @ApiProperty({
    description: "Токен для создания сервиса",
  })
  @IsJWT()
  registrationToken: string;

  @ApiProperty({ description: "Firebase registration token" })
  @IsString()
  deviceToken?: string;
}
