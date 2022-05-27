import { Prop, Schema } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Types, Document } from "mongoose";
import { getEnumType } from "../utils/db";

import { Address, AddressDocument } from "./address.schema";

export enum UserStatus {
  ENABLED = "enabled",
  DISABLED = "disabled",
}

@Schema({
  collection: "users",
})
export class User {
  @ApiProperty({
    description: "Номер телефона пользователя",
    type: String,
    required: true,
    example: "+77086144672",
  })
  @Prop({ required: true, unique: true })
  phone: string;

  @ApiProperty({
    description: "Дата создания пользователя",
    type: Date,
    required: true,
  })
  @Prop({ type: Date, required: true, default: Date.now, immutable: true })
  createdDate: Date;

  @ApiProperty({
    description: "Статус пользователя",
    type: String,
    enum: Object.values(UserStatus),
    required: true,
  })
  @Prop(getEnumType(UserStatus, "ENABLED"))
  status: UserStatus;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: Address.name,
      },
    ],
  })
  addresses: AddressDocument[];
}

export type UserDocument = User & Document;
