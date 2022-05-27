import { Module } from "@nestjs/common";
import { SmsTestController } from "./controllers/test.controller";
import { SmsService } from "./services/sms.service";

@Module({
  controllers: [SmsTestController],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
