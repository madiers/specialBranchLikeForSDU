import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { Types, Document } from "mongoose";
import { getEnumType } from "../utils/db";

import { Address, AddressDocument } from "./address.schema";

export enum ServiceStatus {
  ENABLED = "enabled",
  DISABLED = "disabled",
}

export enum ServiceType {
  SHOP = "shop",
  PHARMACY = "pharmacy",
  RESTAURANT = "restaurant",
}

export enum ServiceDeliveryType {
  FREE = "free",
  PAID = "paid",
}

@Schema({ _id: false })
class ServiceDelivery {
  @ApiProperty({
    description: "Тип доставки",
    enum: Object.values(ServiceDeliveryType),
  })
  @IsString()
  @IsIn(Object.values(ServiceDeliveryType))
  @Prop(getEnumType(ServiceDeliveryType))
  type: ServiceDeliveryType;

  @ApiProperty({
    description: "Цена доставки в случае если delivery.type == 'paid'",
    type: Number,
    required: false,
    example: 300,
  })
  @IsNumber()
  @IsOptional()
  @Prop()
  value?: number;

  @ApiProperty({
    description: "Радиус доставки в метрах",
    type: Number,
    required: false,
    example: 1000,
  })
  @IsNumber()
  @IsOptional()
  @Prop()
  radius?: number;
}

const ServiceDeliverySchema = SchemaFactory.createForClass(ServiceDelivery);

export enum ServiceWorkHoursType {
  CUSTOM = "custom",
  FULL_DAY = "full_day",
}

@Schema({ _id: false })
class ServiceWorkHours {
  @ApiProperty({
    description: "Тип работы",
    enum: Object.values(ServiceWorkHoursType),
  })
  @IsString()
  @IsIn(Object.values(ServiceWorkHoursType))
  @Prop(getEnumType(ServiceWorkHoursType))
  type: ServiceWorkHoursType;

  @ApiProperty({
    description: "Время начала работы",
    type: String,
    example: "09:00",
    required: false,
  })
  @IsString()
  @IsOptional()
  @Prop()
  startTime?: string;

  @ApiProperty({
    description: "Время конца работы",
    type: String,
    example: "18:00",
    required: false,
  })
  @IsString()
  @IsOptional()
  @Prop()
  endTime?: string;
}

const ServiceWorkHoursSchema = SchemaFactory.createForClass(ServiceWorkHours);

export enum ServiceCategoryStatus {
  PUBLIC = "public",
  PRIVATE = "private",
  PARTIAL = "partial",
}

@Schema()
class ServiceCategory {
  @ApiProperty({
    description: "Наименование категории",
    type: String,
  })
  @IsString()
  @Prop()
  name: string;

  @ApiProperty({
    description: "Порядок в списке категорий",
    type: Number,
  })
  @IsInt()
  @Prop()
  index: number;
}

export type ServiceCategoryDocument = ServiceCategory & Document;

const ServiceCategorySchema = SchemaFactory.createForClass(ServiceCategory);

@Schema({
  collection: "services",
})
export class Service {
  @ApiProperty({
    description: "Номер телефона сервиса",
    type: String,
    example: "+77086144672",
  })
  @IsString()
  @IsPhoneNumber()
  @Prop({ required: true, unique: true })
  phone: string;

  @ApiProperty({
    description: "Тип сервиса",
    type: String,
    enum: Object.values(ServiceType),
  })
  @IsString()
  @IsIn(Object.values(ServiceType))
  @Prop(getEnumType(ServiceType))
  type: ServiceType;

  @ApiProperty({
    description: "Наименование сервиса",
    type: String,
  })
  @IsString()
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: "Описание сервиса",
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Prop()
  description?: string;

  @ApiProperty({
    description: "Информация по доставке сервиса",
    type: ServiceDelivery,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceDelivery)
  @Prop({
    required: true,
    type: ServiceDeliverySchema,
  })
  delivery: ServiceDelivery;

  @ApiProperty({
    description: "Информация по рабочим часам сервиса",
    type: ServiceWorkHours,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceWorkHours)
  @Prop({
    required: true,
    type: ServiceWorkHoursSchema,
  })
  workHours: ServiceWorkHours;

  @ApiProperty({
    description: "Информация по адресу сервиса",
    type: Address,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  @Prop({
    type: Types.ObjectId,
    ref: Address.name,
  })
  address: AddressDocument;

  @ApiProperty({
    description: "Статус сервиса",
    enum: Object.values(ServiceStatus),
  })
  @Prop(getEnumType(ServiceStatus, "ENABLED"))
  status: ServiceStatus;

  @ApiProperty({
    description: "Дата регистрации",
    type: Date,
  })
  @Prop({ type: Date, required: true, default: Date.now, immutable: true })
  createdDate: Date;

  @ApiProperty({
    description: "Категории продуктов",
    type: ServiceCategory,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ServiceCategory)
  @Prop({
    required: true,
    default: () => [],
    type: [
      {
        type: ServiceCategorySchema,
      },
    ],
  })
  categories: ServiceCategory[];
}

export type ServiceDocument = Service & Document;
