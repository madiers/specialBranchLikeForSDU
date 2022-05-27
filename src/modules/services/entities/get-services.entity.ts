import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";

import { Service, ServiceType } from "@/core/schemas";

export class GetServicesDto {
  @ApiProperty({
    description: "Широта",
  })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: "Долгота",
  })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: "Тип сервиса",
    type: String,
    enum: Object.values(ServiceType),
  })
  @IsString()
  @IsIn(Object.values(ServiceType))
  @IsOptional()
  type?: ServiceType;
}

export class GetServicesEntity extends Service {
  @ApiProperty({
    description:
      "Расстояние от заданной точки до сервиса в км. Если точка не задана, то значение будет установлено как null",
    type: Number,
    example: 0.3,
  })
  distance: number | null;
}
