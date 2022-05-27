import { ApiProperty } from "@nestjs/swagger";

export class GetDashboardEntity {
  @ApiProperty({
    description: "Количество категорий у сервиса",
  })
  totalCategories: number;

  @ApiProperty({
    description: "Количество продуктов у сервиса",
  })
  totalProducts: number;
}
