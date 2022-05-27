import { Module } from "@nestjs/common";

import { AddressIM, DeviceTokenIM, ProductIM, ServiceIM } from "@/core/schemas";

import { ServicesController } from "./controllers/services.controller";
import { TestServicesController } from "./controllers/test.controller";
import { ServicesService } from "./services/services.service";
import { TestServicesService } from "./services/test.service";
import { ServicesAuthController } from "./controllers/services-auth.controller";
import { ServicesAuthService } from "./services/services-auth.service";
import { SmsModule } from "../sms/sms.module";
import { TestCategoriesController } from "./controllers/test-categories.controller";
import { TestCategoriesService } from "./services/test-categories.service";
import { CategoriesService } from "./services/categories.service";
import { CategoriesController } from "./controllers/categories.controller";

@Module({
  imports: [
    ServiceIM.getInjectionModel(),
    AddressIM.getInjectionModel(),
    ProductIM.getInjectionModel(),
    DeviceTokenIM.getInjectionModel(),
    SmsModule,
  ],
  controllers: [
    ServicesController,
    TestServicesController,
    ServicesAuthController,
    TestCategoriesController,
    CategoriesController,
  ],
  providers: [
    ServicesService,
    TestServicesService,
    ServicesAuthService,
    TestCategoriesService,
    CategoriesService,
  ],
  exports: [ServicesService],
})
export class ServicesModule {}
