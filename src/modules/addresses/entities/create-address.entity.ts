import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAddressDto {
  @ApiProperty({ description: "Географическая широта", type: Number })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: "Географическая долгота", type: Number })
  @IsNumber()
  longitude: number;

  @ApiProperty({ description: "Наименование географического места", type: String })
  @IsString()
  name: string;

  @ApiProperty({ description: "Этаж/Подъезд и т.п.", type: String })
  @IsString()
  details: string;

  @ApiProperty({ description: "Дополнительная информация", type: String })
  @IsString()
  @IsOptional()
  additionalInfo?: string;
}
