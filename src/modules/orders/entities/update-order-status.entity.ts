import { OrderStatus } from "@/core/schemas";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";

const statuses = Object.values(OrderStatus).filter((f) => f !== OrderStatus.PENDING);

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: "Статус заказа",
    enum: statuses,
  })
  @IsIn(statuses)
  status: OrderStatus;
}
