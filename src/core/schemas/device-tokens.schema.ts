import { Prop, Schema } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsMongoId, IsString } from "class-validator";
import { Types, Document } from "mongoose";

import { getEnumType } from "../utils/db";

export enum DeviceTokenUserType {
  SERVICE = "service",
  USER = "user",
}

@Schema({
  collection: "device-tokens",
})
export class DeviceToken {
  @IsString()
  @ApiProperty({ description: "Firebase registration token" })
  @Prop({ required: true })
  token: string;

  @IsIn(Object.values(DeviceTokenUserType))
  @ApiProperty({
    description: "Сервис/Пользователь",
    enum: Object.values(DeviceTokenUserType),
  })
  @Prop(getEnumType(DeviceTokenUserType))
  targetType: DeviceTokenUserType;

  @IsMongoId()
  @ApiProperty({
    description: "ObjectID сервиса/пользователя",
    type: String,
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
  })
  targetId: Types.ObjectId;
}

export type DeviceTokenDocument = DeviceToken & Document;
