import { ProductStatus, ProductType, ProductWeightedType } from "@/core/schemas";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsIn,
  IsMongoId,
  IsNumber,
  IsString,
  ValidateIf,
} from "class-validator";
import { Types } from "mongoose";

export class CreateProductDto {
  @ApiProperty({ description: "Наименование продукта" })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Тип продукта",
    enum: Object.values(ProductType),
  })
  @IsIn(Object.values(ProductType))
  type: string;

  @ApiProperty({
    description: "Мера измерения. Присутствует если type == 'weighted'",
    enum: Object.values(ProductWeightedType),
    required: false,
  })
  @ValidateIf((o: CreateProductDto) => o.type === "weighted")
  @IsIn(Object.values(ProductWeightedType))
  weightedType?: string;

  @ApiProperty({
    description: "Вес на цену товара. Присутствует если type == 'weighted'",
    required: false,
  })
  @ValidateIf((o: CreateProductDto) => o.type === "weighted")
  @IsNumber()
  weightPerPrice?: number;

  @ApiProperty({
    description: "Цена товара",
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: "Массив ObjectId категорий",
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsMongoId({ each: true })
  categories: Types.ObjectId[];

  @ApiProperty({
    description: "Наличие товара",
    type: String,
    enum: Object.values(ProductStatus),
  })
  @IsString()
  @IsIn(Object.values(ProductStatus))
  status: ProductStatus;
}

export class CreateProductEntity {
  @ApiProperty({
    description: "ObjectId новой сущности",
  })
  _id: string;
}
