import { Module } from "@nestjs/common";

import { DeviceTokenIM } from "@/core/schemas";

import { UtilsController } from "./controllers/utils.controller";
import { UtilsService } from "./services/utils.service";
import { UsersModule } from "../users/users.module";
import { ServicesModule } from "../services/services.module";

@Module({
  imports: [ServicesModule, UsersModule, DeviceTokenIM.getInjectionModel()],
  controllers: [UtilsController],
  providers: [UtilsService],
})
export class UtilsModule {}
