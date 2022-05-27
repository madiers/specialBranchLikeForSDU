import { ApiProperty } from "@nestjs/swagger";

export class RedisHealth {
  @ApiProperty({
    example: "OK",
    type: String,
    description: "Результат операции set",
  })
  result: "OK" | null;

  @ApiProperty({
    example: "0.12345678",
    type: String,
    description: "Значение полученное из базы",
  })
  value: string | null;

  @ApiProperty({
    example: "0.12345678",
    type: String,
    description: "Значение установленное в базу",
  })
  targetValue: string | null;
}
