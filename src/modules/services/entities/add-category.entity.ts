import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsMongoId, IsString } from "class-validator";

export class AddCategoryDto {
  @ApiProperty({
    description: "Наименование категории",
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Порядок категории в списке",
    type: Number,
  })
  @IsInt()
  index: number;

  @ApiProperty({
    description: "Id продуктов",
    type: "array",
    items: {
      type: "string",
    },
  })
  @IsMongoId({ each: true })
  products: string[];
}
