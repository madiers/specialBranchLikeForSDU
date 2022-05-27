import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RegisterDeviceTokenDto {
  @IsString()
  @ApiProperty({ description: "Firebase registration token" })
  token: string;
}
