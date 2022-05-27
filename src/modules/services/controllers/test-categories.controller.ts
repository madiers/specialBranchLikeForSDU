import { TokenPayload } from "@/@types";
import { ApiTest } from "@/core/decorators/api-test.decorator";
import { GetToken } from "@/core/decorators/get-token.decorator";
import { Protected } from "@/core/decorators/protected.decorator";
import {
  ApiBadValidationResponse,
  ApiServiceNotFoundResponse,
} from "@/core/documentation/common";
import { Body, Controller, Delete, Inject, Param, Post } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { TestAddCategoryDto } from "../entities/add-category.test-entity";
import { TestCategoriesService } from "../services/test-categories.service";

@ApiTest({
  tags: ["services/categories"],
})
@Controller("test/services/categories")
export class TestCategoriesController {
  @Inject(TestCategoriesService)
  private readonly service: TestCategoriesService;

  @Protected("service")
  @ApiOperation({
    description: "Добавить категорию к сервису из токена",
  })
  @Post("/")
  @ApiCreatedResponse({
    description: "Категория добавлена",
  })
  @ApiServiceNotFoundResponse()
  @ApiBadValidationResponse()
  public async getCategories(
    @Body() payload: TestAddCategoryDto,
    @GetToken() token: TokenPayload
  ) {
    await this.service.addCategory(token.phone, payload);

    return { result: true };
  }

  @Protected("service")
  @ApiOperation({
    description: "Удалить категорию у сервиса из токена",
  })
  @Delete("/:id")
  @ApiOkResponse({
    description: "Категория удалена",
  })
  @ApiNoContentResponse({
    description: "Сервис или категория не найдена",
  })
  public async deleteCategory(@Param("id") id: string, @GetToken() token: TokenPayload) {
    await this.service.deleteCategory(token.phone, id);

    return { result: true };
  }
}
