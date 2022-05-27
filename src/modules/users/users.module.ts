import { Module } from "@nestjs/common";

import { DeviceTokenIM, UserIM } from "@/core/schemas";

import { UsersTestController } from "./controllers/test.controller";
import { UsersAuthController } from "./controllers/users-auth.controller";
import { UsersAuthService } from "./services/users-auth.service";
import { UsersTestService } from "./services/test.service";
import { UsersService } from "./services/users.service";
import { SmsModule } from "../sms/sms.module";

@Module({
  imports: [UserIM.getInjectionModel(), DeviceTokenIM.getInjectionModel(), SmsModule],
  controllers: [UsersTestController, UsersAuthController],
  providers: [UsersTestService, UsersAuthService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
