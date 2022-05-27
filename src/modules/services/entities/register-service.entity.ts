import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString } from "class-validator";

export class RegisterServiceDto {
  @ApiProperty({ description: "Номер телефона сервиса", example: "+77086144672" })
  @IsString()
  @IsPhoneNumber()
  phone: string;
}
