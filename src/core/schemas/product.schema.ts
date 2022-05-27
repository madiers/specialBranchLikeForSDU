import { Prop, Schema } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsNumber, IsOptional, IsString } from "class-validator";
import { Types, Document } from "mongoose";

import { getEnumType } from "../utils/db";
import { Service, ServiceDocument } from "./service.schema";

export enum ProductType {
  PIECE = "piece",
  WEIGHTED = "weighted",
}

export enum ProductWeightedType {
  KG = "kg",
  G = "g",
}

export enum ProductStatus {
  PUBLIC = "public",
  PRIVATE = "private",
}

@Schema({
  collection: "products",
})
export class Product {
  @IsString()
  @ApiProperty({ description: "Наименование продукта" })
  @Prop({ required: true })
  name: string;

  @IsIn(Object.values(ProductType))
  @ApiProperty({
    description: "Тип продукта",
    enum: Object.values(ProductType),
  })
  @Prop(getEnumType(ProductType))
  type: ProductType;

  @IsIn(Object.values(ProductWeightedType))
  @IsOptional()
  @ApiProperty({
    description: "Мера измерения. Присутствует если type == 'weighted'",
    enum: Object.values(ProductWeightedType),
    required: false,
  })
  @Prop(getEnumType(ProductWeightedType, undefined, false))
  weightedType?: ProductWeightedType;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: "Вес на цену товара. Присутствует если type == 'weighted'",
    required: false,
  })
  @Prop({
    required: false,
  })
  weightPerPrice?: number;

  @IsNumber()
  @ApiProperty({
    description: "Цена товара",
  })
  @Prop({
    required: true,
  })
  price: number;

  @IsArray()
  @ApiProperty({
    description: "Массив id категорий",
    isArray: true,
    type: String,
  })
  @Prop({
    required: true,
    default: () => [],
    type: [
      {
        type: Types.ObjectId,
      },
    ],
  })
  categories: Types.ObjectId[];

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Service.name,
  })
  service: ServiceDocument;

  @ApiProperty({
    description: "Статус продукта",
    type: String,
    enum: Object.values(ProductStatus),
  })
  @IsString()
  @IsIn(Object.values(ProductStatus))
  @Prop(getEnumType(ProductStatus, "PUBLIC"))
  status: ProductStatus;
}

export type ProductDocument = Product & Document;
