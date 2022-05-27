import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAddressDto {
  @ApiProperty({ description: "Географическая широта", type: Number })
  @IsNumber()
  @IsOptional()
  latitude: number;

  @ApiProperty({ description: "Географическая долгота", type: Number })
  @IsNumber()
  @IsOptional()
  longitude: number;

  @ApiProperty({ description: "Наименование географического места", type: String })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: "Этаж/Подъезд и т.п.", type: String })
  @IsString()
  @IsOptional()
  details: string;

  @ApiProperty({ description: "Дополнительная информация", type: String })
  @IsString()
  @IsOptional()
  additionalInfo?: string;
}
