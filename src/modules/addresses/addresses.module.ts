import { Module } from "@nestjs/common";

import { AddressIM } from "@/core/schemas";
import { AddressesController } from "./controllers/addresses.controller";
import { AddressesService } from "./services/addresses.service";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [AddressIM.getInjectionModel(), UsersModule],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
