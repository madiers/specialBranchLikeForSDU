import { ServiceCategoryStatus } from "@/core/schemas";
import { ApiProperty } from "@nestjs/swagger";

export class GetCategoriesEntity {
  @ApiProperty({
    description: "ObjectId категории",
    type: String,
  })
  _id: string;

  @ApiProperty({
    description: "Наименование категории",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "Порядок в списке категорий",
    type: Number,
  })
  index: number;

  @ApiProperty({
    description: "Статус категории",
    enum: Object.values(ServiceCategoryStatus),
  })
  status: ServiceCategoryStatus;

  @ApiProperty({
    description: "Количество продуктов",
    type: Number,
  })
  amount: number;
}
