import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Document } from "mongoose";

@Schema({ _id: false })
export class AddressLocation {
  @ApiProperty({ description: "Широта", type: Number, required: true })
  @IsNumber()
  @Prop({ required: true })
  latitude: number;

  @ApiProperty({ description: "Долгота", type: Number, required: true })
  @IsNumber()
  @Prop({ required: true })
  longitude: number;
}

const AddressLocationSchema = SchemaFactory.createForClass(AddressLocation);

@Schema({
  collection: "addresses",
})
export class Address {
  @ApiProperty({
    description: "Географические координаты",
    type: AddressLocation,
    required: true,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => AddressLocation)
  @Prop({
    required: true,
    type: AddressLocationSchema,
  })
  location: AddressLocation;

  @ApiProperty({
    description: "Наименование места/дома/улицы и т.п",
    type: String,
    required: true,
  })
  @IsString()
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: "Уточнение по квартире, подъезду и т.п.",
    type: String,
    required: true,
  })
  @IsString()
  @Prop({ required: true })
  details: string;

  @ApiProperty({ description: "Дополнительная информация", type: String })
  @IsString()
  @IsOptional()
  @Prop({ required: false })
  additionalInfo?: string;
}

export type AddressDocument = Address & Document;
