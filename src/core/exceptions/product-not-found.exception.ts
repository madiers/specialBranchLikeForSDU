import { HttpException } from "@nestjs/common";

export class ProductNotFoundException extends HttpException {
  constructor(message?: string) {
    super(
      typeof message === "string"
        ? {
            message: message ?? "Product not found",
          }
        : message ?? { result: false },
      204
    );
  }
}
