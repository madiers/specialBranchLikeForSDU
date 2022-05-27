import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class TestAddCategoryDto {
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
}
