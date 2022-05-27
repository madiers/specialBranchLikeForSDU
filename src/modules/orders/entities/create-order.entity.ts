import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNumber,
  IsObject,
  ValidateNested,
} from "class-validator";
import { Types } from "mongoose";

class CreateOrderProduct {
  @ApiProperty({
    description: "ObjectID продукта",
    type: String,
    required: true,
  })
  @IsMongoId()
  product: Types.ObjectId;

  @ApiProperty({
    description: "Кол-во/вес",
    type: Number,
  })
  @IsNumber()
  amount: number;
}

class CreateOrderUser {
  @ApiProperty({
    description: "ObjectID пользователя/сервиса",
    required: true,
  })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiProperty({
    description: "Object ID адреса пользователя/сервиса",
    required: true,
  })
  @IsMongoId()
  address: Types.ObjectId;
}

export class CreateOrderDto {
  @ApiProperty({
    description: "Корзина",
    required: true,
    isArray: true,
    type: CreateOrderProduct,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProduct)
  products: CreateOrderProduct[];

  @ApiProperty({
    description: "Информация по пользователю",
    required: true,
    type: CreateOrderUser,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateOrderUser)
  user: CreateOrderUser;

  @ApiProperty({
    description: "Информация по сервису",
    required: true,
    type: CreateOrderUser,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateOrderUser)
  service: CreateOrderUser;

  @ApiProperty({
    description: "Сумма заказа",
    type: Number,
  })
  @IsNumber()
  total: number;
}
