import { MongooseModule, PropOptions } from "@nestjs/mongoose";
import { Schema, Document, Model } from "mongoose";

export function createInjectionModel<T>(
  name: string,
  schema: Schema<Document<T, any>, Model<any, any, any>, undefined>
) {
  return {
    name,
    getInjectionModel() {
      return MongooseModule.forFeature([
        {
          name,
          schema,
        },
      ]);
    },
  };
}

export function getEnumType<T>(
  target: T,
  defaultKey?: keyof T,
  required = true
): PropOptions {
  return {
    type: String,
    enum: Object.values(target),
    default: defaultKey ? target[defaultKey] : undefined,
    required,
  };
}
