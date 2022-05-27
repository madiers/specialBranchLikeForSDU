import { Module } from "@nestjs/common";

import { DeviceTokenIM, OrderIM } from "@/core/schemas";

import { ServicesModule } from "../services/services.module";
import { UsersModule } from "../users/users.module";
import { OrdersController } from "./controllers/orders.controller";
import { OrdersService } from "./services/orders.service";

@Module({
  imports: [
    OrderIM.getInjectionModel(),
    DeviceTokenIM.getInjectionModel(),
    UsersModule,
    ServicesModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
