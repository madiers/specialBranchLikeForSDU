import { HttpException } from "@nestjs/common";

export class CategoryNotFoundException extends HttpException {
  constructor(message?: string) {
    super(
      typeof message === "string"
        ? {
            message: message ?? "Category not found",
          }
        : message ?? { result: false },
      204
    );
  }
}
