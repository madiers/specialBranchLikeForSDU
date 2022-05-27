import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsPhoneNumber } from "class-validator";

export class RegisterUserDto {
  @ApiProperty({ description: "Номер телефона пользователя", example: "+77086144672" })
  @IsString()
  @IsPhoneNumber()
  phone: string;
}

export class RegisterUserEntity {
  @ApiProperty({ description: "ObjectId", example: "60d27d17cf7488c1f778cc49" })
  _id: string;
}
