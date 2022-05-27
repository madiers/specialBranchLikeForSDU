import { Product } from "@/core/schemas";
import { ApiProperty } from "@nestjs/swagger";

export class GetPageDataEntity {
  @ApiProperty({
    description: "ObjectId категории",
  })
  _id?: string;

  @ApiProperty({
    description: "Наименование категории",
  })
  name: string;

  @ApiProperty({
    description: "Индекс категории в списке",
  })
  index: number;

  @ApiProperty({
    description: "Список продуктов категории",
    isArray: true,
    type: Product,
  })
  products: Product[];
}
