import { Module } from "@nestjs/common";

import { HealthController } from "./controllers/health.controller";
import { HealthTestController } from "./controllers/test.controller";
import { HealthService } from "./services/health.service";

@Module({
  controllers: [HealthController, HealthTestController],
  providers: [HealthService],
})
export class HealthModule {}
