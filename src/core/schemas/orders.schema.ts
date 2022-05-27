import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document, Types } from "mongoose";
import { getEnumType } from "../utils/db";
import { Address, AddressDocument } from "./address.schema";

import { Product, ProductDocument } from "./product.schema";

export enum OrderStatus {
  PENDING = "pending",
  DELIVERING = "delivering",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

@Schema({ _id: false })
export class OrderProduct {
  @ApiProperty({
    description: "Модель продукта",
    type: Product,
  })
  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product: ProductDocument;

  @ApiProperty({
    description: "Кол-во/вес",
  })
  @Prop({
    type: Number,
    required: true,
  })
  amount: number;
}

type OrderProductDocument = OrderProduct & Document;

const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);

@Schema({ _id: false })
export class OrderEntity {
  @ApiProperty({
    description: "ObjectID пользователя/сервиса",
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  _id: string;

  @ApiProperty({
    description: "Адрес пользователя/сервиса",
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    ref: Address.name,
  })
  address: AddressDocument;

  @ApiProperty({
    description: "Номер телефона пользователя/сервиса",
    required: true,
  })
  @Prop({
    type: String,
    required: true,
  })
  phone: string;

  @ApiProperty({
    description: "Наименование (если сервис)",
  })
  @Prop({
    type: String,
  })
  name?: string;
}

type OrderEntityDocument = OrderEntity & Document;
const OrderEntitySchema = SchemaFactory.createForClass(OrderEntity);

@Schema({
  collection: "orders",
})
export class Order {
  @ApiProperty({
    description: "Корзина",
    required: true,
    isArray: true,
    type: OrderProduct,
  })
  @Prop([
    {
      type: OrderProductSchema,
      required: true,
    },
  ])
  products: OrderProductDocument[];

  @ApiProperty({
    description: "Информация по пользователю",
    required: true,
    type: OrderEntity,
  })
  @Prop({
    type: OrderEntitySchema,
    required: true,
  })
  user: OrderEntityDocument;

  @ApiProperty({
    description: "Информация по сервису",
    required: true,
    type: OrderEntity,
  })
  @Prop({
    type: OrderEntitySchema,
    required: true,
  })
  service: OrderEntityDocument;

  @ApiProperty({
    description: "Дата создания заказа",
    type: Date,
  })
  @Prop({ type: Date, required: true, default: Date.now, immutable: true })
  orderTime: Date;

  @ApiProperty({
    description: "Сумма заказа",
    type: Number,
  })
  @Prop({
    type: Number,
    required: true,
  })
  total: number;

  @ApiProperty({
    description: "Статус заказа",
    enum: Object.values(OrderStatus),
  })
  @Prop(getEnumType(OrderStatus))
  status: OrderStatus;
}

export type OrderDocument = Order & Document;
