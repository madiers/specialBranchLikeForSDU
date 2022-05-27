import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule } from "nestjs-redis";
import { FirebaseModule } from "nestjs-firebase";

import { config, IConfig, IConfigMongodb, IConfigRedis } from "@/config";
import { SocketsModule } from "@/core/sockets/sockets.module";

import { AddressesModule } from "@/modules/addresses/addresses.module";
import { HealthModule } from "@/modules/health/health.module";
import { UsersModule } from "@/modules/users/users.module";
import { SmsModule } from "@/modules/sms/sms.module";
import { ServicesModule } from "@/modules/services/services.module";
import { ProductsModule } from "@/modules/products/products.module";
import { OrdersModule } from "@/modules/orders/orders.module";

/**
 * Sobiraet mama obed sinu v shkolu
 * kladet tuda hleb, kolbasu i gvozdi
 * sin zahodit i sprashivaet:"zachem vse eto"
 * nu kak zachem, kladesh kolbasu i yesh
 * a gvozdi?
 * tak vot zhe oni
 */

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService<IConfig>) => {
        const redisConfig = configService.get<IConfigRedis>("redis")!;
        return { ...redisConfig };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<IConfig>) => {
        const { uri, password, username, db } = configService.get<IConfigMongodb>(
          "mongodb",
        )!;
        return {
          uri,
          auth: {
            user: username,
            password,
          },
          dbName: db,
          autoIndex: false,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          poolSize: 10,
        };
      },
      inject: [ConfigService],
    }),
    FirebaseModule.forRoot({
      googleApplicationCredential: "deli-firebase-sdk.json",
    }),
    SocketsModule,
    HealthModule,
    UsersModule,
    SmsModule,
    AddressesModule,
    ServicesModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}
