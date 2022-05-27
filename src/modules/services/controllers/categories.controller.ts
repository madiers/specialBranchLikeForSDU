import { TokenPayload } from "@/@types";
import { GetToken } from "@/core/decorators/get-token.decorator";
import { Protected } from "@/core/decorators/protected.decorator";
import { ApiBadValidationResponse } from "@/core/documentation/common";
import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AddCategoryDto } from "../entities/add-category.entity";
import { EditCategoryDto } from "../entities/edit-category.entity";
import { GetCategoriesEntity } from "../entities/get-categories.entity";
import { CategoriesService } from "../services/categories.service";

@ApiTags("services/categories")
@Controller("services/categories")
export class CategoriesController {
  @Inject(CategoriesService)
  private readonly service: CategoriesService;

  @Protected("service")
  @ApiOperation({
    description: "Получить список категорий сервиса из токена",
  })
  @Get("/")
  @ApiOkResponse({
    description: "Ok",
    type: GetCategoriesEntity,
    isArray: true,
  })
  public async getCategories(@GetToken() token: TokenPayload) {
    return this.service.getCategories(token.phone);
  }

  @Protected("service")
  @ApiOperation({
    description: "Добавить категорию к сервису из токена",
  })
  @Post("/")
  @ApiCreatedResponse({
    description: "Категория добавлена",
  })
  @ApiBadValidationResponse()
  public async addCategory(
    @Body() payload: AddCategoryDto,
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
  public async deleteCategory(@Param("id") id: string, @GetToken() token: TokenPayload) {
    await this.service.deleteCategory(token.phone, id);

    return { result: true };
  }

  @Protected("service")
  @ApiOperation({
    description: "Обновить категорию сервиса из токена",
  })
  @Put("/:id")
  @ApiOkResponse({
    description: "Категория обновлена",
  })
  @ApiBadValidationResponse()
  public async updateCategory(
    @Param("id") id: string,
    @GetToken() token: TokenPayload,
    @Body() payload: EditCategoryDto
  ) {
    await this.service.updateCategory(token.phone, id, payload);

    return { result: true };
  }
}
