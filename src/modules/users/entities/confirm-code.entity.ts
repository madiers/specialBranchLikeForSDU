import { ApiProperty } from "@nestjs/swagger";
import { RegisterUserDto, RegisterUserEntity } from "./register-user.entity";
import { IsString, Length } from "class-validator";

export class ConfirmCodeDto extends RegisterUserDto {
  @ApiProperty({ description: "Код из СМС", example: "1234" })
  @IsString()
  @Length(4, 4)
  code: string;

  @ApiProperty({ description: "Firebase registration token" })
  @IsString()
  deviceToken?: string;
}

export class ConfirmCodeTokenEntity {
  @ApiProperty({ description: "JWT access token" })
  token: string;

  @ApiProperty({ description: "Токен для регистрации пользователя" })
  registrationToken?: string;
}

export class ConfirmCodeEntity extends RegisterUserEntity {
  @ApiProperty({ description: "JWT access token" })
  token: string;
}
