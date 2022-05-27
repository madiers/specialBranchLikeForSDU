import { SchemaFactory } from "@nestjs/mongoose";

import { createInjectionModel } from "../utils/db";
import { Address } from "./address.schema";
import { DeviceToken } from "./device-tokens.schema";
import { Order } from "./orders.schema";
import { Product } from "./product.schema";
import { Service } from "./service.schema";
import { User } from "./users.schema";

export const UserSchema = SchemaFactory.createForClass(User);
export const UserIM = createInjectionModel(User.name, UserSchema);
export * from "./users.schema";

export const AddressSchema = SchemaFactory.createForClass(Address);
export const AddressIM = createInjectionModel(Address.name, AddressSchema);
export * from "./address.schema";

export const ServiceSchema = SchemaFactory.createForClass(Service);
export const ServiceIM = createInjectionModel(Service.name, ServiceSchema);
export * from "./service.schema";

export const ProductSchema = SchemaFactory.createForClass(Product);
export const ProductIM = createInjectionModel(Product.name, ProductSchema);
export * from "./product.schema";

export const OrderSchema = SchemaFactory.createForClass(Order);
export const OrderIM = createInjectionModel(Order.name, OrderSchema);
export * from "./orders.schema";

export const DeviceTokenSchema = SchemaFactory.createForClass(DeviceToken);
export const DeviceTokenIM = createInjectionModel(DeviceToken.name, DeviceTokenSchema);
export * from "./device-tokens.schema";
